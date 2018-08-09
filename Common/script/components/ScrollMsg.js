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
        text: {
            // ATTRIBUTES:
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Label, // optional, default is typeof default
            serializable: true, // optional, default is true
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.animate = this.text.getComponent(cc.Animation);
        this.animate.on('stop', () => {
            this.node.destroy()
        })
    },

    setMsg(string, callback, ctx) {
        this.text.string = string
        this.animate.on('stop', () => {
            callback();
            ctx.msgactive = 1;
        })
    }

    // update (dt) {},
});