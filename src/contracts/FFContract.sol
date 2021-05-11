// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;
contract FFContract {

    function ceil(uint a, uint m) internal pure returns (uint) {
        return ((a + m - 1) / m) * m;
    }

    function max(uint a, uint b) internal pure returns (uint) {
        uint maxValue;
        if (a > b) {
            maxValue = a;
        } else {
            maxValue = b;
        }
        return maxValue;
    }

    function calculatePayout(uint x) internal pure returns (uint, uint, uint) {
        uint payoutThird = max(1, ceil(x * 10 / 100, 1));
        uint payoutSecond = max(1, ceil(x * 30 / 100, 1));
        uint payoutFirst = x - payoutThird - payoutSecond;
        return (payoutFirst, payoutSecond, payoutThird);
    }

    struct Player {
        string name;
        address payable addr;
        bool hasPaid;
    }
    
    struct LeaguePlayer {
        string name;
        address payable addr;
    }
    
    address payable public commissioner;
    uint256 private entryFee;
    Player[] private players;    
    bool leagueStarted = false;
    bool leagueEnded = false;
    address firstPlaceAddr;
    address secondPlaceAddr;
    address thirdPlaceAddr;
    constructor(uint256 fee) {
        commissioner = payable(msg.sender);
        entryFee = fee;
    }
    
    // League functions
    function addPlayers(LeaguePlayer[] memory leaguePlayers) external isComissioner leagueHasNotStarted {
  
        for(uint i = 0; i < leaguePlayers.length; ++i) {
            require(bytes(leaguePlayers[i].name).length != 0, "Must include member name");

            for(uint k = 0; k < players.length; ++k) {
                require(players[k].addr != leaguePlayers[i].addr, "This player address already exists");
            }
        }
        
        for(uint i = 0; i < leaguePlayers.length; ++i) {
            players.push(Player({
                name: leaguePlayers[i].name,
                addr: leaguePlayers[i].addr,
                hasPaid: false
            }));
        }
    }
    

    function payDues() external payable leagueHasNotStarted {
        require(msg.value == entryFee, "You gotta pay some wei");
        bool foundPlayer = false;
        for(uint i = 0; i < players.length; ++i) {
           if(players[i].addr == msg.sender) {
               require(!players[i].hasPaid, "Player has already paid, idiot.");
                players[i].hasPaid = true;
                foundPlayer = true;
               break;
           }
        }
        require(foundPlayer, "You must be a player in this league to pay dues");
    }
    function startLeague() external isComissioner leagueHasNotStarted {
        // in order to call this, everyone must have paid into the contract
        // store boolean that league has started 
        require(players.length >= 3, "This league requires a minimum of 3 players.");
        for (uint i = 0; i < players.length; ++i) {
            require (players[i].hasPaid, "Unable to start league. Not all players have paid yet.");
        }
        leagueStarted = true;
    }
    function getWinners() external leagueHasEnded  view returns (Player memory, Player memory, Player memory) {
        Player memory firstPlace;
        Player memory secondPlace;
        Player memory thirdPlace;
        for (uint i = 0; i < players.length; ++i) {
            if (players[i].addr == firstPlaceAddr) {
                firstPlace = players[i];
            }
            if (players[i].addr == secondPlaceAddr) {
                secondPlace = players[i];
            }
            if (players[i].addr == thirdPlaceAddr) {
                thirdPlace = players[i];
            }
        }
        return (firstPlace, secondPlace, thirdPlace);
    }
    function declareWinners(address payable firstPlace, address payable secondPlace, address payable thirdPlace) external  isComissioner  {
        // in order to call this, leagueStarted must be true
        // commissioner selects 1st, 2nd and 3rd and payouts are calculated accordingly
        require(leagueStarted, "Cannot declare winners. League has not started.");
        bool foundFirstPlace = false;
        bool foundSecondPlace = false;
        bool foundThirdPlace = false;
        for (uint i = 0; i < players.length; ++i) {
            if (players[i].addr == firstPlace) {
                foundFirstPlace = true;
            }
            if (players[i].addr == secondPlace) {
                foundSecondPlace = true;
            }
            if (players[i].addr == thirdPlace) {
                foundThirdPlace = true;
            }
        }
        require(foundFirstPlace && foundSecondPlace && foundThirdPlace, "Declared winners not found in the player list.");
        firstPlaceAddr = firstPlace;
        secondPlaceAddr = secondPlace;
        thirdPlaceAddr = thirdPlace;
        leagueEnded = true;
        // Pay winners
        (uint payoutFirst, uint payoutSecond, uint payoutThird) = calculatePayout(address(this).balance);
        firstPlace.transfer(payoutFirst);
        secondPlace.transfer(payoutSecond);
        thirdPlace.transfer(payoutThird);
    }
    function cancelLeague() external isComissioner leagueHasNotStarted {
        // cannot call this if leagueStarted is true 
        // returns paid dues to all people who paid in 
        // destroy contract
        for(uint i = 0; i < players.length; ++i) {
           players[i].addr.transfer(entryFee);
        }
        require(address(this).balance == 0, "Balance not empty");
        selfdestruct(commissioner);
    }
    // Utility Functions
    modifier isComissioner() {
        require(msg.sender == commissioner, "This can only be called by the commissioner");
        _;
    }
    modifier leagueHasNotStarted() {
        require(!leagueStarted, "Cannot perform this operation as league has already started");
        _;
    }  
    modifier leagueHasEnded() {
        require(leagueEnded, "Cannot perform this operation as league has not ended");
        _;
    }
    function changeComissioner(address payable newComissioner) external isComissioner {
        commissioner = newComissioner;
    }   
    function checkMoney() external view returns (uint256) {
        return address(this).balance;
    }
    function getEntryFee() external view returns (uint256) {
        return entryFee;
    }
    function getPlayers() external isComissioner view returns (Player[] memory) {
        return players;
    }
    function rescueMoney() external isComissioner  {
        commissioner.transfer(address(this).balance);
    }
}