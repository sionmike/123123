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

    // onLoad () {},

    start() {

    },
    score(value) {
        //坑，美术资源 +- 没打包一起
        // this.countBean(value)
        var win;
        this.node.children.forEach((node) => {
            node.active = false
        });
        value >= 0 ? win = this.node.getChildByName('winresult') : win = this.node.getChildByName('loseresult');
        value = Math.abs(value);
        win.getChildByName('score').getComponent(cc.Label).string = value + '';
        win.active = 1 && (win.parent.active = 1);
        if (win.parent.getComponent(cc.Animation)) {
            win.parent.getComponent(cc.Animation).play()
            // this.scheduleOnce(() => {
            //     win.parent.active = false
            // }, 2)
        }

    },
    // update (dt) {},
});