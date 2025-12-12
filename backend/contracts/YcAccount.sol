// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol"; 
import { IYcAccount } from "./IYcAccount.sol";
import { YcRegistry } from "./YcRegistry.sol";
import { IYcStrategy } from "./IYcStrategy.sol";

/// @title Yield Chaser account
/// @author Jérémie Riquier
/// @notice This smart contract implements a Yield Chaser account. 
/// This account is owned exclusively by the user who can manage their funds.
/// The funds were moved on DeFi protocol according to a strategy defined by the user.
contract YcAccount is IYcAccount, Ownable, ReentrancyGuard {

    //----- ERRORS -----//

    error NoVault();
    error NoUSDC();
    error NoReallocationNecessary();
    error NotEnoughETH();
    error WithinNoReallocationPeriod();
    error NoVaultChange();
    error ReallocationAlreadyEnabled();
    error ReallocationAlreadyDisabled();
    error ReallocationIsDisabled();
    error NoAmount();
    error NotEnoughUSDC();
    error Disabled();

    //----- EVENTS -----//

    event USDCAllocated(uint amount, IVaultV2 vault);
    event USDCDisallocated(uint amount, uint fee, IVaultV2 vault);
    event ETHReceived(address sender, uint amount);
    event NoReallocationPeriodUpdated(uint32 oldNoReallocationPeriod, uint32 newNoReallocationPeriod);
    event ReallocationEnabled();
    event ReallocationDisabled();
    event ETHWithdrawn(uint amount);
    event Closed();

    //----- STATE VARIABLES -----//

    // Packing : 160 + 64 + 32 = 256
    ERC20 public usdc;
    uint64 public lastReallocation;
    uint32 public noReallocationPeriod;

    // Packing : 64 + 64 + 1 + 1 = 130
    uint64 public capital;
    uint64 public depositAmount;
    bool public isReallocationEnabled;
    bool public isEnabled;

    YcRegistry public registry;

    IYcStrategy public strategy;

    IVaultV2 public currentVault;

    //----- MODIFIER -----//

    modifier enabled {
        require(isEnabled, Disabled());
        _;
    }

    //----- FUNCTIONS -----//

    constructor(YcRegistry _registry, ERC20 _usdc, IYcStrategy _strategy, address _owner, uint32 _noReallocationPeriod) Ownable(_owner) {
        registry = _registry;
        usdc = _usdc;
        strategy = _strategy;
        noReallocationPeriod = _noReallocationPeriod;
        isReallocationEnabled = true;
        isEnabled = true;
    }

    /// @notice Allocates USDC to the highest performing yield vault according to the strategy.
    /// This function can only be called when account is enabled.
    function allocate() payable public enabled {
        uint amount = usdc.balanceOf(address(this));
        require(amount > 0, NoUSDC());

        capital += uint64(amount);
        depositAmount += uint64(amount);

        // first allocation
        if (lastReallocation == 0) {
            IVaultV2 vault = strategy.getBestVault();
            require(address(vault) != address(0), NoVault());
            currentVault = vault;
            lastReallocation = uint64(block.timestamp);
        }

        usdc.approve(address(currentVault), amount);
        currentVault.deposit(amount, address(this));

        emit USDCAllocated(amount, currentVault);

        if (msg.value > 0) {
            emit ETHReceived(msg.sender, msg.value);
        }
    }

    /// @notice Disallocates USDC from a vault and returns the yield from the vault and the yield chaser fee.
    function disallocate(IVaultV2 _vault, bool _all, uint _usdcAmount) private returns(uint, uint) {
        uint shares = _vault.balanceOf(address(this));
        uint yield;
        uint fee;

        if (shares > 0) {
            uint totalAmount = _vault.previewRedeem(shares);
            uint usdcAmount = _all ? totalAmount : _usdcAmount;

            uint part = usdcAmount * 10**6 / totalAmount;

            if (totalAmount > depositAmount) {
                yield = (totalAmount - depositAmount) * part / 10**6;
                uint16 usdcYieldFeeRate = registry.usdcYieldFeeRate();
                fee = yield * usdcYieldFeeRate / 10**5;
            }

            if (_all) {
                delete capital;
                delete depositAmount;

                _vault.redeem(shares, address(this), address(this));
            } else {
                if (_usdcAmount > yield) {
                    depositAmount -= uint64(_usdcAmount - yield);
                    capital -= uint64(_usdcAmount - yield);
                }

                _vault.withdraw(usdcAmount, address(this), address(this));
            }

            emit USDCDisallocated(usdcAmount, fee, _vault);

            if (fee > 0) {
                usdc.transfer(address(registry), fee);
            }
        }

        return (yield, fee);
    }

    /// @notice Reallocates USDC to the highest performing yield vault according to the strategy.
    /// This function can only be called when account is enabled.
    /// The account pays fees to the registry.
    /// The account receives 1 YCT if available.
    /// The sender is refunded for the gas cost.
    function reallocate() external enabled {
        (IVaultV2 vault, uint128 ethFixedReallocationFee) = checkReallocation();

        lastReallocation = uint64(block.timestamp);

        IVaultV2 disallocationVault = currentVault;
        currentVault = vault;

        uint yield;
        uint fee;
        uint64 prevYield = depositAmount - capital;

        if (address(disallocationVault) != address(0)) {
            (yield, fee) = disallocate(disallocationVault, true, 0);
        }

        allocate();

        if (prevYield > 0) {
            capital -= prevYield;
        }

        if (yield > fee) {
            capital -= uint64(yield - fee);
        }

        registry.reward(owner());

        payable(address(registry)).transfer(ethFixedReallocationFee);

        uint256 cost = gasleft() * tx.gasprice;
        payable(msg.sender).transfer(cost);
    }

    /// @notice Checks for reallocation and returns used data.
    /// This function can only be called when account is enabled.
    function checkReallocation() public view enabled returns (IVaultV2, uint128) {
        require(isReallocationEnabled, ReallocationIsDisabled());

        uint128 ethFixedReallocationFee = registry.ethFixedReallocationFee();

        require(address(this).balance >= ethFixedReallocationFee, NotEnoughETH());

        require(block.timestamp - lastReallocation >= noReallocationPeriod, WithinNoReallocationPeriod());

        IVaultV2 vault = strategy.getBestVault();
        require(vault != currentVault, NoVaultChange());

        return (vault, ethFixedReallocationFee);
    }

    /// @notice Sets the no reallocation period in seconds.
    /// This function can only be called by the owner.
    function setNoReallocationPeriod(uint32 _noReallocationPeriod) external onlyOwner {
        (noReallocationPeriod, _noReallocationPeriod) = (_noReallocationPeriod, noReallocationPeriod);

        emit NoReallocationPeriodUpdated(_noReallocationPeriod, noReallocationPeriod);
    }

    /// @notice Enables the reallocation.
    /// This function can only be called by the owner.
    function enableReallocation() external onlyOwner {
        require(isReallocationEnabled == false, ReallocationAlreadyEnabled());
        
        isReallocationEnabled = true;

        emit ReallocationEnabled();
    }

    /// @notice Disables the reallocation.
    /// This function can only be called by the owner.
    function disableReallocation() external onlyOwner {
        require(isReallocationEnabled, ReallocationAlreadyDisabled());
        
        delete isReallocationEnabled;

        emit ReallocationDisabled();
    }

    /// @notice Withdraws USDC from the account and the current vault and/or ETH.
    /// This function can only be called by the owner.
    function withdraw(uint _usdcAmount, uint _ethAmount) public onlyOwner nonReentrant {
        require(address(this).balance >= _ethAmount, NotEnoughETH());
        require(_usdcAmount > 0 || _ethAmount > 0, NoAmount());

        if (_ethAmount > 0) {
            payable(msg.sender).transfer(_ethAmount);

            emit ETHWithdrawn(_ethAmount);
        }

        if (_usdcAmount > 0) {
            (uint usdcBalance, uint usdcBalanceFromVault) = getUsdcBalance();

            if (_usdcAmount > usdcBalance) {
                uint usdcAmountFromVault = _usdcAmount - usdcBalance;
                require(usdcAmountFromVault <= usdcBalanceFromVault, NotEnoughUSDC());

                (, uint fee) = disallocate(currentVault, usdcAmountFromVault == usdcBalanceFromVault, usdcAmountFromVault);

                if (fee > 0) {
                    _usdcAmount -= fee;
                }
            }

            usdc.transfer(msg.sender, _usdcAmount);
        }
    }

    /// @notice Gets the USDC balance of the account and the USDC balance in the current vault.
    /// This function can only be called when account is enabled.
    function getUsdcBalance() public view enabled returns(uint, uint) {
        uint usdcBalance = usdc.balanceOf(address(this));
        uint usdcBalanceFromVault;

        if (address(currentVault) != address(0)) {
            try currentVault.balanceOf(address(this)) returns (uint shares) {
                if (shares > 0) {
                    try currentVault.previewRedeem(shares) returns (uint vaultBalance) {
                        usdcBalanceFromVault = vaultBalance;
                    } catch {}
                }
            } catch {}
        }

        return (usdcBalance, usdcBalanceFromVault);
    }

    /// @notice Closes the account and withdraws all USDC from the account and the current vault and/or ETH.
    /// This function can only be called by the owner.
    function close() external onlyOwner {
        (uint usdcBalance, uint usdcBalanceFromVault) = getUsdcBalance();
        withdraw(usdcBalance + usdcBalanceFromVault, address(this).balance);

        delete usdc;
        delete strategy;
        delete noReallocationPeriod;
        delete lastReallocation;
        delete isReallocationEnabled;
        delete isEnabled;
        delete currentVault;

        registry.closeAccount(msg.sender);

        delete registry;

        renounceOwnership();

        emit Closed();
    }

    /// @inheritdoc Ownable
    function transferOwnership(address _newOwner) public override(IYcAccount, Ownable) onlyOwner {
        super.transferOwnership(_newOwner);
        registry.transferAccount(msg.sender, _newOwner);
    }

    receive() payable external enabled {
        emit ETHReceived(msg.sender, msg.value);
    }
}