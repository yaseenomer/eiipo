// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract EIIPO is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable owner;

    mapping(uint256 => Certificate) private idToCertificate;

    struct Certificate {
      uint256 tokenId;
      address payable seller;
      address payable owner;
      uint userId;
    }

    event CertificateCreated (
      uint256 indexed tokenId,
      address seller,
      address owner,
      uint userId
    );

    constructor() ERC721("Electronic International Invention Patent Office", "EIIPO") {
      owner = payable(msg.sender);
    }

    
  
    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint userId) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, tokenURI);
      createCertificate(newTokenId, userId);
      return newTokenId;
    }

    function createCertificate(
      uint256 tokenId,
      uint userId
    ) private {

      idToCertificate[tokenId] =  Certificate(
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        userId
      );

      _transfer(msg.sender, address(this), tokenId);
      emit CertificateCreated(
        tokenId,
        msg.sender,
        address(this),
        userId
      );
    }



    /* Returns all unsold market items */
    function fetchCertificates() public view returns (Certificate[] memory) {
      uint itemCount = _tokenIds.current();
      uint currentIndex = 0;

      Certificate[] memory items = new Certificate[](itemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToCertificate[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          Certificate storage currentItem = idToCertificate[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchCertificatesByuserId(uint userId) public view returns (Certificate[] memory) {
      uint totalItemCount = _tokenIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToCertificate[i + 1].userId == userId) {
          itemCount += 1;
        }
      }

      Certificate[] memory items = new Certificate[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToCertificate[i + 1].userId == userId) {
          uint currentId = i + 1;
          Certificate storage currentItem = idToCertificate[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

}
