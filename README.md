# autolog

ブラウザ内のイベントを検知して、その都度スクリーンショットを自動で撮影します。  
撮影したスクリーンショットは時刻やURL、メモと共にタイムラインとしてまとめられ、レポートとして保存することが可能です。

## スクリーンショット

### レポート

![timeline](https://github.com/tan-t/autolog/raw/example/examples/example1.png)

このような形式でレポートが出ます。

### 設定

![config](https://github.com/tan-t/autolog/raw/example/examples/example2.png)

設定画面にて、「イベント」と「監視する要素のセレクタ」を指定すれば、<br/>
条件にマッチするイベントが発生した時点で自動でスクリーンショットを撮ります。  

セレクタはCSS、XPathどちらも利用可能ですが、<br/>
XPathを使えば「要素の名前」を取得する機能が利用できるため、  
XPathでの指定をおすすめします。  

### クイックログ

![config](https://github.com/tan-t/autolog/raw/example/examples/example3.png)

あらかじめ設定していない状況でも、<br/>
例えばエラーが発生したなどでスクリーンショットを撮りたい場合があります。<br/>
その時にポップアップからメモ付きでスクリーンショットを撮ることが可能です。

## 使い方

### デベロッパーモードで使う

今のところCWSで公開していないため、この方法しかありません。  

#### デベロッパーモードをONにする

chrome://extensions にアクセスし、右上の「デベロッパーモード」をONにしてください。

#### git clone

```
$ git clone https://github.com/tan-t/autolog.git
```

すると、「autolog」フォルダが作成されます。  

```
$ cd autolog
```

して、「autolog」フォルダに入ってください。

#### 依存するモジュールのインストール

```
$ npm install
```

して、全ての依存するモジュールが読み込みます。

#### ビルド

```
$ npm run build:chrome
```

すると、zipファイルがpackages以下に出力されます。

#### 利用する

zipファイルを解凍し、chrome://extensions で「パッケージ化されていない拡張機能を読み込む」をクリックし、<br/>
先ほど解凍したディレクトリ（manifest.jsonが配置されているところです）を指定すれば完了です。



