// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        alipay: {
            // ATTRIBUTES:
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Prefab, // optional, default is typeof default

        },
        wxpay: {
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Prefab, // optional, default is typeof default
        },
        kefu: {
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Prefab, // optional, default is typeof default
        },
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    initAlipay() {
        var ctx = this;
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ZfbPay", "(Ljava/lang/String;)V","123");
        }
        cc.vv.http.httpPost("/api/recharge", {
            money: 10
        }, function (data) {
            var msg=JSON.parse(data)
            var item = cc.instantiate(ctx.alipay);
            item.setScale(0, 0)
            var action = cc.scaleTo(0.2, 1, 1)
            item.runAction(action)
            item.getComponent(cc.Component).init(msg.data)
            item.parent = cc.find("Canvas");
            item.setLocalZOrder(cc.vv.global.locZorder.QRCODE)
            ctx.node.destroy();
        }, function () {}, this,"https://hapi.200le.com");
    },
    initwxpay() {
        var ctx = this;
        cc.vv.http.httpPost("/api/recharge", {
            pay_type: 1
        }, function (data) {
            var msg=JSON.parse(data)
            var item = cc.instantiate(ctx.wxpay);
            item.setScale(0, 0)
            var action = cc.scaleTo(0.2, 1, 1)
            item.runAction(action)
            item.getComponent(cc.Component).init(msg.data)
            item.parent = cc.find("Canvas");
            item.setLocalZOrder(cc.vv.global.locZorder.QRCODE)
            ctx.node.destroy();
        }, function () {}, this,"https://hapi.200le.com");
    },
    initkefu(){
        var item = cc.instantiate(this.kefu);
        item.parent = cc.find("Canvas");
        this.node.destroy();
    },
    destroyed() {
        this.node.destroy();
    },
    start() {

    },
    // update (dt) {},
});