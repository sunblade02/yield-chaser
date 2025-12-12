// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {VestingWallet} from "@openzeppelin/contracts/finance/VestingWallet.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

/// @title Yield Chaser ERC20 Token
/// @author Jérémie Riquier
/// @notice This smart contract is the official token of Yield Chaser. The main use of this token is for governance purposes.
contract YcToken is ERC20, ERC20Permit, ERC20Votes {

    //----- STATE VARIABLE -----//

    VestingWallet public teamVestingWallet;

    //----- FUNCTIONS -----//
    
    constructor(address _teamAddress) ERC20("YcToken", "YCT") ERC20Permit("YcToken") {
        uint64 durationSeconds = 63_072_000; // 2 years
        teamVestingWallet = new VestingWallet(_teamAddress, uint64(block.timestamp), durationSeconds);
        
        uint maxSupply = 21 * 10**24; // 21 M
        uint amountForTeam = maxSupply * 15 / 100;

        _mint(address(teamVestingWallet), amountForTeam);
        _mint(msg.sender, maxSupply - amountForTeam);

        _delegate(address(teamVestingWallet), _teamAddress);
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