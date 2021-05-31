# node-redの公式イメージをベースにする
FROM nodered/node-red:latest

# Node-Redのディレクトリに移動
WORKDIR /usr/src/node-red

# ユーザ変更
USER node-red

# log4j
# RUN npm install log4js --save-dev

# 必要なパッケージインストール
RUN npm install node-red-dashboard --save
