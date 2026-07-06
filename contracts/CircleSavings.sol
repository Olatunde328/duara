// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Duara - Decentralized Rotating Savings Circles (Chama/ROSCA) for Celo + MiniPay
/// @notice Members contribute a fixed stablecoin amount each cycle; the full pot
///         rotates to a different member every cycle until everyone has been paid.
contract CircleSavings is ReentrancyGuard {
    IERC20 public immutable stablecoin; // e.g. cUSD on Celo mainnet

    struct Circle {
        address creator;
        address[] members;
        uint256 contributionAmount;
        uint256 cycleDuration; // seconds
        uint256 currentRound; // 0-indexed
        uint256 roundStart;
        bool active;
    }

    uint256 public circleCount;
    mapping(uint256 => Circle) public circles;

    // circleId => round => member => hasContributed
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public contributed;
    // circleId => round => number of members who have contributed
    mapping(uint256 => mapping(uint256 => uint256)) public contributionsCount;
    // member => number of completed full cycles across all circles (reputation)
    mapping(address => uint256) public completedCycles;

    event CircleCreated(uint256 indexed circleId, address indexed creator, uint256 contributionAmount, uint256 memberCount);
    event Contributed(uint256 indexed circleId, uint256 indexed round, address indexed member);
    event PayoutSent(uint256 indexed circleId, uint256 indexed round, address indexed recipient, uint256 amount);
    event CircleCompleted(uint256 indexed circleId);

    constructor(address _stablecoin) {
        stablecoin = IERC20(_stablecoin);
    }

    /// @notice Create a new savings circle. Members array defines the payout order (rotation).
    function createCircle(
        address[] calldata members,
        uint256 contributionAmount,
        uint256 cycleDuration
    ) external returns (uint256 circleId) {
        require(members.length >= 3, "need at least 3 members");
        require(contributionAmount > 0, "amount must be > 0");
        require(cycleDuration >= 1 days, "cycle too short");

        circleId = circleCount++;
        Circle storage c = circles[circleId];
        c.creator = msg.sender;
        c.contributionAmount = contributionAmount;
        c.cycleDuration = cycleDuration;
        c.roundStart = block.timestamp;
        c.active = true;

        for (uint256 i = 0; i < members.length; i++) {
            c.members.push(members[i]);
        }

        emit CircleCreated(circleId, msg.sender, contributionAmount, members.length);
    }

    /// @notice Contribute your share for the current round. Requires prior ERC20 approve().
    function contribute(uint256 circleId) external nonReentrant {
        Circle storage c = circles[circleId];
        require(c.active, "circle not active");
        require(_isMember(c, msg.sender), "not a member");
        require(!contributed[circleId][c.currentRound][msg.sender], "already contributed this round");

        contributed[circleId][c.currentRound][msg.sender] = true;
        contributionsCount[circleId][c.currentRound]++;

        require(
            stablecoin.transferFrom(msg.sender, address(this), c.contributionAmount),
            "transfer failed"
        );

        emit Contributed(circleId, c.currentRound, msg.sender);
    }

    /// @notice Anyone can trigger the payout once all members have contributed for the round.
    function triggerPayout(uint256 circleId) external nonReentrant {
        Circle storage c = circles[circleId];
        require(c.active, "circle not active");
        require(
            contributionsCount[circleId][c.currentRound] == c.members.length,
            "not all members have contributed"
        );

        address recipient = c.members[c.currentRound];
        uint256 payout = c.contributionAmount * c.members.length;

        completedCycles[recipient]++;

        c.currentRound++;
        c.roundStart = block.timestamp;

        require(stablecoin.transfer(recipient, payout), "payout transfer failed");
        emit PayoutSent(circleId, c.currentRound - 1, recipient, payout);

        if (c.currentRound == c.members.length) {
            c.active = false;
            emit CircleCompleted(circleId);
        }
    }

    function getMembers(uint256 circleId) external view returns (address[] memory) {
        return circles[circleId].members;
    }

    function getStreak(address member) external view returns (uint256) {
        return completedCycles[member];
    }

    function _isMember(Circle storage c, address who) internal view returns (bool) {
        for (uint256 i = 0; i < c.members.length; i++) {
            if (c.members[i] == who) return true;
        }
        return false;
    }
}