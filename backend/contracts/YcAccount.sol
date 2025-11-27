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

    //----- ERROR -----//

    error NoVault();

    //----- EVENTS -----//

    event USDCAllocated(uint amount, IVaultV2 vault);
    event ETHReceived(address sender, uint amount);

    //----- STATE VARIABLES -----//

    ERC20 public usdc;

    IYcStrategy public strategy;

    //----- FUNCTIONS -----//

    constructor(ERC20 _usdc, IYcStrategy _strategy, address _owner) Ownable(_owner) {
        usdc = _usdc;
        strategy = _strategy;
    }

    /// @notice Allocates USDC to the highest performing yield vault according to the strategy.
    function allocate() external {
        IVaultV2 vault = strategy.getBestVault();
        require(address(vault) != address(0), NoVault());

        uint amount = usdc.balanceOf(address(this));
        usdc.approve(address(vault), amount);
        vault.deposit(amount, address(this));

        emit USDCAllocated(amount, vault);
    }

    receive() payable external {
        emit ETHReceived(msg.sender, msg.value);
    }
}