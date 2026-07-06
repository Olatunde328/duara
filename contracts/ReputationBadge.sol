// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ReputationBadge - Soulbound (non-transferable) NFT badges for reliable savers
/// @notice Minted by the CircleSavings contract (set as `minter`) when a member
///         hits a streak milestone. Cannot be transferred or sold - pure reputation.
contract ReputationBadge is ERC721, Ownable {
    address public minter;
    uint256 public nextTokenId;

    // tokenId => milestone tier (e.g. 1 = "3 cycles", 2 = "10 cycles", 3 = "25 cycles")
    mapping(uint256 => uint8) public tier;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, uint8 tier);

    constructor() ERC721("Duara Reputation Badge", "DUARA-REP") Ownable(msg.sender) {}

    modifier onlyMinter() {
        require(msg.sender == minter, "not authorized minter");
        _;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mintBadge(address to, uint8 badgeTier) external onlyMinter returns (uint256) {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        tier[tokenId] = badgeTier;
        emit BadgeMinted(to, tokenId, badgeTier);
        return tokenId;
    }

    /// @dev Block transfers to make this soulbound - only mint (from == address(0)) is allowed.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0), "soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }
}
