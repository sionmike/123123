// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var vvCommon = require("vvCommon");
cc.Class({
    extends: vvCommon,

    properties: {
        feedMsg: {
            default: null,
            type: cc.EditBox
        }
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

    },
    onSendFeedBack(){
        var self=this;
        
        cc.vv.http.httpPost("/userFeedback", {
            msg: this.feedMsg.string
        }, function (e) {
            //成功回调
            self.feedMsg.string="";
            cc.vv.global.layered("反馈成功");
        },function(){
            cc.vv.global.layered("反馈失败");
        })
    },
    start() {

    },

    // update (dt) {},
});