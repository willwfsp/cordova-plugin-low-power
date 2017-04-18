# 1. Testando funcionalidade nativa

Antes de construir o plugin Cordova, precisamos conhecer como é o comportamento nativo do gerenciamento de energia do device. 

## 2. Considerações

Ao começarmos a observar o estado da bateria, podemos saber se o device está em modo Low Power ou não. É possível também observar a porcentagem da bateria, mas já existe um plugin Cordova que faz isto muito bem para todas as plataformas, chamado [Battery Status](https://github.com/apache/cordova-plugin-battery-status)

## 3. Implementação

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
