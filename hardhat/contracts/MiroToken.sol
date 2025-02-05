// contracts/MiroToken.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract MiroToken {
    string public name = "MiroToken";
    string public symbol = "MIRO";
    uint256 public totalSupply;
    mapping(address => uint256) public balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply;
        balances[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balances[msg.sender] >= value, "Insufficient balance");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    function mint(address to, uint256 value) public {
        require(msg.sender == owner(), "Only the owner can mint tokens");
        balances[to] += value;
        totalSupply += value;
        emit Transfer(address(0), to, value);
    }

    function owner() public view returns (address) {
        return msg.sender;
    }
}
