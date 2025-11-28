// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IVaultV2 } from "./morpho-org/vault-v2/src/interfaces/IVaultV2.sol";
import { IYcStrategy } from "./IYcStrategy.sol"; 

/// @title Yield Chaser strategy
/// @author Jérémie Riquier
/// @notice This smart contract implements the logic to select the vault with the best yield.
/// It maintains a list of vaults used in the strategy.
contract YcStrategy is IYcStrategy, Ownable {

    //----- EVENTS -----//

    event VaultAdded(IVaultV2 vault);
    event VaultsNetAPYUpdated(IVaultV2[] vault, uint[] netAPY);
    event NameSet(string oldName, string newName);

    //----- STATE VARIABLES -----//

    string public name;

    IVaultV2[] public vaultsArray;

    /// @dev Stores the net APY of each vault, scaled by 10^4 (i.e., 4 decimals).
    mapping(IVaultV2 => uint) public vaults;

    //----- FUNCTIONS -----//

    constructor(string memory _name, IVaultV2[] memory _vaults) Ownable(msg.sender) {
        name = _name;
        
        for (uint i; i < _vaults.length; i++) {
            _addVault(_vaults[i]);
        }
    }

    /// @notice Adds a vault to the strategy.
    /// This function can only be called by the owner.
    function addVault(IVaultV2 _vault) public onlyOwner {
        _addVault(_vault);

        emit VaultAdded(_vault);
    }

    function _addVault(IVaultV2 _vault) private {
        vaultsArray.push(_vault);
    }

    /// @notice Set the strategy's name
    /// This function can only be called by the owner.
    function setName(string memory _name) external onlyOwner {
        string memory oldName = name;
        name = _name;

        emit NameSet(oldName, name);
    }

    /// @notice Update the net APY of the strategy's vaults.
    /// This function can only be called by the owner.
    function updateVaultsNetAPY(IVaultV2[] memory _vaults, uint[] memory _vaultsNetApy) external onlyOwner {
        for (uint i; i < _vaults.length; i++) {
            if (i < _vaultsNetApy.length) {
                vaults[_vaults[i]] = _vaultsNetApy[i];
            }
        }

        emit VaultsNetAPYUpdated(_vaults, _vaultsNetApy);
    }

    /// @notice Returns the vault with the best yield based on the yield data.
    function getBestVault() external view returns(IVaultV2) {
        IVaultV2 bestVault;
        uint bestNetAPY;

        for (uint i; i < vaultsArray.length; i++) {
            IVaultV2 vault = vaultsArray[i];
            if (vaults[vault] >= bestNetAPY) {
                bestVault = vault;
                bestNetAPY = vaults[vault];
            }
        }

        return bestVault;
    }

    /// @notice Returns the vaults in the strategy
    function getVaults() external view returns(IVaultV2[] memory) {
        return vaultsArray;
    }
}