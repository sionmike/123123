// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
let recharge = require('Recharge')

cc.Class({
    extends: recharge,

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

        let row = cc.find("content/row", this.node);
        if (row) {
            row.children.forEach((item) => {
                item.on('touchstart', this.DHMoney, this)

            })
        }
        let close = cc.find("content/close", this.node);
        close.on('touchend', this.close, this)

    },

    //代币兑换
    DHMoney(event) {
        var self = this;
        var money = parseInt(event.target.name);
        this.setSureMsg({
            params: {
                money,
            },
            msg:'是否取出',
            callback: function (result) {
                this.setBean(result)
            }.bind(this),
            payApi: '/auth_withdraw_money',
            successInfo:'取出成功'
        })
    },
    close() {
        if (cc.vv.layers.size() == 0) return

        this.node.active = false;
    }

    // update (dt) {},
});