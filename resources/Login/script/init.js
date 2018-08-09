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
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _progress: 0.0,
        _splash: null,
        _isLoading: false,
        loaddingPrefab: {
            default: null,
            type: cc.Prefab
        },
        alertPrefab: {
            default: null,
            type: cc.Prefab
        },
        layersPrefab: {
            default: null,
            type: cc.Prefab
        },
        settingPrefab: {
            default: null,
            type: cc.Prefab
        },
        rechargePrefab: {
            default: null,
            type: cc.Prefab
        },
        makesure: {
            default: null,
            type: cc.Prefab
        },
        userAvadar: {
            default: null,
            type: cc.SpriteAtlas
        },
        payPrefab: cc.Prefab

    },

    // use this for initialization
    onLoad: function () {
        this.initMgr();
        cc.vv.playerAtlas = this.userAvadar;
        if (!cc.sys.isNative && cc.sys.isMobile) {
            var canvas = this.node.getComponent(cc.Canvas);
            //canvas.fitHeight = true;
            canvas.fitWidth = true;
        }
        /*this.dragonDisplay.armatureName = 'armatureName';
        this.dragonDisplay.playAnimation('newAnimation');  */
        //let win = cc.director.getWinSize() ;
        // cc.view.setDesignResolutionSize(win.width, win.height, cc.ResolutionPolicy.EXACT_FIT);


    },
    update: function (dt) {

        // this.dragonDisplay.getComponent(dragonBones.ArmatureDisplay).armature().invalidUpdate();
    },


    start: function () {
        var self = this;
        var SHOW_TIME = 3000;
        var FADE_TIME = 500;
        /***
         * 
         * 控制登录界面或者广告首屏界面显示时间
         * 
         */
    },
    initMgr: function () {
        if (cc.vv == null) {
            /**
             * 增加了游戏全局变量控制，增加了 cc.vv.gamestatus 参数，可选值：ready|notready|playing
             * @type {{}}
             */

            cc.vv = {};
            cc.vv.ENV = 'prd';
            cc.routes = {};
            cc.vv.http = require("HTTP");
            var host;
            var port;
            var wshost;
            if (cc.vv.ENV == 'dev' || cc.vv.ENV != "prd") {
                // wshost = "ws://api.bingoooo.cn";
                // host="api.bingoooo.cn"
                wshost = "ws://47.96.132.111"
                host = "http://test.200le.com";
                port = 10183
            }
            if (cc.vv.ENV == 'prd') {
                wshost = "wss://api.200le.com"
                host = "https://api.200le.com";
                port = 8083

            }
            cc.vv.http.baseURL = host;
            cc.vv.global = require('Global');
            cc.vv.seckey = "vv";
            cc.vv.gamestatus = "none";
            cc.vv.io = require("IOUtils")
            cc.vv.user = {};
            cc.vv.dialog = null; //弹出的提示对话框，  alert

            cc.vv.openwin = null; //弹出的对话窗口，    设置、玩法、战绩等等
            cc.vv.layers = null;
            cc.vv.loadding = new cc.NodePool();
            cc.vv.loadding.put(cc.instantiate(this.loaddingPrefab)); // 创建节点
            cc.vv.gamesetting = new cc.NodePool();
            cc.vv.gamesetting.put(cc.instantiate(this.settingPrefab))
            cc.vv.dialog = new cc.NodePool();
            cc.vv.dialog.put(cc.instantiate(this.alertPrefab)); // 创建节点
            cc.vv.layers = new cc.NodePool();
            cc.vv.layers.put(cc.instantiate(this.layersPrefab)); // 创建节点
            cc.vv.recharge = new cc.NodePool();
            cc.vv.recharge.put(cc.instantiate(this.rechargePrefab))
            cc.vv.beanrecharge = new cc.NodePool();
            cc.vv.beanrecharge.put(cc.instantiate(this.payPrefab))
            cc.vv.makesure = new cc.NodePool();
            cc.vv.makesure.put(cc.instantiate(this.makesure)); // 创建节点



            cc.vv.game = {
                multiple: null,
                way: null,
                game_id: null
            };
            cc.vv.Notifycation = new cc.EventTarget();
            cc.vv.gameNotify = new cc.EventTarget();
            if (cc.vv.ENV == 'dev') {
                if (urlParse().t) {
                    cc.vv.http.authorization = urlParse().t
                } else {
                    cc.vv.http.authorization = "7c13849de88b93c76af535c4cf85a501"
                }
            }


            if (cc.sys.isBrowser) {
                let getCookie = function (name) {
                    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");　　
                    return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
                };
                if (getCookie('bingo') == null) {
                    //发送游客注册请求
                    // window.location.href = 'http://api.bingoooo.cn/404'  
                } else {
                    cc.vv.http.authorization = getCookie("bingo");
                }
            }
            /**
             * 游客登录，无需弹出注册对话框，先从本地获取是否有过期的对话数据，如果有过期的对话数据，则使用过期的对话数据续期
             * 如果没有对话数据，则重新使用游客注册接口
             */
            // this.loginFormPool = new cc.NodePool();
            // this.loginFormPool.put(cc.instantiate(this.prefab)); // 创建节点
            var Utils = require("Utils");
            cc.vv.utils = new Utils();
            var Audio = require("Audio");
            cc.vv.audio = new Audio();
            cc.vv.audio.init();

            if (cc.sys.isNative) {
                // window.io = SocketIO;
                window.io = require("Socket");
                cc.Device.setKeepScreenOn(true)
            } else {
                window.io = require("Socket");
            }

            cc.vv.socket = window.io;
            cc.vv.socket.config = {
                host: wshost,
                port: port
            }
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
                switch (event.keyCode) {
                    case cc.KEY.back:
                        if (cc.vv.gamesetting.size() > 0) {
                            let gamesetting = cc.vv.gamesetting.get();
                            gamesetting.parent = cc.find("Canvas"),
                                gamesetting.setLocalZOrder(cc.vv.global.locZorder.EXITPANEL);
                        }
                        break;
                }

            });
        }







        // cc.loader.onProgress = function (completedCount, totalCount, item) {
        //     var percent = (100 * completedCount / totalCount).toFixed(0);
        //     if (!percent || percent == 100 || isNaN(percent)) {
        //         return
        //     }
        //     console.log(percent)
        // }
    }
});