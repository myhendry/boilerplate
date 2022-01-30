//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract MemoryToken is ERC721URIStorage {
    // counters for keeping track of tokenIds
    using Counters for Counters.Counter;

    Counters.Counter private _nftTokenCount;
    string public nickName;

    // address contractAddress;

    constructor(string memory _nickName) ERC721("Hendry", "HL") {
        // contractAddress = _contractAddress;
        nickName = _nickName;
    }

    function setName(string memory _newName) public {
        nickName = _newName;
    }

    function mint(address _to, string memory _tokenURI) public returns (bool) {
        _nftTokenCount.increment();
        uint256 _tokenId = _nftTokenCount.current();

        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        return true;
    }

    function totalSupply() external view returns (uint256) {
        return _nftTokenCount.current();
    }
}
