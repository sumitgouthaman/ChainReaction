function gameController($scope) {
    $scope.appName = "Chain Reaction";
    $scope.secondaryText = "By Sumit Gouthaman"

    //Intialize board for the game
    $scope.matrix = new Array(8);
    for (var i = 0; i < $scope.matrix.length; i++) {
        $scope.matrix[i] = new Array(12);
    }

    //Array to hold colors for each player
    $scope.players = new Array();
    $scope.players.push("#FF0000");

    //Holds color of player who will play the current turn
    $scope.currentPlayer = 0;

    /*
    Gameplay related functions
    */
    $scope.cellClicked = function (r, c) {
        alert("Clicked: " + r + " - " + c);
    }

    /*
    Called at the beginning to set up no of players
    */
    $scope.intializeGame = function () {
        if ($scope.players.length < 2) {
            $('#noOfPlayersModal').modal({});
        }
        for (var i = 0; i < $scope.matrix.length; i++) {
            for (var j = 0; j < $scope.matrix[i].length; j++) {
                $scope.matrix[i][j] = 0;
            }
        }
    }

    /*
    Function related to players
    */
    $scope.addPlayer = function () {
        var newColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        $scope.players.push(newColor);
    }
    $scope.removePlayer = function (index) {
        if ($scope.players.length > 1) {
            $scope.players.splice(index, 1);
        }
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
}