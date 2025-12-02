// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol"; 
import { IYcStrategy } from "./IYcStrategy.sol";

/// @title Yield Chaser account interface
/// @author Jérémie Riquier
interface IYcAccount {
    function allocate() payable external;
    function reallocate() external;
    function checkReallocation() external view returns (IVaultV2, uint128);
    function setNoReallocationPeriod(uint32 _noReallocationPeriod) external;
    function enableReallocation() external;
    function disableReallocation() external;
}