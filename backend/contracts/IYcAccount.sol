// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IYcStrategy } from "./YcStrategy.sol";

/// @title Yield Chaser account interface
/// @author Jérémie Riquier
interface IYcAccount {
    function allocate() external;
}