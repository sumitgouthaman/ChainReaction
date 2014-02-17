/*
Other helpful functions
*/

var getRandomColor = function () {
    return ('#' + Math.floor(Math.random() * 16777215).toString(16));
}

toastr.options = {
    "closeButton": false,
    "debug": false,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "0",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

var makePlayerLostToast = function (playerName) {
    toastr.error(playerName + " lost!");
}

var makePlayerWonToast = function (playerName) {
    toastr.success(playerName + " won!", "Game Completed");
}