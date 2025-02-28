// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MiroToken is ERC20 {
    uint256 public dailyLimit = 2; // 每天最多获取2枚代币
    // 修改为映射，记录每个用户的上次领取时间
    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public userClaims; // 用户领取记录

    constructor() ERC20("MiroToken", "MIRO") {
        // 初始化时给合约地址铸造一定数量的代币
        _mint(address(this), 1000000 * (10 ** uint256(decimals())));
        // 输出合约初始余额，用于调试
        emit TokenBalanceChanged(address(this), balanceOf(address(this)));
    }

    event TokenClaimed(address indexed user, uint256 amount);
    event TokenBalanceChanged(address indexed account, uint256 balance);

    function claim() external {
        // 检查当前用户是否已经超过一天没有领取
        require(block.timestamp > lastClaimTime[msg.sender] + 1 days, "Must wait a day to claim");
        // 检查合约是否有足够的代币可供领取
        require(balanceOf(address(this)) >= dailyLimit, "Not enough tokens in the contract");

        userClaims[msg.sender] += dailyLimit;
        // 从合约地址转移代币给用户
        _transfer(address(this), msg.sender, dailyLimit);
        // 更新当前用户的上次领取时间
        lastClaimTime[msg.sender] = block.timestamp;

        emit TokenClaimed(msg.sender, dailyLimit);
        // 输出合约余额变化，用于调试
        emit TokenBalanceChanged(address(this), balanceOf(address(this)));
    }

    // 重写 decimals 函数，将小数位数设置为 0
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
