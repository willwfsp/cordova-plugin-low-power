var exec = require('cordova/exec');

exports.coolMethod = function(arg0, success, error) {
    exec(success, error, "LowPowerMode", "coolMethod", [arg0]);
};

exports.isLowPowerModeEnabled = function(arg0, success, error) {
    exec(success, error, "LowPowerMode", "isLowPowerModeEnabled", [arg0]);
};
