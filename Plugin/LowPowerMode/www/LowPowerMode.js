var exec = require('cordova/exec');

exports.isLowPowerModeEnabled = function(callback) {
  exec(function(successResult) {
    callback(successResult);
  }, function(error) {
    callback(nil, {message: "Device is not ready. Try again later."});
  }, "LowPowerMode", "isLowPowerModeEnabled", [""]);
};
