String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                }
                else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
};
cc.Class({
    extends: cc.Component,
    properties: {
        text: {
            default: null,
            type: cc.Label
        },
        ctime: null,
        _type: ''
    },
    onLoad: function () {
    },
    /**
     * opt
     * @param {string} text  文字
     * @param {int} time  时间
     * @param {cc.Node} target  文字的节点
     */
    // init(text, time, target) {
    //     let self = this;
    //     // target.parent.node.active = 1;
    //     self.remaining = time;
    //     self.text = target.getComponent(cc.Label);
    //     self.text.string = text + ": " + self.remaining;
    //     target.schedule(function () {
    //         if (cc.sys.isBrowser) {
    //             self.ctime = new Date();
    //         }
    //         self.remaining = self.remaining - 1;
    //         if (self.remaining < 0) {
    //             cc.vv.socket.send({ command: "getStatusSurplusTime" })
    //             self.stop(target);
    //         } else {
    //             self.text.string = text + ": " + self.remaining;
    //         }
    //     }, 1, time);
    // },
    /**
     * @param {object} opt  文字
     * @param {int} opt.time  时间
     * @param {cc.Node} opt.target  文字的节点
     * @param {string} opt.text  文字
     * @param {string} opt.type  类型  ‘wai’
     */
    init(opt) {
        var label;
        let text = opt.text || opt.time;
        let target = opt.target || this;
        this._type = opt.type;
        if (opt.type == "wait") {
            label = "{0}({1})";
        } else if (opt.type == "bet") {
            label = "{0}"
        }
        else if (opt.type == "next") {
            label = "{0}:{1}";
        }
        else if (opt.type == "start") {
            label = "{0}:{1}";
        } else if (opt.type == "bettime") {
            label = "{1}";
        } else if (opt.type == "xipai") {
            label = "{0}";
        } else if (opt.type == "tishi") {
            label = "{0}";
        }
        if (target) {
            target.node.active = true;
            target.node.parent.active = true;
            this.text = target;
        }
        this.remaining = Number(opt.time);
        this.text.string = label.format(text, this.remaining);

        this.timesrc = function () {


            this.remaining--;

            if (this.remaining < 1) {

                this.stop(opt);
            } else {
                this.text.string = label.format(text, this.remaining);
            }
        }.bind(this);
        target.schedule(this.timesrc, 1, opt.time);
    },
    stop() {
        this.remaining = 0;
        if (this.text) {
            this.text.string = "";
            this.text.unscheduleAllCallbacks();
            //如果组件有父级
            if (this._type == "bettime") {
                this.text.node.parent.active = false;
                this.text.node.active = false;
            }
            else if (this._type == "xipai" || this._type == "start" || this._type == "next" || this._type == "bet") {
                this.text.node.parent.active = false;
                this.text.node.active = false;
            }
            else if (this._type == "wait" || this._type == "tishi") {
                this.text.node.active = false;
            }
            else {
                this.text.node.active = false;
            }
        }
    },
});