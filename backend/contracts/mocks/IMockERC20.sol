// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IMockERC20 is IERC20 {
    function faucet(address _address, uint _amount) external;
}