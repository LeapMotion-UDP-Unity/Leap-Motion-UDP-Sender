# Leap Motion UDP Sender
LeapMotion の コマンドを UDP で送信するアプリ  
LeapMotion 未対応の Android 端末で利用する場合等で利用することができる。 
受信側 は Unityパッケージ [Leap Motion UDP Receiver]([xxxxx](https://github.com/LeapMotion-UDP-Unity/Leap-Motion-UDP-Receiver-Unity)) に記載。

# 環境
LeapMotion と node.js 環境があれば動作する。
- Windows 10  
LeapMotion V4 SDKは osx 未対応
- LeapMotion [V4 SDK](https://developer.leapmotion.com/setup/desktop)  
LeapMotion 利用に必要なドライバや設定変更やボーン表示ソフト
- [node.js](https://nodejs.org/en/)  
npm node 等 必要コマンド

# Leap Motion コントローラー設定
`Webアプリケーションを許可` を有効にする
![画像１](./resource/leapmotion_controller1.png)

# 実行方法
```
npm i
npm run app [送信先IPアドレス 省略時 127.0.0.1]
npm run app 192.168.86.29

```


# 構成等の仕様
LeapMotionコントローラーの設定 `Webアプリケーションを許可` をすると WebSocket サーバ起動するのでそれを利用している

![構成図1](./resource/dummy150x150.png)

# 通信データ仕様
LeapMotionから取得できるデータを整理して json 形式に変換して UDP で送信している
```
{
    cmd: 'hand',
    hand: {
        id: number,
        type: string, // 'left' or 'right'
        palmPosition: [x,y,z], // 手のひら 座標
        grabStrength: [0.0 - 1.0], // 手のひらの開き具合
        fingers: {
            thumb: [x,y,z],  // 親指 座標
            index: [x,y,z],  // 人差し指
            middle: [x,y,z], // 中指
            ring: [x,y,z],   // 薬指
            pinky: [x,y,z]   // 小指
        },
        roll: number,  // ロール角度
        pitch: number, // ピッチ
        yaw: number,   //　ヨー
    }
}
```

# 参考
[Leap Motion と JavaScript でハンドパワー駆動のウェブページ](https://www.ei.tohoku.ac.jp/xkozima/lab/leapTutorial1.html)