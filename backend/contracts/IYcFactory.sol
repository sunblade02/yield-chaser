// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IYcAccount } from "./IYcAccount.sol";
import { IYcStrategy } from "./IYcStrategy.sol";

/// @title Yield Chaser factory interface
/// @author Jérémie Riquier
interface IYcFactory {
    function createAccount(ERC20 _usdc, IYcStrategy _strategy, address _owner) external returns(IYcAccount);
}