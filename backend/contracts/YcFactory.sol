// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IYcAccount } from "./IYcAccount.sol";
import { YcAccount } from "./YcAccount.sol";
import { IYcFactory } from "./IYcFactory.sol";
import { YcRegistry } from "./YcRegistry.sol";
import { IYcStrategy } from "./IYcStrategy.sol"; 

/// @title Yield Chaser factory
/// @author Jérémie Riquier
/// @notice This smart contract creates Yield Chaser accounts.
contract YcFactory is IYcFactory, Ownable {

    //----- EVENT -----//

    event AccountCreated(address indexed owner, IYcAccount account, IYcStrategy _strategy);

    //----- FUNCTIONS -----//

    constructor() Ownable(msg.sender) {
    }

    /// @notice Creates a new account with the USDC address and a strategy for the registry.
    /// This function can only be called by the owner (the registry).
    function createAccount(ERC20 _usdc, IYcStrategy _strategy, address _owner, uint32 _noReallocationPeriod) external onlyOwner returns(IYcAccount) {
        IYcAccount account = new YcAccount(YcRegistry(payable(msg.sender)), _usdc, _strategy, _owner, _noReallocationPeriod);

        emit AccountCreated(_owner, account, _strategy);

        return account;
    }
}