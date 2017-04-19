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

## 2.1 Criando um plugin utilizando o plugman

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



