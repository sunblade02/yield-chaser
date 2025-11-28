// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol"; 
import { IYcAccount } from "./IYcAccount.sol";
import { IYcStrategy } from "./YcStrategy.sol";

/// @title Yield Chaser account
/// @author Jérémie Riquier
/// @notice This smart contract implements a Yield Chaser account. 
/// This account is owned exclusively by the user who can manage their funds.
/// The funds were moved on DeFi protocol according to a strategy defined by the user.
contract YcAccount is IYcAccount, Ownable {

    //----- ERRORS -----//

    error NoVault();
    error NoUSDC();

    //----- EVENTS -----//

    event USDCAllocated(uint amount, IVaultV2 vault);
    event ETHReceived(address sender, uint amount);
    event NoReallocationPeriodUpdated(uint32 oldNoReallocationPeriod, uint32 newNoReallocationPeriod);

    //----- STATE VARIABLES -----//

    // Packing : 160 + 64 + 32 = 256
    ERC20 public usdc;
    uint64 public lastReallocation;
    uint32 public noReallocationPeriod;

    IYcStrategy public strategy;

    IVaultV2 public currentVault;

    //----- FUNCTIONS -----//

    constructor(ERC20 _usdc, IYcStrategy _strategy, address _owner) Ownable(_owner) {
        usdc = _usdc;
        strategy = _strategy;
        noReallocationPeriod = 1 days;
    }

    /// @notice Allocates USDC to the highest performing yield vault according to the strategy.
    function allocate() external {
        uint amount = usdc.balanceOf(address(this));
        require(amount > 0, NoUSDC());

        // first allocation
        if (address(currentVault) == address(0)) {
            IVaultV2 vault = strategy.getBestVault();
            require(address(vault) != address(0), NoVault());
            currentVault = vault;
            lastReallocation = uint64(block.timestamp);
        }

        usdc.approve(address(currentVault), amount);
        currentVault.deposit(amount, address(this));

        emit USDCAllocated(amount, currentVault);
    }

    /// @notice Checks for reallocation
    function checkReallocation() external view returns (bool) {
        if (block.timestamp - lastReallocation < noReallocationPeriod) {
            return false;
        }

        IVaultV2 vault = strategy.getBestVault();

        return address(vault) != address(0) && vault != currentVault;
    }

    /// @notice Set the no reallocation period in seconds
    /// This function can only be called by the owner.
    function setNoReallocationPeriod(uint32 _noReallocationPeriod) external onlyOwner {
        uint32 oldNoReallocationPeriod = noReallocationPeriod;
        noReallocationPeriod = _noReallocationPeriod;

        emit NoReallocationPeriodUpdated(oldNoReallocationPeriod, noReallocationPeriod);
    }

    receive() payable external {
        emit ETHReceived(msg.sender, msg.value);
    }
}