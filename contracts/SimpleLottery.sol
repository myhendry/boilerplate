// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <=0.9.0;

// import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// https://dev.to/johbu/creating-a-lottery-with-hardhat-and-chainlink-385f

contract SimpleLottery is Ownable {
    address payable[] public players;

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value == 0.01 ether);
        players.push(payable(msg.sender));
    }

    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(owner(), block.timestamp)));
    }

    function pickWinner() external onlyOwner {
        uint256 index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);
        // reset array
        players = new address payable[](0);
    }

    function withdraw() external onlyOwner {}
}
