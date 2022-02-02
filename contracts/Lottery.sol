// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <=0.9.0;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

// different versions for openzeppelin
//import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/PatrickAlphaC/smartcontract-lottery/blob/main/contracts/Lottery.sol
// https://github.com/dappuniversity/chainlink_betting_game/blob/update/src/contract/BettingGame.sol

contract Lottery is VRFConsumerBase {
    address payable[] public players;
    address payable public recentWinner;
    uint256 public randomness;
    uint256 public usdEntryFee;

    AggregatorV3Interface internal ethUsdPriceFeed;
    enum LOTTERY_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    LOTTERY_STATE public lottery_state;
    uint256 public fee;
    bytes32 public keyhash;
    event RequestedRandomness(bytes32 requestId);

    //Network: Rinkeby
    address constant VFRC_address = 0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B; // VRF Coordinator
    address constant LINK_address = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709; // LINK token
    //keyHash - one of the component from which will be generated final random value by Chainlink VFRC.
    bytes32 internal constant keyHash =
        0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;

    constructor()
        public
        // address _priceFeedAddress,
        // address _vrfCoordinator,
        // address _link,
        // uint256 _fee,
        // bytes32 _keyhash
        VRFConsumerBase(VFRC_address, LINK_address)
    {
        usdEntryFee = 50 * (10**18);
        // ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        ethUsdPriceFeed = AggregatorV3Interface(
            0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        );
        lottery_state = LOTTERY_STATE.CLOSED;
        // fee = _fee;
        fee = 0.1 * 10**18; // 0.1 LINK
        // keyhash = _keyhash;
    }

    function enter() public payable {
        // $50 minimum
        require(lottery_state == LOTTERY_STATE.OPEN);
        require(msg.value >= getEntranceFee(), "Not enough ETH!");
        players.push(msg.sender);
    }

    function getEntranceFee() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint256 adjustedPrice = uint256(price) * 10**10; // 18 decimals
        // $50, $2,000 / ETH
        // 50/2,000
        // 50 * 100000 / 2000
        uint256 costToEnter = (usdEntryFee * 10**18) / adjustedPrice;
        return costToEnter;
    }

    function startLottery() public {
        require(
            lottery_state == LOTTERY_STATE.CLOSED,
            "Can't start a new lottery yet!"
        );
        lottery_state = LOTTERY_STATE.OPEN;
    }

    function endLottery() public {
        // uint256(
        //     keccack256(
        //         abi.encodePacked(
        //             nonce, // nonce is preditable (aka, transaction number)
        //             msg.sender, // msg.sender is predictable
        //             block.difficulty, // can actually be manipulated by the miners!
        //             block.timestamp // timestamp is predictable
        //         )
        //     )
        // ) % players.length;
        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        bytes32 requestId = requestRandomness(keyhash, fee);
        emit RequestedRandomness(requestId);
    }

    function fulfillRandomness(bytes32 _requestId, uint256 _randomness)
        internal
        override
    {
        require(
            lottery_state == LOTTERY_STATE.CALCULATING_WINNER,
            "You aren't there yet!"
        );
        require(_randomness > 0, "random-not-found");
        uint256 indexOfWinner = _randomness % players.length;
        recentWinner = players[indexOfWinner];
        recentWinner.transfer(address(this).balance);
        // Reset
        players = new address payable[](0);
        lottery_state = LOTTERY_STATE.CLOSED;
        randomness = _randomness;
    }
}
