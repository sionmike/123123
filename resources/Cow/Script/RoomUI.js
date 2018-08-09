var Common = require('vvCommon')
cc.Class({
    extends: Common,

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

        setbg: {
            default: null,
            type: cc.Node,
            tooltip: '设置更多'
        },
        _isSetBgOpen: 0,
        set: {
            default: null,
            type: cc.Node,
            tooltip: '打开设置更多'
        },
    },

    // use this for initialization
    onLoad: function () {
        this.node.setLocalZOrder(cc.vv.global.locZorder.SETUI)
        var self;
        this.changroombtn = this.setbg.getChildByName('change');
        this.dissolvebtn = this.setbg.getChildByName('dissolve');
        this.changroom = this.setbg.getChildByName('change');
        this.backbtn = this.setbg.getChildByName('back');
        if (cc.vv) {
            cc.vv.roomUI = self = this;
        }
    },
    onSettingBtnClick() {
        this.set.active = !this.set.active;
        this.setbg.active = !this.setbg.active;
    },

    onHelpBtnClick() {
        // var ret = jsb.reflection.callStaticMethod("NativeOcClass", 
        // "callNativeUIWithTitle:andContent:",
        // "cocos2d-js", 
        // "Yes! you call a Native UI from Reflection");
    },
    onBackBtnClick() {
        // this.alertUI.parent=this.root();
        // this.alertUI.active = true;
        // this.alertUI.getComponent(cc.Animation).play();
        this.makesure({
            message: '是否退出房间',
            ok: function () {
                cc.vv.socket.send({
                    controller_name: "YtxScoketService",
                    method_name: "backHall"
                })
            }
        })

    },
    onZJHBackBtnClick() {
        this.makesure({
            message: '是否退出房间',
            ok: function (context) {
                cc.vv.socket.send({
                    controller_name: "YhtZjhWsService",
                    method_name: "outRoom"
                })
            }
        }, this)
    },
    onSetBtnClick() {
        this.showsetting();
    },

    onRechargeClick() {
        this.showcharge();
    },
    onDissolveClick() {
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: ""
        })
    },

    onBtnWeichatClicked() {
        // var title = "<血战到底>";
        // if(cc.vv.gameNetMgr.conf.type == "xlch"){
        //     var title = "<血流成河>";
        // }
        // cc.vv.anysdkMgr.share("天天麻将" + title,"房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa());
    },


});