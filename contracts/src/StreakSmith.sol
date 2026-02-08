// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StreakSmith is ERC721, Ownable {
    uint256 public totalSupply;
    string private _baseTokenURI;

    event BaseURIUpdated(string newBaseURI);

    constructor(address initialOwner, string memory baseURI_) ERC721("StreakSmith", "STREAK") Ownable(initialOwner) {
        _baseTokenURI = baseURI_;
    }

    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function mintNext(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = ++totalSupply;
        _safeMint(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
