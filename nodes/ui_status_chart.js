"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const moment_1 = __importDefault(require("moment"));
const nodeInit = (RED) => {
    // const parameters
    const DEFAULT_WIDGET_WIDTH = 6;
    const DEFAULT_WIDGET_HEIGHT = 8;
    // Holds a reference to node-red-dashboard module.
    // Initialized at #1.
    let ui = undefined;
    /**
     *
     *
     * @param {Node} _node
     * @param {statusChart.nodeConf} _conf
     * @returns
     */
    function checkConfig(_node, _conf) {
        if (!_conf || !_conf.hasOwnProperty("group")) {
            _node.error(RED._("ui_status_chart.error.no-group"));
            return false;
        }
        return true;
    }
    /**
     * make html
     *
     * @param {statusChart.nodeConf} _config
     * @returns {string}
     */
    function makeHTML(_config) {
        const _html = "<div class='ganttchart-container' align='center'>"
            // タイトル表示
            + "<div class='graph-title'>"
            + _config.label
            + "</div>"
            // 凡例表示
            + "<table id='statusList_table' class='graph-legend'>"
            + "<tbody>"
            + "<tr>"
            + "<td ng-repeat = 'item in msg.items.graphObject' >"
            + "<span style='color:{{item.statusColor}}; font-size:20px;'>■</span>{{item.statusLabel}}"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            // グラフ表示
            + "<table id='statusBar_table' class='graph-data'>"
            + "<tbody>"
            + "<tr>"
            + "<td ng-repeat = 'item in msg.items.graphData' bgcolor='{{item.statusColor}}' width='{{item.widthRatio}}%' height='20px'>"
            + "<div class='datetime-vertical'>{{item.label}}</div>"
            + "</td>"
            + "</tr>"
            + "</tbody>"
            + "</table>"
            + "</div>";
        const _css = "<style>"
            + ".ganttchart-container { width:95%; padding: 0; margin: 0; } "
            + ".graph-title { padding: 10px 0 10px 0; font-size:18px; /*background-color: rgba(180,180,180,0.2); border-radius: 5px; border: 1px solid rgb(70,70,70,0.17);*/ } "
            + ".graph-legend { margin: 15px 0 15px 0; padding: 0; font-size:10px; /*background-color: rgba(180,180,180,0.5); border-radius: 5px; border: 1px solid rgb(70,70,70,0.17);*/} "
            + ".graph-legend > tbody > tr > td { padding: 5px 15px; 5px 15px } "
            + ".graph-data { width: 100%; } "
            + ".datetime-vertical { position: absolute; writing-mode:vertical-rl; text-align: left; padding-top: 20px; font-size:10px; background-color: rgba( 0, 0, 0, 0 ); white-space: nowrap; } "
            + "<\style>";
        return _html + _css;
    }
    /**
     * Node initialization function
     *
     * @param {Node} this
     * @param {statusChart.nodeConf} _config
     */
    function initWidget(_config) {
        const _node = this;
        let _done = null;
        try {
            if (ui === undefined) {
                // #1: Load node-red-dashboard module.
                // Should use RED.require API to cope with loading different
                // module.  And it should also be executed at node
                // initialization time to be loaded after initialization of
                // node-red-dashboard module.
                // 
                ui = RED.require("node-red-dashboard")(RED);
            }
            // Initialize node
            RED.nodes.createNode(this, _config);
            if (checkConfig(_node, _config)) {
                let _group = RED.nodes.getNode(_config.group);
                // console.log(`config.width: ${config.width}, config.height: ${config.height}`);
                let _width = DEFAULT_WIDGET_WIDTH; //default
                if (0 < Number(_config.width)) {
                    _width = Number(_config.width);
                }
                else if (0 < Number(_group.config.width)) {
                    _width = Number(_group.config.width);
                }
                let _height = DEFAULT_WIDGET_HEIGHT; //default
                if (0 < Number(_config.height)) {
                    _height = Number(_config.height);
                }
                // Generate HTML/Angular code
                let _html = makeHTML(_config);
                // Initialize Node-RED Dashboard widget
                // see details: https://github.com/node-red/node-red-ui-nodes/blob/master/docs/api.md
                //  #  name[*-optioal] ----------- description --------------------------------------
                //  1. node*                       制御ノード。スコープが「グローバル」の場合はオプション。
                //  2. format                      ウィジェットのHTMLコード。テンプレートダッシュボードウィジェットノードと同じHTMLを受け入れます。
                //  3. group*                      ィジェットが属するグループノードオブジェクト
                //  4. width*                      ウィジェットの幅
                //  5. height*                     ウィジェットの高さ
                //  6. templateScope               ウィジェットのスコープ（「グローバル」または「ローカル」）
                //  7. EmmitOnlyNewValues*         変更された場合はメッセージを送信する
                //  8. forwardInputMessages*       入力メッセージを出力に転送する
                //  9. storeFrontEndInputAsState*  受信したメッセージを保存する
                // 10. convert*                    値をフロントエンドに変換するためのコールバック
                // 11. beforeEmit*                 メッセージを準備するためのコールバック
                // 12. convertBack*                送信されたメッセージを変換するためのコールバック
                // 13. beforeSend*                 メッセージを準備するためのコールバック
                // 14. order                       グループで注文する
                // 15. initController*             コントローラで初期化するコールバック                
                _done = ui.addWidget({
                    node: _node,
                    format: _html,
                    group: _config.group,
                    width: _width,
                    height: _height,
                    templateScope: "local",
                    emitOnlyNewValues: false,
                    forwardInputMessages: _config.fwdInMessages,
                    storeFrontEndInputAsState: _config.storeOutMessages,
                    convertBack: function (_value) {
                        return _value;
                    },
                    beforeEmit: function (_msg, _value) {
                        // msg conteins "payload" and "topic" and "value"
                        // value only
                        let _makeData = makeGraphData(_node, _config, _msg);
                        // make msg.payload accessible as msg.items in widget
                        return { msg: { items: _makeData } };
                    },
                    beforeSend: function (_msg, _original) {
                        if (_original) {
                            return _original.msg;
                        }
                    },
                    order: _config.order // order
                });
            }
        }
        catch (_error) {
            _node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            _node.error(_error);
        }
        _node.on("close", function () {
            if (_done) {
                // finalize widget on close
                _done();
            }
        });
    }
    /**
     * グラフデータ作成処理
     *
     * @param {Node} node
     * @param {statusChart.nodeConf} config
     * @param {statusChart.inputNodeMsgDef} _msg
     * @returns {statusChart.makeMegDef}
     */
    function makeGraphData(_node, _config, _msg) {
        try {
            // 処理結果
            let _makeMsg = {};
            let _graphColorList = {};
            // 処理開始
            _node.status({ fill: "blue", shape: "dot", text: "resources.message.connect" });
            try {
                // グラフ表示設定の取得
                let _graphSettings = (_config.params != undefined ? _config.params : []);
                if (_graphSettings.length <= 0) {
                    _node.status({ fill: "yellow", shape: "ring", text: "resources.message.noGraphSetting" });
                    return {};
                }
                // グラフ色の設定
                for (let _i = 0; _i < _graphSettings.length; _i++) {
                    _graphColorList[_graphSettings[_i].statusValue] = _graphSettings[_i].statusColor;
                }
                // 稼働状況の設定情報を取得、msgへ格納
                _makeMsg.graphObject = _graphSettings;
            }
            catch (_error) {
                _node.status({ fill: "yellow", shape: "ring", text: "resources.message.noGraphData" });
                _node.warn(_error);
                return {};
            }
            try {
                // 重複データの削除
                let _graphData = _msg.payload.filter((element, index, self) => self.findIndex((e) => e.datetime === element.datetime) === index);
                const _lastIdx = _graphData.length - 1;
                // 全データの状況開始日時・終了日時の算出・格納処理
                let _startDate = moment_1.default(_graphData[0].datetime);
                let _endDate = moment_1.default(_graphData[_lastIdx].datetime);
                // 全データの累計稼働時間(秒)の算出・格納処理
                const _maxDiffSec = Math.floor(_endDate.diff(_startDate) / 1000);
                // 各データの状況開始日時・終了日時、割合を算出・格納処理
                for (let _i = 0; _i < _lastIdx; _i++) {
                    _startDate = moment_1.default(_graphData[_i].datetime);
                    _endDate = moment_1.default(_graphData[_i + 1].datetime);
                    let _diffTime = _endDate.diff(_startDate);
                    let _diffSec = Math.floor(_diffTime / 1000);
                    // 割合(各稼働状態の秒数/全体の秒数)を演算
                    _graphData[_i].label = moment_1.default(_startDate).format('YYYY-MM-DD HH:mm:ss');
                    _graphData[_i].widthRatio = Math.floor((_diffSec / _maxDiffSec) * 10000) / 100;
                    _graphData[_i].statusColor = _graphColorList[_graphData[_i].value];
                }
                // 最終データ
                _graphData[_lastIdx].label = moment_1.default(_graphData[_lastIdx].datetime).format('YYYY-MM-DD HH:mm:ss');
                _graphData[_lastIdx].widthRatio = 0;
                _graphData[_lastIdx].statusColor = _graphColorList[_graphData[_lastIdx].value];
                // 作成したデータをmsg.payloadへ格納
                _makeMsg.graphData = _graphData;
            }
            catch (_error) {
                _node.status({ fill: "yellow", shape: "ring", text: "resources.message.noGraphData" });
                _node.warn(_error);
                return {};
            }
            // 設定とグラフデータが正常に作成されている場合は「表示処理完了
            if (_makeMsg.graphObject.length > 0 && _makeMsg.graphData.length > 0) {
                _node.status({ fill: "green", shape: "dot", text: "resources.message.complete" });
            }
            return _makeMsg;
        }
        catch (_error) {
            _node.status({ fill: "red", shape: "ring", text: "resources.message.error" });
            _node.error(_error);
            return {};
        }
    }
    RED.nodes.registerType('ui_status_chart', initWidget);
};
module.exports = nodeInit;
//# sourceMappingURL=ui_status_chart.js.map