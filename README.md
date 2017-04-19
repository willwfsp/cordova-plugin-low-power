# 1. Testando funcionalidade nativa

Antes de construir o plugin Cordova, precisamos conhecer como é o comportamento nativo do gerenciamento de energia do device. 

## 1.2. Considerações

Ao começarmos a observar o estado da bateria, podemos saber se o device está em modo Low Power ou não. É possível também observar a porcentagem da bateria, mas já existe um plugin Cordova que faz isto muito bem para todas as plataformas, chamado [Battery Status](https://github.com/apache/cordova-plugin-battery-status)

## 1.3. Implementação

A implementação nativa é simples. Entre na classe `AppDelegate` e siga os seguintes passos:

1. Primeiro adicionamos um observer que e verificará as mudanças de bateria:

```swift
func observeForPowerStateDidChangeNotification() {
  NotificationCenter.default.addObserver(self, selector: #selector(powerStateDidChange), name: Notification.Name.NSProcessInfoPowerStateDidChange, object: nil)
}
```

2. Ao capturarmos a mudança de estado da bateria, podemos tomar decisões ao implementarmos o selector especificado no passo acima:

```swift
func powerStateDidChange(_ notification: Notification) {
  print("state changed")
  if ProcessInfo.processInfo.isLowPowerModeEnabled {
    print("is Low Power Mode Enabled")
  } else {
    print("is Low Power Mode Disabled")
  }
}
```

3. Não se esqueça de invocar o método `observeForPowerStateDidChangeNotification()` no `application(didFinishLaunchingWithOptions:)`:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
  observeForPowerStateDidChangeNotification()
  return true
}
```

Este seria então o comportamento nativo que esperamos reproduzir no Ionic

# 2. Criação do Plugin

Nosso plugin apenas verifica o estado atual da bateria, que no exemplo nativo pode ser obtido lendo a seguinte propriedade:

```swift
ProcessInfo.processInfo.isLowPowerModeEnabled
```

## 2.1. Criando um plugin utilizando o plugman

Para a criação do plugin foi utilizado como auxílio o [Plugman](https://github.com/apache/cordova-plugman). 
Existe um [tutorial](https://taco.visualstudio.com/en-us/docs/createplugintutorial/) no qual este passo-a-passo foi baseado.
Para instalá-lo utilize o seguinte comando:

```
npm install -g plugman
```

> Lembre-se de ter o Nodejs instalado e atualizado

Tendo o plugman instalado, os seguintes passos foram utilizados para criação do plugin:

1. Navegue até um diretório de sua preferência.
2. Utilize o seguinte comando para criar um novo plugin:

``` 
plugman create --name LowPowerMode --plugin_id cordova-plugin-low-power-mode --plugin_version 0.0.1
```

A seguinte estrutura de diretórios será criada:

```
LowPowerMode/
|- plugin.xml
|- src/
\- www/
   \- LowPowerMode.js
```

3. Por fim, adicione a plataforma nativa iOS, usando o seguinte comando:

```
plugman platform add --platform_name ios
```

Sua estrutura de diretórios será alterada para:

```
LowPowerMode/
|- plugin.xml
|- src/
|  \- ios/
|     \- LowPowerMode.m
\- www/
   \- LowPowerMode.js
```

E foi adicionado o seguinte trecho de código no arquivo `plugin.xml`:

```xml
...
  
  <platform name="ios">
    <config-file parent="/*" target="config.xml">
      <feature name="LowPowerMode">
        <param name="ios-package" value="LowPowerMode" />
      </feature>
    </config-file>
    <source-file src="src/ios/LowPowerMode.m" />
  </platform>

...
```

## 2.2. Implementando o lado nativo do plugin

O Plugman adiciona automaticamente uma classe nativa `.m` no diretório do plugin. O código gerado estará em Objective-C. 

Entre no arquivo `src/ios/LowPowerMode.m` e o código Objective-C gerado é o seguinte:

```objC
/********* LowPowerMode.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface LowPowerMode : CDVPlugin {
  // Member variables go here.
}

- (void)coolMethod:(CDVInvokedUrlCommand*)command;
@end

@implementation LowPowerMode

- (void)coolMethod:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
``` 

1. Remova o `coolMethod` da `@interface` e da `@implementation`:

```objC
/********* LowPowerMode.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>

@interface LowPowerMode : CDVPlugin {
  // Member variables go here.
}

@end

@implementation LowPowerMode

@end
```

2. Adicione no `@interface` e na `@implementation` o método para verificação da bateria:

```objC
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
```

## 2.3. Implementando o lado javascript do plugin

Haverá também uma ponte Javascript entre o código nativo e nossa aplicação. Entre no arquivo `www/LowPowerMode.js` e você terá o seguinte código auto-gerado:

```javascript
var exec = require('cordova/exec');

exports.coolMethod = function(arg0, success, error) {
    exec(success, error, "LowPowerMode", "coolMethod", [arg0]);
};

```

1. Substitua o `coolMethod` pelo `isLowPowerModeEnabled` para que o arquivo `.js` esteja da seguinte maneira:

```javascript
var exec = require('cordova/exec');

exports.isLowPowerModeEnabled = function(callback) {
  exec(function(successResult) {
    callback(successResult);
  }, function(error) {
    callback(nil, {message: "Device is not ready. Try again later."});
  }, "LowPowerMode", "isLowPowerModeEnabled", [""]);
};

```

Feito isso a programação está pronta.

## 2.3. Publicando o plugin

Para publicar precisamos criar um arquivo `package.json`. Para isto use o seguinte comando do Plugman:

``` 
plugman createpackagejson .
```

Siga as instruções do terminal e finalize a criação do arquivo.

Abra o arquivo `package.json` e edite seu o nome do pacote para `cordova-plugin-low-power-mode`.

Seu arquivo se parecerá com este:

```json
{
  "name": "cordova-plugin-low-power-mode",
  "version": "0.0.1",
  "description": "Detects if batery state is in Low Power Mode.",
  "cordova": {
    "id": "cordova-plugin-low-power-mode",
    "platforms": [
      "ios"
    ]
  },
  "keywords": [
    "ecosystem:cordova",
    "cordova-ios"
  ],
  "author": "Willian Policiano (willwfsp)",
  "license": "ISC"
}
```

Salve e execute o seguinte comando no terminal:

```
npm publish
```

Siga as instruções dadas no terminal e o plugin estará disponivel no [npmjs.com](npmjs.com).


# 3. Integrando o plugin com o Ionic

A integração de plugins com Ionic pode ser um pouco complicada se o plugin não estiver 100% testado, pois é dificil depurar. Siga as instruções a seguir para integrar nosso plugin com sua aplicação.

## 3.1 Configurações iniciais
Para utilizar plugins cordova em aplicações Angularjs de qualquer natureza devemos utilizar o [ngCordova](http://ngcordova.com/).

1. Entre no diretório do aplicativo ionic e execute o seguinte comando:

```
sudo npm install -g ng-cordova --save
```

2. No arquivo `index.js` insira a dependência `ngCordova.js` antes da `cordova.js`:

```html
<!-- cordova script (this will be a 404 during development) -->
<script src="lib/ngCordova/dist/ng-cordova.js"></script>
<script src="cordova.js"></script>
```

3. No arquivo `app.js` injete a dependência `'ngCordova'` no app module:

```javascript
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {

...
``` 

## 3.2. Utilizando o Plugin

Chegando até aqui, a etapa de utilizar o plugin é a mais fácil.

> Para este teste, utilizei o template **sidemenu** do ionic e testei o plugin no controller `'PlayListCtrl'`

1. O controller `PlayListCtrl` se transformou no seguinte controller:

```javascript
.controller('PlaylistsCtrl', function($scope, $ionicPlatform) {
  $ionicPlatform.ready(function() {
    $scope.checked = false;
    $scope.log = "ionicPlatform"
    $scope.updateState = function() {
      if (window.cordova && window.cordova.plugins.LowPowerMode) {
        $scope.log = "LowPowerMode"
        cordova.plugins.LowPowerMode.isLowPowerModeEnabled(function(result) {
          $scope.checked = result;
        });
      }
    };

    $scope.updateState();
  });
})
```

2. O template para este controller foi implementado da seguinte forma (`playlists.html`):

```html
<ion-view view-title="Playlists">
  <ion-content has-header="true" padding="false">
    <div class="list">
      <div class="item item-toggle">
         Low Power Mode
         <label class="toggle toggle-assertive">
           <input type="checkbox" ng-checked="checked" ng-disabled="true">
           <div class="track">
             <div class="handle"></div>
           </div>
         </label>
      </div>
      <div class="item">
        <button class="button button-block button-positive" ng-click="updateState()">
          Atualizar
        </button>
      </div>
    </div>
  </ion-content>
</ion-view>

```

