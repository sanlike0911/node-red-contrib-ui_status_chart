# node-red-contrib-ui_status_chart

## 開発環境の構築

- npm インストール

    typescript, node-red環境を構築します。

    ```cmd
    npm install
    ```

- Docker(`nodered/node-red`)インストール

    docker環境を事前に用意すること。

    ```cmd
    docker-compose up -d
    ```

- 開発環境フォルダについて

    ```cmd
    C:.
    ├─data  ※ Docker(`nodered/node-red`) volume
    │  │
    │  ├─dev
    │  │  └─node-red-contrib-ui_status_chart ※ui widgetのインストール用ファイル一式
    │  │
    │  ├─lib
    │  │
    │  └─node_modules
    │
    ├─dist ※ui widget ビルド後の出力フォルダ
    │
    ├─node_modules
    │
    └─src   ※ ui widget 開発フォルダ
        ├─figs
        ├─icons
        └─locales
            ├─en-US
            └─ja
    ```

- ビルドとインストール

    以下コマンドで、自動でビルドとインストールが出来ます。

    ```cmd
    .\build.bat
    ```

    ※windows用
