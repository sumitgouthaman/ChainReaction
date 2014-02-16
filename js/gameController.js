var chainreaction = angular.module('chainreaction', ['ngTouch']);
chainreaction.controller('gameController', ['$scope',
    function ($scope) {
        $scope.appName = "Chain Reaction";
        $scope.betaVersion = true;
        $scope.secondaryText = "By Sumit Gouthaman"

        //Intialize board for the game
        $scope.matrix = new Array(8);
        for (var i = 0; i < $scope.matrix.length; i++) {
            $scope.matrix[i] = new Array(12);
        }

        //Array to hold colors for each player
        $scope.players = new Array();
        $scope.players.push(getRandomColor());
        $scope.players.push(getRandomColor());

        //Holds color of player who will play the current turn
        $scope.currentPlayer = 0;

        /*
    Gameplay related functions
    */
        $scope.cellClicked = function (r, c) {
            //alert("Clicked: " + r + " - " + c);
            $scope.matrix[r][c].player = $scope.currentPlayer;
            $scope.matrix[r][c].count++;
            changePlayer();
        }
        var changePlayer = function () {
            $scope.currentPlayer = ($scope.currentPlayer + 1) % $scope.players.length;
        }

        /*
    Called at the beginning to set up no of players
    */
        $scope.resetGame = function () {
            for (var i = 0; i < $scope.matrix.length; i++) {
                for (var j = 0; j < $scope.matrix[i].length; j++) {
                    $scope.matrix[i][j] = {
                        "player": null,
                        "count": 0
                    };
                }
            }
        }
        $scope.initializeGame = function () {
            $('#noOfPlayersModal').modal({});
            $scope.resetGame();
        }

        /*
    Function related to players
    */
        $scope.addPlayer = function () {
            var newColor = getRandomColor();
            $scope.players.push(newColor);
        }
        $scope.removePlayer = function (index) {
            if ($scope.players.length > 2) {
                $scope.players.splice(index, 1);
            }
        }
        $scope.minimumPlayers = function () {
            if ($scope.players.length <= 2) {
                return true;
            }
            return false;
        }
        $scope.getBoardBorderStyle = function (players, currentPlayer) {
            return {
                "border-color": players[currentPlayer]
            };
        }

        /*
    Code related to modifying number of rows and columns in the game
    */
        $scope.decreaseRows = function () {
            if ($scope.matrix.length > 3) {
                $scope.matrix.pop();
            }
        }
        $scope.increaseRows = function () {
            $scope.matrix.push(new Array($scope.matrix[0].length));
            var lastIndex = $scope.matrix.length - 1;
            for (var i = 0; i < $scope.matrix[0].length; i++) {
                $scope.matrix[lastIndex][i] = 0;
            }
        }
        $scope.decreaseCols = function () {
            for (var i = 0; i < $scope.matrix.length; i++) {
                $scope.matrix[i].pop();
            }
        }
        $scope.increaseCols = function () {
            for (var i = 0; i < $scope.matrix.length; i++) {
                $scope.matrix[i].push(0);
            }
        }
        $scope.minimumRows = function () {
            if ($scope.matrix.length <= 3) {
                return true;
            }
            return false;
        }
        $scope.minimumCols = function () {
            if ($scope.matrix[0].length <= 3) {
                return true;
            }
            return false;
        }

        /*
    Functions realted to style of cell on the board
    */
        $scope.getBgColorCell = function (r, c) {
            var playerID = $scope.matrix[r][c].player;
            if (playerID == null) {
                return {
                    "background-color": "#FFFFFF"
                }
            } else {
                return {
                    "background-color": $scope.players[playerID]
                }
            }
        }
        $scope.getFontColorCell = function (r, c, asteriskNum) {
            var playerID = $scope.matrix[r][c].player;
            var cellCount = $scope.matrix[r][c].count;
            var style = new Object();
            if (playerID == null) {
                style.color = "#FFFFFF";
            } else {
                style.color = $scope.players[playerID];
            }
            if (asteriskNum <= cellCount) {
                style.visibility = "visible";
            } else {
                style.visibility = "hidden";
            }
            return style;
        }

        /*
    Other functions
    */
        $scope.range = function (num) {
            return new Array(num);
        }
}]);