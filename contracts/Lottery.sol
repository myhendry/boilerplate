// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is VRFConsumerBase, Ownable {
    address payable[] public players;
    uint256 public usdEntranceFee;
    AggregatorV3Interface internal ethUsdPriceFeed;
    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    LOTTERY_STATE public lotteryState;
    uint256 public fee;
    bytes32 public keyhash;
    address payable public latestWinner;
    uint256 public latestRandomNumber;
    event RequestedRandomNumber(bytes32 requestId);

    constructor(
        address _priceFeedAddress,
        address _vrfCoordinator,
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        usdEntranceFee = 10 * (10**18);
        ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        lotteryState = LOTTERY_STATE.CLOSED;
        fee = _fee;
        keyhash = _keyhash;
    }

    // Allows a player to enter the lottery by paying the entrance fee.
    function enter() public payable {
        require(lotteryState == LOTTERY_STATE.OPEN, "Lottery is not open.");
        require(
            msg.value >= getEntranceFee(),
            "Insufficient funds to enter the lottery"
        );
        players.push(payable(msg.sender));
    }

    // Calculates the entrance fee in ETH using a Chainlink oracle.
    function getEntranceFee() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint256 adjustedPrice = uint256(price) * 10**10;
        uint256 costToEnter = (usdEntranceFee * 10**18) / adjustedPrice;
        return costToEnter;
    }

    function startLottery() public onlyOwner {
        require(
            lotteryState == LOTTERY_STATE.CLOSED,
            "Lottery is already open."
        );
        lotteryState = LOTTERY_STATE.OPEN;
    }

    function getLinkBalance() external view returns (uint256) {
        return LINK.balanceOf(address(this));
    }

    // Ends the lottery and gets a random number from the VRF coordinator.
    function endLottery() public onlyOwner {
        require(lotteryState == LOTTERY_STATE.OPEN, "Lottery is not open.");
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        lotteryState = LOTTERY_STATE.CALCULATING_WINNER;
        bytes32 requestId = requestRandomness(keyhash, fee);
        emit RequestedRandomNumber(requestId);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    // Callback function called by the VRF coordinator when the random number is returned.
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness)
        internal
        override
    {
        require(
            lotteryState == LOTTERY_STATE.CALCULATING_WINNER,
            "Lottery is not in the calculating winner state."
        );
        require(_randomness > 0, "A random number was not found.");
        uint256 winnerIndex = _randomness % players.length;
        latestWinner = players[winnerIndex];
        latestWinner.transfer(address(this).balance);
        players = new address payable[](0);
        lotteryState = LOTTERY_STATE.CLOSED;
        latestRandomNumber = _randomness;
    }
}

// pragma solidity ^0.8.0;

// import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// // https://github.com/PatrickAlphaC/smartcontract-lottery/blob/main/contracts/Lottery.sol
// // https://github.com/dappuniversity/chainlink_betting_game/blob/update/src/contract/BettingGame.sol

// contract Lottery is Ownable, VRFConsumerBase {
//     address payable[] public players;
//     uint256 public usdEntryFee;
//     AggregatorV3Interface internal ethUsdPriceFeed;
//     enum LOTTERY_STATE {
//         OPEN,
//         CLOSED,
//         CALCULATING_WINNER
//     }
//     LOTTERY_STATE public lotteryState;
//     uint256 public fee;
//     bytes32 public keyhash;
//     address payable public latestWinner;
//     address payable public recentWinner;
//     uint256 public latestRandomNumber;
//     event RequestedRandomness(bytes32 requestId);

//     //uint256 public randomness;

//     //Network: Rinkeby
//     // https://docs.chain.link/docs/vrf-contracts/
//     // address constant VFRC_address = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B; // VRF Coordinator
//     // address constant LINK_address = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709; // LINK token
//     // //keyHash - one of the component from which will be generated final random value by Chainlink VFRC.
//     // bytes32 internal constant keyHash =
//     //     0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;

//     constructor(
//         address _priceFeedAddress,
//         address _vrfCoordinator,
//         address _link,
//         uint256 _fee,
//         bytes32 _keyhash
//     ) VRFConsumerBase(_vrfCoordinator, _link) {
//         usdEntryFee = 50 * (10**18);
//         ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
//         // ethUsdPriceFeed = AggregatorV3Interface(
//         //     0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
//         // );
//         lotteryState = LOTTERY_STATE.CLOSED;
//         fee = _fee;
//         //fee = 0.1 * 10**18; // 0.1 LINK expressed in wei
//         keyhash = _keyhash;
//     }

//     function enter() public payable {
//         // $50 minimum
//         require(lotteryState == LOTTERY_STATE.OPEN);
//         require(
//             msg.value >= getEntranceFee(),
//             "Not enough ETH to enter Lottery!"
//         );
//         players.push(payable(msg.sender));
//     }

//     function getEntranceFee() public view returns (uint256) {
//         (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
//         uint256 adjustedPrice = uint256(price) * 10**10; // 18 decimals
//         // $50, $2,000 / ETH
//         // 50/2,000
//         // 50 * 100000 / 2000
//         uint256 costToEnter = (usdEntryFee * 10**18) / adjustedPrice;
//         return costToEnter;
//     }

//     function startLottery() public {
//         require(
//             lotteryState == LOTTERY_STATE.CLOSED,
//             "Can't start a new lottery yet!"
//         );
//         lotteryState = LOTTERY_STATE.OPEN;
//     }

//     function endLottery() public {
//         require(lotteryState == LOTTERY_STATE.OPEN, "Lottery is not open.");
//         // uint256(
//         //     keccack256(
//         //         abi.encodePacked(
//         //             nonce, // nonce is preditable (aka, transaction number)
//         //             msg.sender, // msg.sender is predictable
//         //             block.difficulty, // can actually be manipulated by the miners!
//         //             block.timestamp // timestamp is predictable
//         //         )
//         //     )
//         // ) % players.length;
//         lotteryState = LOTTERY_STATE.CALCULATING_WINNER;
//         bytes32 requestId = requestRandomness(keyhash, fee);
//         emit RequestedRandomness(requestId);
//     }

//     // function getRandomNumber() public returns (bytes32 requestId) {
//     //     require(
//     //         LINK.balanceOf(address(this)) >= fee,
//     //         "Not enough LINK in contract"
//     //     );
//     //     return requestRandomness(keyHash, fee);
//     // }

//     function getPlayers() public view returns (address payable[] memory) {
//         return players;
//     }

//     function fulfillRandomness(bytes32 _requestId, uint256 _randomness)
//         internal
//         override
//     {
//         require(
//             lotteryState == LOTTERY_STATE.CALCULATING_WINNER,
//             "You aren't there yet!"
//         );
//         require(_randomness > 0, "random-not-found");
//         latestRandomNumber = _randomness;
//         uint256 indexOfWinner = _randomness % players.length;
//         recentWinner = players[indexOfWinner];
//         recentWinner.transfer(address(this).balance);
//         // Reset
//         players = new address payable[](0);
//         lotteryState = LOTTERY_STATE.CLOSED;
//     }
// }
