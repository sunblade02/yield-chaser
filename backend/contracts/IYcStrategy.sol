// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol"; 

/// @title Yield Chaser strategy interface
/// @author Jérémie Riquier
interface IYcStrategy {
    function addVault(IVaultV2 _vault) external;
    function updateVaultsNetAPY(IVaultV2[] memory _vaults, uint[] memory vaultsNetApy) external;
    function getBestVault() external view returns(IVaultV2);
}