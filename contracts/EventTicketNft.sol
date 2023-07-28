// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventTicketNft is ERC721, ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    mapping(string => uint256) public typeToPrice;
    mapping(string => uint256) public typeToPlace;
    address public deployer;

    Counters.Counter private _tokenIdCounter;
    mapping(string => uint256) public typeToPlaceCounter;

    constructor(string memory _eventName, string memory _eventSymbol , string[] memory _types, uint256[] memory _prices , uint256[] memory _places) ERC721(_eventName, _eventSymbol) {
        for (uint256 i = 0; i < _types.length; i++) {
            typeToPrice[_types[i]] = _prices[i];
            typeToPlace[_types[i]] = _places[i];
        }
        deployer=msg.sender;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function safeMint(string memory uri, string memory _type) public payable{
        uint256 tokenId = _tokenIdCounter.current();
        uint256 currentTokenTypeCounter=typeToPlaceCounter[_type]+1;
        _tokenIdCounter.increment();
        require(currentTokenTypeCounter<=typeToPlace[_type],"place limit reached for this type of ticket");
        require(msg.value>=typeToPrice[_type],"Insuffient funds for the type of ticket selected");
        payable(deployer).transfer(msg.value);
        typeToPlaceCounter[_type]++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}