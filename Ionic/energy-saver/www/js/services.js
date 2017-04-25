angular.module('starter.services', [])

    .factory('BatteryStatus', function ($ionicPlatform, $rootScope) {



        var isLowPowerModeEnabled = function (callback) {
            if (window.cordova) {
                if (window.cordova.plugins.LowPowerMode) {
                    console.log("[BateryStatus]\t LowPowerMode plugin is defined");

                    cordova.plugins.LowPowerMode.isLowPowerModeEnabled(function (result, error) {
                        if (error) {
                            console.log("[BateryStatus][Error]\t " + error.message);
                        } else {
                            console.log("[BateryStatus]\t Low power mode is " + result.isLowPowerModeEnabled);
                            callback({ percentage: 10, isLowPowerModeEnabled: result.isLowPowerModeEnabled });
                        }
                    });
                } else {
                    console.log("[BateryStatus][Error]\t window.cordova.plugins.LowPowerMode is undefined");
                }
            } else {
                console.log("[BateryStatus][Error]\t window.cordova is undefined");
            }
        };

        var batteryStatus = function(callback) {
            $rootScope.$on("$cordovaBatteryStatus:status", function (event, args) {
                console.log("[BateryStatus]\t Battery status did change");
                isLowPowerModeEnabled(callback);
            });
        }


        return {
            status: function (callback) {
                console.log("[BateryStatus]\t status method was called");
                $ionicPlatform.ready(function () {
                    console.log("[BateryStatus]\t $ionicPlatform plugin is defined");
                    isLowPowerModeEnabled(callback);
                    batteryStatus(callback);
                });
            }
        };
    });