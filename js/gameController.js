var chainreaction = angular.module('chainreaction', ['ngTouch']);
chainreaction.controller('gameController', ['$scope', '$timeout',
    function ($scope, $timeout) {
        $scope.appName = "Chain Reaction";
        $scope.betaVersion = true;
        $scope.secondaryText = "By Sumit Gouthaman"

        //Intialize board for the game
        $scope.rows = 8;
        $scope.cols = 12;
        $scope.matrix = new Array($scope.rows);
        for (var i = 0; i < $scope.rows; i++) {
            $scope.matrix[i] = new Array($scope.cols);
        }

        //Array to hold colors for each player
        $scope.players = new Array();

        //Holds color of player who will play the current turn
        $scope.currentPlayer = 0;

        /*
        Gameplay related functions
        */
        $scope.turns = 0;
        $scope.setupOver = false;
        $scope.toExpode = new Array();
        $scope.cellClicked = function (r, c) {
            $scope.turns++;
            if ($scope.turns == $scope.players.length) {
                $scope.setupOver = true;
            }
            if ($scope.matrix[r][c].player != null) {
                if ($scope.matrix[r][c].player != $scope.currentPlayer) {
                    return;
                }
            }
            $scope.cellAttack(r, c, $scope.currentPlayer);
            $timeout($scope.performExplosions, 100);
        }
        $scope.cellAttack = function (r, c, player) {
            $scope.matrix[r][c].count = ($scope.matrix[r][c].count + 1);
            if ($scope.matrix[r][c].count <= maxInCell(r, c)) {
                $scope.matrix[r][c].player = player;
            } else {
                $scope.explode(r, c, player);
                $scope.matrix[r][c].count = 0;
                $scope.matrix[r][c].player = null;
            }
        }
        $scope.explode = function (r, c, player) {
            $scope.toExpode.push({
                "r": r,
                "c": c,
                "player": player
            });
        }
        $scope.performExplosions = function () {
            if ($scope.toExpode.length == 0) {
                if ($scope.setupOver) {
                    for (var p = 0; p < $scope.players.length; p++) {
                        if ($scope.players[p] == null) {
                            continue;
                        }
                        var playerFoundElsewhere = false;
                        for (var i = 0; i < $scope.rows; i++) {
                            for (var j = 0; j < $scope.cols; j++) {
                                if ($scope.matrix[i][j].player == p) {
                                    playerFoundElsewhere = true;
                                }
                            }
                        }
                        if (!playerFoundElsewhere) {
                            makePlayerLostToast("Player " + (p + 1));
                            $scope.players[p] = null;
                        }
                    }
                }
                changePlayer();
            } else {
                var cell = $scope.toExpode.pop(0, 1);
                var neighbours = getNeighbours(cell.r, cell.c);
                for (var n = 0; n < neighbours.length; n++) {
                    $scope.cellAttack(neighbours[n].r, neighbours[n].c, cell.player);
                }
                $timeout($scope.performExplosions, 100);
            }
        }
        var changePlayer = function () {
            var oldPlayer = $scope.currentPlayer;
            var newPlayer = ($scope.currentPlayer + 1) % $scope.players.length;
            while ($scope.players[newPlayer] == null) {
                newPlayer = (newPlayer + 1) % $scope.players.length;
            }
            $scope.currentPlayer = newPlayer;
            if (oldPlayer == newPlayer) {
                makePlayerWonToast("Player " + ($scope.currentPlayer + 1));
                $scope.initializeGame();
            }
        }
        var maxInCell = function (r, c) {
            if ((r == 0 && (c == 0 || c == $scope.cols - 1)) || (r == $scope.rows - 1 && (c == 0 || c == $scope.cols - 1))) {
                return 1;
            }
            if (r == 0 || r == $scope.rows - 1 || c == 0 || c == $scope.cols - 1) {
                return 2;
            }
            return 3;
        }
        var getNeighbours = function (r, c) {
            var neighbours = new Array();
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if ((i * j != 0) || (i == 0 && j == 0)) {
                        continue;
                    }
                    if (((r + i >= 0) && (r + i < $scope.rows)) && ((c + j >= 0) && (c + j < $scope.cols))) {
                        neighbours.push({
                            "r": r + i,
                            "c": c + j
                        });
                    }
                }
            }
            return neighbours;
        }

        /*
        Called at the beginning to set up no of players
        */
        $scope.resetGame = function () {
            for (var i = 0; i < $scope.rows; i++) {
                for (var j = 0; j < $scope.cols; j++) {
                    $scope.matrix[i][j] = {
                        "player": null,
                        "count": 0
                    };
                }
            }
            $scope.currentPlayer = 0;
            $scope.setupOver = false;
            $scope.turns = 0;
        }
        $scope.initializeGame = function () {
            $scope.players = new Array();
            $scope.players.push(getRandomColor());
            $scope.players.push(getRandomColor());
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
        $scope.getNewCell = function () {
            return {
                "player": null,
                "count": 0
            };
        }
        $scope.decreaseRows = function () {
            if ($scope.matrix.length > 3) {
                $scope.matrix.pop();
                $scope.rows--;
            }
        }
        $scope.increaseRows = function () {
            $scope.matrix.push(new Array($scope.matrix[0].length));
            $scope.rows++;
            var lastIndex = $scope.rows - 1;
            for (var i = 0; i < $scope.cols; i++) {
                $scope.matrix[lastIndex][i] = $scope.getNewCell();
            }
        }
        $scope.decreaseCols = function () {
            if ($scope.cols <= 3) {
                return;
            }
            for (var i = 0; i < $scope.matrix.length; i++) {
                $scope.matrix[i].pop();
            }
            $scope.cols--;
        }
        $scope.increaseCols = function () {
            for (var i = 0; i < $scope.rows; i++) {
                $scope.matrix[i].push($scope.getNewCell());
            }
            $scope.cols++;
        }
        $scope.minimumRows = function () {
            if ($scope.rows <= 3) {
                return true;
            }
            return false;
        }
        $scope.minimumCols = function () {
            if ($scope.cols <= 3) {
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