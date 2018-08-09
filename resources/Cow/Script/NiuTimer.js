var getTextByGameStatus = require('Global').getTextByGameStatus

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
        text: {
            default: null,
            type: cc.Label
        },
        ctime: null

    },

    // use this for initialization
    onLoad: function () {

    },
    /**
     * @param {string} text  文字
     * @param {int} time  时间
     * @param {cc.Node} target  文字的节点
     */

    // init(text, time, target) {
    //     let self = this;
    //     this.remaining = time;
    //     this.text = target.getComponent(cc.Label)
    //     this.text.string = text + ": " + this.remaining;
    //     target.schedule(function () {
    //         if (cc.sys.isBrowser) {
    //             self.ctime = new Date();
    //         }
    //         self.remaining = self.remaining - 1;
    //         if (self.remaining < 0) {
    //             self.unschedule(this);
    //             self.stop()
    //             cc.vv.audio.playSFX('timeout.wav')
    //         } else {
    //             self.text.string = text + ": " + self.remaining;
    //         }
    //     }, 1, time);
    // },

    /**
     * @param {int} time 
     * @param {cc.Node} target 文字的节点
     */


    //此定时器根据游戏状态变文字
    startTmer(time, target, txt) {
        let self = this;
        target.unscheduleAllCallbacks();
        this.text = target.getComponent(cc.Label);
        this.remaining = time;
        this.remaining ? this.text.string = cc.vv.global.getTextByGameStatus() + ": " + this.remaining : this.text.string = cc.vv.global.getTextByGameStatus();
        if (time) {
            this.timersrc = function () {
                this.remaining = this.remaining - 1;
                let statusText = cc.vv.global.getTextByGameStatus()
                if (cc.sys.isBrowser) {
                    self.ctime = new Date();
                }
                if (this.remaining < 0) {
                    this.text.string = statusText
                    this.unschedule(this);
                } else {
                    this.text.string = statusText + ": " + this.remaining;
                }
            }
            target.schedule(this.timersrc.bind(this), 1, time);
        }
    },

    stop(target) {
        this.remaining = 0;
        if (this.text) {
            target.unscheduleAllCallbacks();
            //如果组件有父级
            if (this.text.node.parent) {
                this.text.node.parent.active = 0
            } else {
                this.text.node.active = 0
            };
            this.text = null;
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});