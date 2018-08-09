var Cuopai = require("CuoPai")
cc.Class({
    extends: Cuopai,

    properties: {
        type: {
            get() {
                return this._type
            },
            set(value) {
                // value<10?:this.texFront.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('M_white')
                if (value < 10) {
                    this.texFront.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('M_dot_' + value)
                }
                if (value == 10) {
                    this.texFront.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("M_white")
                }
                this._type = value
            }
        },
        score: {
            get() {
                return this._score
            },
            set(value) {
                this._realscore = value;
            },
        },

    },


    onLoad() {

        var self = this;
        this.disX = 0;
        this.disY = 0;
        this.startPos = cc.p(0, 0);
        this.startRotation = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (e) {
            if (this._status) {
                var startPos = cc.vv.global.getCanvasPos(e.getLocation())
                this.disX = self.node.x - startPos.x;
                this.disY = self.node.y - startPos.y;
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (e) {
            if (this._status) {
                var touch = cc.vv.global.getCanvasPos(e.getLocation());
                self.node.x = touch.x + self.disX;
                self.node.y = touch.y + self.disY;
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (e) {
            if (this._status && !this._isopen) {
                var dis = this.node.position;
                //向左搓
                if (dis.x < this.startPos.x) {
                    if (dis.x - this.startPos.x < -400 || Math.abs(dis.y - this.startPos.y) > 20) {
                        this._isopen = 1;
                        cc.vv.gameNotify.emit('cuopai');
                    }
                }
                //向右搓
                else if (dis.x > this.startPos.x) {
                    if (dis.x - this.startPos.x > 100 || Math.abs(dis.y - this.startPos.y) > 20) {
                        this._isopen = 1;
                        cc.vv.gameNotify.emit('cuopai');
                    }
                }
            }
        }, this);

    },

    init(card) {
        if (!card) return
        this.type = card.type;
        this.score = card.points;
        this._status = 1;
    },

    //搓牌动画,展开扇形，然后隐藏
    hideCard(i, callback) {
        this._status = 0;
        var self = this;
        // let action2 = cc.spawn(cc.moveTo(0.3, cc.p(Math.sin(rad) * 100, -250)), cc.rotateTo(0.3, 10 * (i - 5 / 4)))
        let action2 = cc.moveTo(0.3, 467* i - 233, 0)
        let action1 = cc.moveTo(0.3, cc.p(0, 0))
        let action = cc.sequence(action1, action2, cc.delayTime(0.3), action1, cc.moveTo(0.3, 0, -900), cc.callFunc(function () {
            self.score = 0;
            if (i == 1 && callback) {
                callback()
            }
            self.node.destroy()
        }))
        this.node.runAction(action)
    },

    //hide 
});