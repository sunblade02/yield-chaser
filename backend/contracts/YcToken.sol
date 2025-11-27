// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Yield Chaser ERC20 Token
/// @author Jérémie Riquier
/// @notice This smart contract is the official token of Yield Chaser. The main use of this token is for governance purposes.
contract YcToken is ERC20, Ownable, ERC20Permit, ERC20Votes {

    //----- FUNCTIONS -----//
    
    constructor() ERC20("YcToken", "YCT") Ownable(msg.sender) ERC20Permit("YcToken") {
    }

    /// @notice Mints an amount of YCT for the specified address.
    /// This function can only be called by the owner (the registry).
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    /// @inheritdoc ERC20Permit
    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}