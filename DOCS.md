# Yield Chaser Solidity API

## IYcAccount

### Contract
IYcAccount : contracts/IYcAccount.sol

 --- 
### Functions:
### allocate

```solidity
function allocate() external payable
```

### reallocate

```solidity
function reallocate() external
```

### checkReallocation

```solidity
function checkReallocation() external view returns (contract IVaultV2, uint128)
```

### setNoReallocationPeriod

```solidity
function setNoReallocationPeriod(uint32 _noReallocationPeriod) external
```

### enableReallocation

```solidity
function enableReallocation() external
```

### disableReallocation

```solidity
function disableReallocation() external
```

### withdraw

```solidity
function withdraw(uint256 _usdcAmount, uint256 _ethAmount) external
```

### getUsdcBalance

```solidity
function getUsdcBalance() external view returns (uint256, uint256)
```

### transferOwnership

```solidity
function transferOwnership(address _newOwner) external
```

## IYcFactory

### Contract
IYcFactory : contracts/IYcFactory.sol

 --- 
### Functions:
### createAccount

```solidity
function createAccount(contract ERC20 _usdc, contract IYcStrategy _strategy, address _owner, uint32 _noReallocationPeriod) external returns (contract IYcAccount)
```

## IYcStrategy

### Contract
IYcStrategy : contracts/IYcStrategy.sol

 --- 
### Functions:
### addVault

```solidity
function addVault(contract IVaultV2 _vault) external
```

### updateVaultsNetAPY

```solidity
function updateVaultsNetAPY(contract IVaultV2[] _vaults, uint32[] vaultsNetApy) external
```

### getBestVault

```solidity
function getBestVault() external view returns (contract IVaultV2)
```

### setName

```solidity
function setName(string _name) external
```

### getVaults

```solidity
function getVaults() external view returns (contract IVaultV2[])
```

## YcAccount

This smart contract implements a Yield Chaser account. 
This account is owned exclusively by the user who can manage their funds.
The funds were moved on DeFi protocol according to a strategy defined by the user.

### Contract
YcAccount : contracts/YcAccount.sol

 --- 
### Modifiers:
### enabled

```solidity
modifier enabled()
```

 --- 
### Functions:
### constructor

```solidity
constructor(contract YcRegistry _registry, contract ERC20 _usdc, contract IYcStrategy _strategy, address _owner, uint32 _noReallocationPeriod) public
```

### allocate

```solidity
function allocate() public payable
```

Allocates USDC to the highest performing yield vault according to the strategy.
This function can only be called when account is enabled.

### reallocate

```solidity
function reallocate() external
```

Reallocates USDC to the highest performing yield vault according to the strategy.
This function can only be called when account is enabled.
The account pays fees to the registry.
The account receives 1 YCT if available.
The sender is refunded for the gas cost.

### checkReallocation

```solidity
function checkReallocation() public view returns (contract IVaultV2, uint128)
```

Checks for reallocation and returns used data.
This function can only be called when account is enabled.

### setNoReallocationPeriod

```solidity
function setNoReallocationPeriod(uint32 _noReallocationPeriod) external
```

Sets the no reallocation period in seconds.
This function can only be called by the owner.

### enableReallocation

```solidity
function enableReallocation() external
```

Enables the reallocation.
This function can only be called by the owner.

### disableReallocation

```solidity
function disableReallocation() external
```

Disables the reallocation.
This function can only be called by the owner.

### withdraw

```solidity
function withdraw(uint256 _usdcAmount, uint256 _ethAmount) public
```

Withdraws USDC from the account and the current vault and/or ETH.
This function can only be called by the owner.

### getUsdcBalance

```solidity
function getUsdcBalance() public view returns (uint256, uint256)
```

Gets the USDC balance of the account and the USDC balance in the current vault.
This function can only be called when account is enabled.

### close

```solidity
function close() external
```

Closes the account and withdraws all USDC from the account and the current vault and/or ETH.
This function can only be called by the owner.

### transferOwnership

```solidity
function transferOwnership(address _newOwner) public
```

_Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner._

### receive

```solidity
receive() external payable
```

inherits ReentrancyGuard:
### _reentrancyGuardEntered

```solidity
function _reentrancyGuardEntered() internal view returns (bool)
```

_Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
`nonReentrant` function in the call stack._

inherits Ownable:
### owner

```solidity
function owner() public view virtual returns (address)
```

_Returns the address of the current owner._

### _checkOwner

```solidity
function _checkOwner() internal view virtual
```

_Throws if the sender is not the owner._

### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

_Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby disabling any functionality that is only available to the owner._

### _transferOwnership

```solidity
function _transferOwnership(address newOwner) internal virtual
```

_Transfers ownership of the contract to a new account (`newOwner`).
Internal function without access restriction._

inherits IYcAccount:

 --- 
### Events:
### USDCAllocated

```solidity
event USDCAllocated(uint256 amount, contract IVaultV2 vault)
```

### USDCDisallocated

```solidity
event USDCDisallocated(uint256 amount, uint256 fee, contract IVaultV2 vault)
```

### ETHReceived

```solidity
event ETHReceived(address sender, uint256 amount)
```

### NoReallocationPeriodUpdated

```solidity
event NoReallocationPeriodUpdated(uint32 oldNoReallocationPeriod, uint32 newNoReallocationPeriod)
```

### ReallocationEnabled

```solidity
event ReallocationEnabled()
```

### ReallocationDisabled

```solidity
event ReallocationDisabled()
```

### ETHWithdrawn

```solidity
event ETHWithdrawn(uint256 amount)
```

### Closed

```solidity
event Closed()
```

inherits ReentrancyGuard:
inherits Ownable:
### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

inherits IYcAccount:

## YcFactory

This smart contract creates Yield Chaser accounts.

### Contract
YcFactory : contracts/YcFactory.sol

 --- 
### Functions:
### constructor

```solidity
constructor() public
```

### createAccount

```solidity
function createAccount(contract ERC20 _usdc, contract IYcStrategy _strategy, address _owner, uint32 _noReallocationPeriod) external returns (contract IYcAccount)
```

Creates a new account with the USDC address and a strategy for the registry.
This function can only be called by the owner (the registry).

inherits Ownable:
### owner

```solidity
function owner() public view virtual returns (address)
```

_Returns the address of the current owner._

### _checkOwner

```solidity
function _checkOwner() internal view virtual
```

_Throws if the sender is not the owner._

### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

_Leaves the contract without owner. It will not be possible to call
`onlyOwner` functions. Can only be called by the current owner.

NOTE: Renouncing ownership will leave the contract without an owner,
thereby disabling any functionality that is only available to the owner._

### transferOwnership

```solidity
function transferOwnership(address newOwner) public virtual
```

_Transfers ownership of the contract to a new account (`newOwner`).
Can only be called by the current owner._

### _transferOwnership

```solidity
function _transferOwnership(address newOwner) internal virtual
```

_Transfers ownership of the contract to a new account (`newOwner`).
Internal function without access restriction._

inherits IYcFactory:

 --- 
### Events:
### AccountCreated

```solidity
event AccountCreated(address owner, contract IYcAccount account, contract IYcStrategy _strategy)
```

inherits Ownable:
### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

inherits IYcFactory:

## YcRegistry

This smart contract centralizes the data from the Yield Chaser DApp : factory, token, accounts, strategies.

### Contract
YcRegistry : contracts/YcRegistry.sol

 --- 
### Functions:
### constructor

```solidity
constructor(contract ERC20 _usdc, uint128 _ethFixedReallocationFee, uint16 _usdcYieldFeeRate) public
```

### addStrategy

```solidity
function addStrategy(contract IYcStrategy _strategy) external
```

Adds a strategy to the registry.
This function can only be called by admin.
The strategy must be owned by the registry.

### createAccount

```solidity
function createAccount(contract IYcStrategy _strategy, uint256 _amount, uint32 _noReallocationPeriod) external payable returns (contract IYcAccount)
```

Creates a new account to the registry.
Transfers ETH to the account.
Attempts to Transfer USDC to the highest performing yield vault according to the selected strategy.
Transfers 1 YCT to the account.

### grantBotRole

```solidity
function grantBotRole(address _account) external returns (bool)
```

Grants the role `BOT ROLE` to an address
This function can only be called by admin.

### revokeBotRole

```solidity
function revokeBotRole(address _account) external returns (bool)
```

Revokes the role `BOT ROLE` from an address
This function can only be called by admin.

### addStrategyVault

```solidity
function addStrategyVault(contract IYcStrategy _strategy, contract IVaultV2 _vault) external
```

Adds a vault to a strategy.
This function can only be called by admin.

### updateStrategyVaultsNetAPY

```solidity
function updateStrategyVaultsNetAPY(contract IYcStrategy _strategy, contract IVaultV2[] _vaults, uint32[] _vaultsNetApy) external
```

Update the net APY of the vaults for a specified strategy.
This function can only be called by an authorized bot.

### setEthFixedReallocationFee

```solidity
function setEthFixedReallocationFee(uint128 _ethFixedReallocationFee) external
```

Set the ETH fixed reallocation fee used when a bot reallocate USDC from an account.
This function can only be called by admin.

### setUsdcYieldFeeRate

```solidity
function setUsdcYieldFeeRate(uint16 _usdcYieldFeeRate) external
```

Set the USDC Yield Fee rate used when a bot reallocate USDC from an account.
This function can only be called by admin.

### reward

```solidity
function reward(address _address) public
```

Transfers 1 YCT to the account.
This function can only be called by an account.

### withdrawUSDC

```solidity
function withdrawUSDC(uint256 _amount) external
```

Withdraws USDC from the registry.
This function can only be called by admin.

### withdrawETH

```solidity
function withdrawETH(uint256 _amount) external
```

Withdraws ETH from the registry.
This function can only be called by admin.

### transferAccount

```solidity
function transferAccount(address _from, address _to) external
```

Transfers an account.
This function can only be called by an account.

### closeAccount

```solidity
function closeAccount(address _owner) external
```

Closes an account.
This function can only be called by an account.

### getAccounts

```solidity
function getAccounts(uint256 _firstResult, uint256 _maxResult) external view returns (contract IYcAccount[])
```

Returns a batch of valid accounts

### receive

```solidity
receive() external payable
```

inherits AccessControl:
### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

### hasRole

```solidity
function hasRole(bytes32 role, address account) public view virtual returns (bool)
```

_Returns `true` if `account` has been granted `role`._

### _checkRole

```solidity
function _checkRole(bytes32 role) internal view virtual
```

_Reverts with an {AccessControlUnauthorizedAccount} error if `_msgSender()`
is missing `role`. Overriding this function changes the behavior of the {onlyRole} modifier._

### _checkRole

```solidity
function _checkRole(bytes32 role, address account) internal view virtual
```

_Reverts with an {AccessControlUnauthorizedAccount} error if `account`
is missing `role`._

### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) public view virtual returns (bytes32)
```

_Returns the admin role that controls `role`. See {grantRole} and
{revokeRole}.

To change a role's admin, use {_setRoleAdmin}._

### grantRole

```solidity
function grantRole(bytes32 role, address account) public virtual
```

_Grants `role` to `account`.

If `account` had not been already granted `role`, emits a {RoleGranted}
event.

Requirements:

- the caller must have ``role``'s admin role.

May emit a {RoleGranted} event._

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) public virtual
```

_Revokes `role` from `account`.

If `account` had been granted `role`, emits a {RoleRevoked} event.

Requirements:

- the caller must have ``role``'s admin role.

May emit a {RoleRevoked} event._

### renounceRole

```solidity
function renounceRole(bytes32 role, address callerConfirmation) public virtual
```

_Revokes `role` from the calling account.

Roles are often managed via {grantRole} and {revokeRole}: this function's
purpose is to provide a mechanism for accounts to lose their privileges
if they are compromised (such as when a trusted device is misplaced).

If the calling account had been revoked `role`, emits a {RoleRevoked}
event.

Requirements:

- the caller must be `callerConfirmation`.

May emit a {RoleRevoked} event._

### _setRoleAdmin

```solidity
function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual
```

_Sets `adminRole` as ``role``'s admin role.

Emits a {RoleAdminChanged} event._

### _grantRole

```solidity
function _grantRole(bytes32 role, address account) internal virtual returns (bool)
```

_Attempts to grant `role` to `account` and returns a boolean indicating if `role` was granted.

Internal function without access restriction.

May emit a {RoleGranted} event._

### _revokeRole

```solidity
function _revokeRole(bytes32 role, address account) internal virtual returns (bool)
```

_Attempts to revoke `role` from `account` and returns a boolean indicating if `role` was revoked.

Internal function without access restriction.

May emit a {RoleRevoked} event._

inherits ERC165:
inherits IERC165:
inherits IAccessControl:

 --- 
### Events:
### StrategyAdded

```solidity
event StrategyAdded(contract IYcStrategy strategy)
```

### AccountCreated

```solidity
event AccountCreated(address owner, contract IYcStrategy strategy, uint256 usdcAmount, uint256 ethAmount)
```

### StrategyNetAPYsUpdated

```solidity
event StrategyNetAPYsUpdated(address bot, contract IYcStrategy strategy)
```

### EthFixedReallocationFeeSet

```solidity
event EthFixedReallocationFeeSet(uint128 oldEthFixedReallocationFee, uint128 newEthFixedReallocationFee)
```

### UsdcYieldFeeRateSet

```solidity
event UsdcYieldFeeRateSet(uint16 oldUsdcYieldFeeRate, uint16 newUsdcYieldFeeRate)
```

### StrategyVaultAdded

```solidity
event StrategyVaultAdded(contract IYcStrategy strategy, contract IVaultV2 vault)
```

### ETHReceived

```solidity
event ETHReceived(address sender, uint256 amount)
```

### AccountTransfered

```solidity
event AccountTransfered(address from, address to)
```

### AccountClosed

```solidity
event AccountClosed(address owner, contract IYcAccount account)
```

### RewardEmitted

```solidity
event RewardEmitted(address owner, uint256 amount)
```

inherits AccessControl:
inherits ERC165:
inherits IERC165:
inherits IAccessControl:
### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 role, bytes32 previousAdminRole, bytes32 newAdminRole)
```

_Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`

`DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
{RoleAdminChanged} not being emitted to signal this._

### RoleGranted

```solidity
event RoleGranted(bytes32 role, address account, address sender)
```

_Emitted when `account` is granted `role`.

`sender` is the account that originated the contract call. This account bears the admin role (for the granted role).
Expected in cases where the role was granted using the internal {AccessControl-_grantRole}._

### RoleRevoked

```solidity
event RoleRevoked(bytes32 role, address account, address sender)
```

_Emitted when `account` is revoked `role`.

`sender` is the account that originated the contract call:
  - if using `revokeRole`, it is the admin role bearer
  - if using `renounceRole`, it is the role bearer (i.e. `account`)_

## YcToken

This smart contract is the official token of Yield Chaser. The main use of this token is for governance purposes.

### Contract
YcToken : contracts/YcToken.sol

 --- 
### Functions:
### constructor

```solidity
constructor(address _teamAddress) public
```

### _update

```solidity
function _update(address from, address to, uint256 value) internal
```

### nonces

```solidity
function nonces(address owner) public view returns (uint256)
```

_Returns the current nonce for `owner`. This value must be
included whenever a signature is generated for {permit}.

Every successful call to {permit} increases ``owner``'s nonce by one. This
prevents a signature from being used multiple times._

inherits ERC20Votes:
### _maxSupply

```solidity
function _maxSupply() internal view virtual returns (uint256)
```

_Maximum token supply. Defaults to `type(uint208).max` (2^208^ - 1).

This maximum is enforced in {_update}. It limits the total supply of the token, which is otherwise a uint256,
so that checkpoints can be stored in the Trace208 structure used by {Votes}. Increasing this value will not
remove the underlying limitation, and will cause {_update} to fail because of a math overflow in
{Votes-_transferVotingUnits}. An override could be used to further restrict the total supply (to a lower value) if
additional logic requires it. When resolving override conflicts on this function, the minimum should be
returned._

### _getVotingUnits

```solidity
function _getVotingUnits(address account) internal view virtual returns (uint256)
```

_Returns the voting units of an `account`.

WARNING: Overriding this function may compromise the internal vote accounting.
`ERC20Votes` assumes tokens map to voting units 1:1 and this is not easy to change._

### numCheckpoints

```solidity
function numCheckpoints(address account) public view virtual returns (uint32)
```

_Get number of checkpoints for `account`._

### checkpoints

```solidity
function checkpoints(address account, uint32 pos) public view virtual returns (struct Checkpoints.Checkpoint208)
```

_Get the `pos`-th checkpoint for `account`._

inherits Votes:
### clock

```solidity
function clock() public view virtual returns (uint48)
```

_Clock used for flagging checkpoints. Can be overridden to implement timestamp based
checkpoints (and voting), in which case {CLOCK_MODE} should be overridden as well to match._

### CLOCK_MODE

```solidity
function CLOCK_MODE() public view virtual returns (string)
```

_Machine-readable description of the clock as specified in ERC-6372._

### _validateTimepoint

```solidity
function _validateTimepoint(uint256 timepoint) internal view returns (uint48)
```

_Validate that a timepoint is in the past, and return it as a uint48._

### getVotes

```solidity
function getVotes(address account) public view virtual returns (uint256)
```

_Returns the current amount of votes that `account` has._

### getPastVotes

```solidity
function getPastVotes(address account, uint256 timepoint) public view virtual returns (uint256)
```

_Returns the amount of votes that `account` had at a specific moment in the past. If the `clock()` is
configured to use block numbers, this will return the value at the end of the corresponding block.

Requirements:

- `timepoint` must be in the past. If operating using block numbers, the block must be already mined._

### getPastTotalSupply

```solidity
function getPastTotalSupply(uint256 timepoint) public view virtual returns (uint256)
```

_Returns the total supply of votes available at a specific moment in the past. If the `clock()` is
configured to use block numbers, this will return the value at the end of the corresponding block.

NOTE: This value is the sum of all available votes, which is not necessarily the sum of all delegated votes.
Votes that have not been delegated are still part of total supply, even though they would not participate in a
vote.

Requirements:

- `timepoint` must be in the past. If operating using block numbers, the block must be already mined._

### _getTotalSupply

```solidity
function _getTotalSupply() internal view virtual returns (uint256)
```

_Returns the current total supply of votes._

### delegates

```solidity
function delegates(address account) public view virtual returns (address)
```

_Returns the delegate that `account` has chosen._

### delegate

```solidity
function delegate(address delegatee) public virtual
```

_Delegates votes from the sender to `delegatee`._

### delegateBySig

```solidity
function delegateBySig(address delegatee, uint256 nonce, uint256 expiry, uint8 v, bytes32 r, bytes32 s) public virtual
```

_Delegates votes from signer to `delegatee`._

### _delegate

```solidity
function _delegate(address account, address delegatee) internal virtual
```

_Delegate all of `account`'s voting units to `delegatee`.

Emits events {IVotes-DelegateChanged} and {IVotes-DelegateVotesChanged}._

### _transferVotingUnits

```solidity
function _transferVotingUnits(address from, address to, uint256 amount) internal virtual
```

_Transfers, mints, or burns voting units. To register a mint, `from` should be zero. To register a burn, `to`
should be zero. Total supply of voting units will be adjusted with mints and burns._

### _moveDelegateVotes

```solidity
function _moveDelegateVotes(address from, address to, uint256 amount) internal virtual
```

_Moves delegated votes from one delegate to another._

### _numCheckpoints

```solidity
function _numCheckpoints(address account) internal view virtual returns (uint32)
```

_Get number of checkpoints for `account`._

### _checkpoints

```solidity
function _checkpoints(address account, uint32 pos) internal view virtual returns (struct Checkpoints.Checkpoint208)
```

_Get the `pos`-th checkpoint for `account`._

inherits IERC5805:
inherits IVotes:
inherits IERC6372:
inherits ERC20Permit:
### permit

```solidity
function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public virtual
```

_Sets `value` as the allowance of `spender` over ``owner``'s tokens,
given ``owner``'s signed approval.

IMPORTANT: The same issues {IERC20-approve} has related to transaction
ordering also apply here.

Emits an {Approval} event.

Requirements:

- `spender` cannot be the zero address.
- `deadline` must be a timestamp in the future.
- `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
over the EIP712-formatted function arguments.
- the signature must use ``owner``'s current nonce (see {nonces}).

For more information on the signature format, see the
https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
section].

CAUTION: See Security Considerations above._

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view virtual returns (bytes32)
```

_Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}._

inherits Nonces:
### _useNonce

```solidity
function _useNonce(address owner) internal virtual returns (uint256)
```

_Consumes a nonce.

Returns the current value and increments nonce._

### _useCheckedNonce

```solidity
function _useCheckedNonce(address owner, uint256 nonce) internal virtual
```

_Same as {_useNonce} but checking that `nonce` is the next valid for `owner`._

inherits EIP712:
### _domainSeparatorV4

```solidity
function _domainSeparatorV4() internal view returns (bytes32)
```

_Returns the domain separator for the current chain._

### _hashTypedDataV4

```solidity
function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32)
```

_Given an already https://eips.ethereum.org/EIPS/eip-712#definition-of-hashstruct[hashed struct], this
function returns the hash of the fully encoded EIP712 message for this domain.

This hash can be used together with {ECDSA-recover} to obtain the signer of a message. For example:

```solidity
bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(
    keccak256("Mail(address to,string contents)"),
    mailTo,
    keccak256(bytes(mailContents))
)));
address signer = ECDSA.recover(digest, signature);
```_

### eip712Domain

```solidity
function eip712Domain() public view virtual returns (bytes1 fields, string name, string version, uint256 chainId, address verifyingContract, bytes32 salt, uint256[] extensions)
```

_returns the fields and values that describe the domain separator used by this contract for EIP-712
signature._

### _EIP712Name

```solidity
function _EIP712Name() internal view returns (string)
```

_The name parameter for the EIP712 domain.

NOTE: By default this function reads _name which is an immutable value.
It only reads from storage if necessary (in case the value is too large to fit in a ShortString)._

### _EIP712Version

```solidity
function _EIP712Version() internal view returns (string)
```

_The version parameter for the EIP712 domain.

NOTE: By default this function reads _version which is an immutable value.
It only reads from storage if necessary (in case the value is too large to fit in a ShortString)._

inherits IERC5267:
inherits IERC20Permit:
inherits ERC20:
### name

```solidity
function name() public view virtual returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the symbol of the token, usually a shorter version of the
name._

### decimals

```solidity
function decimals() public view virtual returns (uint8)
```

_Returns the number of decimals used to get its user representation.
For example, if `decimals` equals `2`, a balance of `505` tokens should
be displayed to a user as `5.05` (`505 / 10 ** 2`).

Tokens usually opt for a value of 18, imitating the relationship between
Ether and Wei. This is the default value returned by this function, unless
it's overridden.

NOTE: This information is only used for _display_ purposes: it in
no way affects any of the arithmetic of the contract, including
{IERC20-balanceOf} and {IERC20-transfer}._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_Returns the value of tokens in existence._

### balanceOf

```solidity
function balanceOf(address account) public view virtual returns (uint256)
```

_Returns the value of tokens owned by `account`._

### transfer

```solidity
function transfer(address to, uint256 value) public virtual returns (bool)
```

_See {IERC20-transfer}.

Requirements:

- `to` cannot be the zero address.
- the caller must have a balance of at least `value`._

### allowance

```solidity
function allowance(address owner, address spender) public view virtual returns (uint256)
```

_Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called._

### approve

```solidity
function approve(address spender, uint256 value) public virtual returns (bool)
```

_See {IERC20-approve}.

NOTE: If `value` is the maximum `uint256`, the allowance is not updated on
`transferFrom`. This is semantically equivalent to an infinite approval.

Requirements:

- `spender` cannot be the zero address._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) public virtual returns (bool)
```

_See {IERC20-transferFrom}.

Skips emitting an {Approval} event indicating an allowance update. This is not
required by the ERC. See {xref-ERC20-_approve-address-address-uint256-bool-}[_approve].

NOTE: Does not update the allowance if the current allowance
is the maximum `uint256`.

Requirements:

- `from` and `to` cannot be the zero address.
- `from` must have a balance of at least `value`.
- the caller must have allowance for ``from``'s tokens of at least
`value`._

### _transfer

```solidity
function _transfer(address from, address to, uint256 value) internal
```

_Moves a `value` amount of tokens from `from` to `to`.

This internal function is equivalent to {transfer}, and can be used to
e.g. implement automatic token fees, slashing mechanisms, etc.

Emits a {Transfer} event.

NOTE: This function is not virtual, {_update} should be overridden instead._

### _mint

```solidity
function _mint(address account, uint256 value) internal
```

_Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
Relies on the `_update` mechanism

Emits a {Transfer} event with `from` set to the zero address.

NOTE: This function is not virtual, {_update} should be overridden instead._

### _burn

```solidity
function _burn(address account, uint256 value) internal
```

_Destroys a `value` amount of tokens from `account`, lowering the total supply.
Relies on the `_update` mechanism.

Emits a {Transfer} event with `to` set to the zero address.

NOTE: This function is not virtual, {_update} should be overridden instead_

### _approve

```solidity
function _approve(address owner, address spender, uint256 value) internal
```

_Sets `value` as the allowance of `spender` over the `owner`'s tokens.

This internal function is equivalent to `approve`, and can be used to
e.g. set automatic allowances for certain subsystems, etc.

Emits an {Approval} event.

Requirements:

- `owner` cannot be the zero address.
- `spender` cannot be the zero address.

Overrides to this logic should be done to the variant with an additional `bool emitEvent` argument._

### _approve

```solidity
function _approve(address owner, address spender, uint256 value, bool emitEvent) internal virtual
```

_Variant of {_approve} with an optional flag to enable or disable the {Approval} event.

By default (when calling {_approve}) the flag is set to true. On the other hand, approval changes made by
`_spendAllowance` during the `transferFrom` operation set the flag to false. This saves gas by not emitting any
`Approval` event during `transferFrom` operations.

Anyone who wishes to continue emitting `Approval` events on the`transferFrom` operation can force the flag to
true using the following override:

```solidity
function _approve(address owner, address spender, uint256 value, bool) internal virtual override {
    super._approve(owner, spender, value, true);
}
```

Requirements are the same as {_approve}._

### _spendAllowance

```solidity
function _spendAllowance(address owner, address spender, uint256 value) internal virtual
```

_Updates `owner`'s allowance for `spender` based on spent `value`.

Does not update the allowance value in case of infinite allowance.
Revert if not enough allowance is available.

Does not emit an {Approval} event._

inherits IERC20Errors:
inherits IERC20Metadata:
inherits IERC20:

 --- 
### Events:
inherits ERC20Votes:
inherits Votes:
inherits IERC5805:
inherits IVotes:
### DelegateChanged

```solidity
event DelegateChanged(address delegator, address fromDelegate, address toDelegate)
```

_Emitted when an account changes their delegate._

### DelegateVotesChanged

```solidity
event DelegateVotesChanged(address delegate, uint256 previousVotes, uint256 newVotes)
```

_Emitted when a token transfer or delegate change results in changes to a delegate's number of voting units._

inherits IERC6372:
inherits ERC20Permit:
inherits Nonces:
inherits EIP712:
inherits IERC5267:
### EIP712DomainChanged

```solidity
event EIP712DomainChanged()
```

_MAY be emitted to signal that the domain could have changed._

inherits IERC20Permit:
inherits ERC20:
inherits IERC20Errors:
inherits IERC20Metadata:
inherits IERC20:
### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

_Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero._

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

_Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance._

## IERC20

### Contract
IERC20 : contracts/morpho-org/vault-v2/src/interfaces/IERC20.sol

 --- 
### Functions:
### decimals

```solidity
function decimals() external view returns (uint8)
```

### name

```solidity
function name() external view returns (string)
```

### symbol

```solidity
function symbol() external view returns (string)
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

### transfer

```solidity
function transfer(address to, uint256 shares) external returns (bool success)
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 shares) external returns (bool success)
```

### approve

```solidity
function approve(address spender, uint256 shares) external returns (bool success)
```

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

## IERC2612

### Contract
IERC2612 : contracts/morpho-org/vault-v2/src/interfaces/IERC2612.sol

 --- 
### Functions:
### permit

```solidity
function permit(address owner, address spender, uint256 shares, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external
```

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

## IERC4626

### Contract
IERC4626 : contracts/morpho-org/vault-v2/src/interfaces/IERC4626.sol

 --- 
### Functions:
### asset

```solidity
function asset() external view returns (address)
```

### totalAssets

```solidity
function totalAssets() external view returns (uint256)
```

### convertToAssets

```solidity
function convertToAssets(uint256 shares) external view returns (uint256 assets)
```

### convertToShares

```solidity
function convertToShares(uint256 assets) external view returns (uint256 shares)
```

### deposit

```solidity
function deposit(uint256 assets, address onBehalf) external returns (uint256 shares)
```

### mint

```solidity
function mint(uint256 shares, address onBehalf) external returns (uint256 assets)
```

### withdraw

```solidity
function withdraw(uint256 assets, address onBehalf, address receiver) external returns (uint256 shares)
```

### redeem

```solidity
function redeem(uint256 shares, address onBehalf, address receiver) external returns (uint256 assets)
```

### previewDeposit

```solidity
function previewDeposit(uint256 assets) external view returns (uint256 shares)
```

### previewMint

```solidity
function previewMint(uint256 shares) external view returns (uint256 assets)
```

### previewWithdraw

```solidity
function previewWithdraw(uint256 assets) external view returns (uint256 shares)
```

### previewRedeem

```solidity
function previewRedeem(uint256 shares) external view returns (uint256 assets)
```

### maxDeposit

```solidity
function maxDeposit(address onBehalf) external view returns (uint256 assets)
```

### maxMint

```solidity
function maxMint(address onBehalf) external view returns (uint256 shares)
```

### maxWithdraw

```solidity
function maxWithdraw(address onBehalf) external view returns (uint256 assets)
```

### maxRedeem

```solidity
function maxRedeem(address onBehalf) external view returns (uint256 shares)
```

inherits IERC20:
### decimals

```solidity
function decimals() external view returns (uint8)
```

### name

```solidity
function name() external view returns (string)
```

### symbol

```solidity
function symbol() external view returns (string)
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

### transfer

```solidity
function transfer(address to, uint256 shares) external returns (bool success)
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 shares) external returns (bool success)
```

### approve

```solidity
function approve(address spender, uint256 shares) external returns (bool success)
```

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

## Caps

```solidity
struct Caps {
  uint256 allocation;
  uint128 absoluteCap;
  uint128 relativeCap;
}
```

## IVaultV2

### Contract
IVaultV2 : contracts/morpho-org/vault-v2/src/interfaces/IVaultV2.sol

 --- 
### Functions:
### virtualShares

```solidity
function virtualShares() external view returns (uint256)
```

### owner

```solidity
function owner() external view returns (address)
```

### curator

```solidity
function curator() external view returns (address)
```

### receiveSharesGate

```solidity
function receiveSharesGate() external view returns (address)
```

### sendSharesGate

```solidity
function sendSharesGate() external view returns (address)
```

### receiveAssetsGate

```solidity
function receiveAssetsGate() external view returns (address)
```

### sendAssetsGate

```solidity
function sendAssetsGate() external view returns (address)
```

### adapterRegistry

```solidity
function adapterRegistry() external view returns (address)
```

### isSentinel

```solidity
function isSentinel(address account) external view returns (bool)
```

### isAllocator

```solidity
function isAllocator(address account) external view returns (bool)
```

### firstTotalAssets

```solidity
function firstTotalAssets() external view returns (uint256)
```

### _totalAssets

```solidity
function _totalAssets() external view returns (uint128)
```

### lastUpdate

```solidity
function lastUpdate() external view returns (uint64)
```

### maxRate

```solidity
function maxRate() external view returns (uint64)
```

### adapters

```solidity
function adapters(uint256 index) external view returns (address)
```

### adaptersLength

```solidity
function adaptersLength() external view returns (uint256)
```

### isAdapter

```solidity
function isAdapter(address account) external view returns (bool)
```

### allocation

```solidity
function allocation(bytes32 id) external view returns (uint256)
```

### absoluteCap

```solidity
function absoluteCap(bytes32 id) external view returns (uint256)
```

### relativeCap

```solidity
function relativeCap(bytes32 id) external view returns (uint256)
```

### forceDeallocatePenalty

```solidity
function forceDeallocatePenalty(address adapter) external view returns (uint256)
```

### liquidityAdapter

```solidity
function liquidityAdapter() external view returns (address)
```

### liquidityData

```solidity
function liquidityData() external view returns (bytes)
```

### timelock

```solidity
function timelock(bytes4 selector) external view returns (uint256)
```

### abdicated

```solidity
function abdicated(bytes4 selector) external view returns (bool)
```

### executableAt

```solidity
function executableAt(bytes data) external view returns (uint256)
```

### performanceFee

```solidity
function performanceFee() external view returns (uint96)
```

### performanceFeeRecipient

```solidity
function performanceFeeRecipient() external view returns (address)
```

### managementFee

```solidity
function managementFee() external view returns (uint96)
```

### managementFeeRecipient

```solidity
function managementFeeRecipient() external view returns (address)
```

### canSendShares

```solidity
function canSendShares(address account) external view returns (bool)
```

### canReceiveShares

```solidity
function canReceiveShares(address account) external view returns (bool)
```

### canSendAssets

```solidity
function canSendAssets(address account) external view returns (bool)
```

### canReceiveAssets

```solidity
function canReceiveAssets(address account) external view returns (bool)
```

### multicall

```solidity
function multicall(bytes[] data) external
```

### setOwner

```solidity
function setOwner(address newOwner) external
```

### setCurator

```solidity
function setCurator(address newCurator) external
```

### setIsSentinel

```solidity
function setIsSentinel(address account, bool isSentinel) external
```

### setName

```solidity
function setName(string newName) external
```

### setSymbol

```solidity
function setSymbol(string newSymbol) external
```

### submit

```solidity
function submit(bytes data) external
```

### revoke

```solidity
function revoke(bytes data) external
```

### setIsAllocator

```solidity
function setIsAllocator(address account, bool newIsAllocator) external
```

### setReceiveSharesGate

```solidity
function setReceiveSharesGate(address newReceiveSharesGate) external
```

### setSendSharesGate

```solidity
function setSendSharesGate(address newSendSharesGate) external
```

### setReceiveAssetsGate

```solidity
function setReceiveAssetsGate(address newReceiveAssetsGate) external
```

### setSendAssetsGate

```solidity
function setSendAssetsGate(address newSendAssetsGate) external
```

### setAdapterRegistry

```solidity
function setAdapterRegistry(address newAdapterRegistry) external
```

### addAdapter

```solidity
function addAdapter(address account) external
```

### removeAdapter

```solidity
function removeAdapter(address account) external
```

### increaseTimelock

```solidity
function increaseTimelock(bytes4 selector, uint256 newDuration) external
```

### decreaseTimelock

```solidity
function decreaseTimelock(bytes4 selector, uint256 newDuration) external
```

### abdicate

```solidity
function abdicate(bytes4 selector) external
```

### setPerformanceFee

```solidity
function setPerformanceFee(uint256 newPerformanceFee) external
```

### setManagementFee

```solidity
function setManagementFee(uint256 newManagementFee) external
```

### setPerformanceFeeRecipient

```solidity
function setPerformanceFeeRecipient(address newPerformanceFeeRecipient) external
```

### setManagementFeeRecipient

```solidity
function setManagementFeeRecipient(address newManagementFeeRecipient) external
```

### increaseAbsoluteCap

```solidity
function increaseAbsoluteCap(bytes idData, uint256 newAbsoluteCap) external
```

### decreaseAbsoluteCap

```solidity
function decreaseAbsoluteCap(bytes idData, uint256 newAbsoluteCap) external
```

### increaseRelativeCap

```solidity
function increaseRelativeCap(bytes idData, uint256 newRelativeCap) external
```

### decreaseRelativeCap

```solidity
function decreaseRelativeCap(bytes idData, uint256 newRelativeCap) external
```

### setMaxRate

```solidity
function setMaxRate(uint256 newMaxRate) external
```

### setForceDeallocatePenalty

```solidity
function setForceDeallocatePenalty(address adapter, uint256 newForceDeallocatePenalty) external
```

### allocate

```solidity
function allocate(address adapter, bytes data, uint256 assets) external
```

### deallocate

```solidity
function deallocate(address adapter, bytes data, uint256 assets) external
```

### setLiquidityAdapterAndData

```solidity
function setLiquidityAdapterAndData(address newLiquidityAdapter, bytes newLiquidityData) external
```

### accrueInterest

```solidity
function accrueInterest() external
```

### accrueInterestView

```solidity
function accrueInterestView() external view returns (uint256 newTotalAssets, uint256 performanceFeeShares, uint256 managementFeeShares)
```

### forceDeallocate

```solidity
function forceDeallocate(address adapter, bytes data, uint256 assets, address onBehalf) external returns (uint256 penaltyShares)
```

inherits IERC2612:
### permit

```solidity
function permit(address owner, address spender, uint256 shares, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external
```

### nonces

```solidity
function nonces(address owner) external view returns (uint256)
```

### DOMAIN_SEPARATOR

```solidity
function DOMAIN_SEPARATOR() external view returns (bytes32)
```

inherits IERC4626:
### asset

```solidity
function asset() external view returns (address)
```

### totalAssets

```solidity
function totalAssets() external view returns (uint256)
```

### convertToAssets

```solidity
function convertToAssets(uint256 shares) external view returns (uint256 assets)
```

### convertToShares

```solidity
function convertToShares(uint256 assets) external view returns (uint256 shares)
```

### deposit

```solidity
function deposit(uint256 assets, address onBehalf) external returns (uint256 shares)
```

### mint

```solidity
function mint(uint256 shares, address onBehalf) external returns (uint256 assets)
```

### withdraw

```solidity
function withdraw(uint256 assets, address onBehalf, address receiver) external returns (uint256 shares)
```

### redeem

```solidity
function redeem(uint256 shares, address onBehalf, address receiver) external returns (uint256 assets)
```

### previewDeposit

```solidity
function previewDeposit(uint256 assets) external view returns (uint256 shares)
```

### previewMint

```solidity
function previewMint(uint256 shares) external view returns (uint256 assets)
```

### previewWithdraw

```solidity
function previewWithdraw(uint256 assets) external view returns (uint256 shares)
```

### previewRedeem

```solidity
function previewRedeem(uint256 shares) external view returns (uint256 assets)
```

### maxDeposit

```solidity
function maxDeposit(address onBehalf) external view returns (uint256 assets)
```

### maxMint

```solidity
function maxMint(address onBehalf) external view returns (uint256 shares)
```

### maxWithdraw

```solidity
function maxWithdraw(address onBehalf) external view returns (uint256 assets)
```

### maxRedeem

```solidity
function maxRedeem(address onBehalf) external view returns (uint256 shares)
```

inherits IERC20:
### decimals

```solidity
function decimals() external view returns (uint8)
```

### name

```solidity
function name() external view returns (string)
```

### symbol

```solidity
function symbol() external view returns (string)
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

### transfer

```solidity
function transfer(address to, uint256 shares) external returns (bool success)
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 shares) external returns (bool success)
```

### approve

```solidity
function approve(address spender, uint256 shares) external returns (bool success)
```

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

