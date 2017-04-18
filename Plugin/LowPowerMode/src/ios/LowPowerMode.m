/********* LowPowerMode.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <UIKit/UIKit.h>

@interface LowPowerMode : CDVPlugin {
  // Member variables go here.
}

- (void)isLowPowerModeEnabled:(CDVInvokedUrlCommand*)command;
@end

@implementation LowPowerMode

- (void)isLowPowerModeEnabled:(CDVInvokedUrlCommand*)command
{
    [self addObserverForLowPowerModeDidChangeNotification: command];
}

- (void)addObserverForLowPowerModeDidChangeNotification: (CDVInvokedUrlCommand*)command {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(bateryStateDidChange) name:NSProcessInfoPowerStateDidChangeNotification object:command];
    CDVPluginResult* pluginResult = nil;
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:NO];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)bateryStateDidChange:(CDVInvokedUrlCommand*)command {
    NSLog(@"Batery State Changed");

    CDVPluginResult* pluginResult = nil;

    if (command == nil) {
        // Failure
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    } else {
        bool isLowPowerModeEnabled = [[NSProcessInfo processInfo] isLowPowerModeEnabled];
        // Success
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isLowPowerModeEnabled];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
