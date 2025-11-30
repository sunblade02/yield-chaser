// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol"; 
import { IYcAccount } from "./IYcAccount.sol";
import { YcRegistry } from "./YcRegistry.sol";
import { IYcStrategy } from "./IYcStrategy.sol";

/// @title Yield Chaser account
/// @author Jérémie Riquier
/// @notice This smart contract implements a Yield Chaser account. 
/// This account is owned exclusively by the user who can manage their funds.
/// The funds were moved on DeFi protocol according to a strategy defined by the user.
contract YcAccount is IYcAccount, Ownable {

    //----- ERRORS -----//

    error NoVault();
    error NoUSDC();
    error NoReallocationNecessary();
    error NotEnoughETH();
    error WithinNoReallocationPeriod();
    error NoVaultChange();

    //----- EVENTS -----//

    event USDCAllocated(uint amount, IVaultV2 vault);
    event USDCDisallocated(uint amount, IVaultV2 vault);
    event ETHReceived(address sender, uint amount);
    event NoReallocationPeriodUpdated(uint32 oldNoReallocationPeriod, uint32 newNoReallocationPeriod);

    //----- STATE VARIABLES -----//

    // Packing : 160 + 64 + 32 = 256
    ERC20 public usdc;
    uint64 public lastReallocation;
    uint32 public noReallocationPeriod;

    // Packing : 128 + 128 = 256
    uint128 public capital;
    uint128 public depositAmount;

    YcRegistry public registry;

    IYcStrategy public strategy;

    IVaultV2 public currentVault;

    //----- FUNCTIONS -----//

    constructor(YcRegistry _registry, ERC20 _usdc, IYcStrategy _strategy, address _owner, uint32 _noReallocationPeriod) Ownable(_owner) {
        registry = _registry;
        usdc = _usdc;
        strategy = _strategy;
        noReallocationPeriod = _noReallocationPeriod;
    }

    /// @notice Allocates USDC to the highest performing yield vault according to the strategy.
    function allocate() public {
        uint amount = usdc.balanceOf(address(this));
        require(amount > 0, NoUSDC());

        capital = uint128(amount);
        depositAmount += uint128(amount);

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
    }

    /// @notice Reallocates USDC to the highest performing yield vault according to the strategy.
    /// The account pays fees to the registry.
    /// The account receives 1 YCT.
    /// The sender is refunded for the gas cost.
    /// @dev reentrancy attack / DoS Gas limit
    function reallocate() external {
        (IVaultV2 vault, uint128 ethFixedReallocationFee) = checkReallocation();

        lastReallocation = uint64(block.timestamp);

        IVaultV2 disallocationVault = currentVault;
        currentVault = vault;

        uint yield;
        uint fee;
        uint128 delta;

        if (address(disallocationVault) != address(0)) {
            uint shares = disallocationVault.balanceOf(address(this));
            if (shares > 0) {
                uint amount = disallocationVault.previewRedeem(shares);
                
                if (amount > depositAmount) {
                    yield = amount - depositAmount;
                    uint16 usdcYieldFeeRate = registry.usdcYieldFeeRate();
                    fee = yield * usdcYieldFeeRate / 10**5;
                }

                delta = depositAmount - capital;

                delete depositAmount;

                disallocationVault.redeem(shares, address(this), address(this));

                emit USDCDisallocated(amount, disallocationVault);

                if (fee > 0) {
                    usdc.transfer(address(registry), fee);
                }
            }
        }

        allocate();

        if (delta > 0) {
            capital -= delta;
        }

        if (yield > 0) {
            capital -= uint128(yield - fee);
        }

        registry.mintYct();

        payable(address(registry)).transfer(ethFixedReallocationFee);

        uint256 cost = gasleft() * tx.gasprice;
        payable(msg.sender).transfer(cost);
    }

    /// @notice Checks for reallocation and returns used data
    function checkReallocation() public view returns (IVaultV2, uint128) {
        uint128 ethFixedReallocationFee = registry.ethFixedReallocationFee();

        require(address(this).balance >= ethFixedReallocationFee, NotEnoughETH());

        require(block.timestamp - lastReallocation >= noReallocationPeriod, WithinNoReallocationPeriod());

        IVaultV2 vault = strategy.getBestVault();
        require(vault != currentVault, NoVaultChange());

        return (vault, ethFixedReallocationFee);
    }

    /// @notice Set the no reallocation period in seconds
    /// This function can only be called by the owner.
    function setNoReallocationPeriod(uint32 _noReallocationPeriod) external onlyOwner {
        (noReallocationPeriod, _noReallocationPeriod) = (_noReallocationPeriod, noReallocationPeriod);

        emit NoReallocationPeriodUpdated(_noReallocationPeriod, noReallocationPeriod);
    }

    receive() payable external {
        emit ETHReceived(msg.sender, msg.value);
    }
}