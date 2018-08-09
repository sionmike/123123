// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
function urlParse() {
    var params = {};
    if (window.location == null) {
        return params;
    }
    var name, value;
    var str = window.location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            params[name] = value;
        }
    }
    return params;
}

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // if (!cc.vv) {
        //     cc.vv = {};
        //     cc.vv.http = require('HTTP')
        //     let audio = require('AudioMgr')
        //     cc.vv.audio = new audio();
        //     cc.vv.audio.playBGM('niuniu/bgm.wav');
        //     cc.vv.global = require('Global');
        //     cc.vv.gameNotify= new cc.EventTarget();
        //     cc.vv.http = require('HTTP')
        //     cc.vv.socket = require('Socket');
        //     cc.vv.socket.connect();
        //     cc.vv.socket.on('GAME_RECOVERY', function (data) {
        //         var data = data.detail;
        //         cc.vv.status = 'playing';
        //         cc.vv.user = data.user_data
        //         cc.director.loadScene('niugame', function () {
        //             cc.vv.socket.emit('GAME_WAITING', data)
        //         });
        //     })
        // }
    },
    onClick() {
        // cc.director.preloadScene('niugame', () => {
        //     cc.director.loadScene('niugame', function () {
        //         // console.log(cc.find('Canvas/script/NiuNiu').getComponent)
        //         cc.vv.socket.send({
        //             controller_name: "YtxScoketService",
        //             method_name: "hallRoom"
        //         }, {
        //             game_id: 1,
        //             way: "free",
        //             multiple: 50,
        //         })
        //     })
        // })
    },
    onRoomClick() {
        // cc.director.preloadScene('niugame', () => {
        //     cc.director.loadScene('niugame', function () {
        //         // console.log(cc.find('Canvas/script/NiuNiu').getComponent)
        //         cc.vv.socket.send({
        //             controller_name: "YtxScoketService",
        //             method_name: "makeCardRoom"
        //         }, {
        //             game_id: 1,
        //             way: "open",
        //             multiple: 50,
        //         })
        //     })
        // })
    },
    onJoin() {
        // var input = cc.find('Canvas/input').getComponent(cc.EditBox).string;
        // cc.director.loadScene('niugame', function () {
            
        //     // console.log(cc.find('Canvas/script/NiuNiu').getComponent)
        //     cc.vv.socket.send({
        //         controller_name: "YtxScoketService",
        //         method_name: "joinCardRoom"
        //     }, {
        //         number: input,
        //     })
        // })
    },

    // update (dt) {},
});