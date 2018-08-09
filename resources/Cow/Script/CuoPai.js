cc.Class({
    extends: cc.Component,
    properties: {
        texFront: cc.Node,
        scoreNode: {
            default: null,
            type: cc.Node
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: '花色图集'
        },

        big: {
            default: null,
            type: cc.Node,
            tooltip: '大花色'
        },

        small: {
            default: null,
            type: cc.Node,
            tooltip: '小花色'

        },
        _selected: 0,
        //牌可获得参数 type isOpen  score



        //黑红梅方 1,2,3,4
        type: {
            get() {
                return this._type
            },
            set(value) {
                this.big.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('cuopai_' + value);
                this.small.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('cm_' + value);
                if (value == 1 || value == 3) {
                    this.scoreNode.color = cc.Color.BLACK;
                }
                if (value == 2 || value == 4) {
                    this.scoreNode.color = cc.Color.RED;
                }
                this._type = value
            }
        },


        isOpen: {
            get() {
                return this._isopen
            },
            set(value) {
                if (value == 0) {
                    this.hideCard();
                }
                if (value == 1) {

                }
            }
        },
        //1-13
        score: {
            get() {
                return this._score
            },
            set(value) {
                if (value == 1) {
                    this._score = value;
                    this.scoreNode.getComponent(cc.Label).string = "A";
                } else if (value <= 10) {
                    this._score = value;
                    this.scoreNode.getComponent(cc.Label).string = value.toString();
                } else if (value == 11) {
                    this._score = 10;
                    this.scoreNode.getComponent(cc.Label).string = 'J'
                } else if (value == 12) {
                    this._score = 10;
                    this.scoreNode.getComponent(cc.Label).string = 'Q'
                } else if (value == 13) {
                    this._score = 10;
                    this.scoreNode.getComponent(cc.Label).string = 'K'
                } else {

                }
            },
        },
        _score: 0,
        _type: 0,
        _isopen: 0,
        //是否可以点击
        _status: 1,
    },



    // use this for initialization
    onLoad: function () {
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
                    if (dis.x - this.startPos.x > 30 || Math.abs(dis.y - this.startPos.y) > 20) {
                        this._isopen = 1;
                        cc.vv.gameNotify.emit('cuopai');
                    }
                }
            }
        }, this);
    },


    //初始化牌面
    //有参数 为正面，没参数反面
    init(card) {
        if (!card) return
        this.type = card.type;
        this.score = card.score;
        this._status = 1;
    },

    //搓牌动画,展开扇形，然后隐藏
    hideCard(i, callback) {
        this._status = 0;
        var self = this;
        var radd = function (angle) {
            return 2 * Math.PI / 360 * angle
        }
        let rad = radd(15 * (i - 1.5))

        let action2 = cc.spawn(cc.moveTo(0.3, cc.p(Math.sin(rad) * 100, -250)), cc.rotateTo(0.3, 10 * (i - 5 / 4)))

        let action1 = cc.spawn(cc.moveTo(0.3, cc.p(0, -250)), cc.rotateTo(0.3, 0))
        let action = cc.sequence(action1, action2, cc.delayTime(0.3), action1, cc.moveTo(0.3, 0, -900), cc.callFunc(function () {
            // self.score = 0;
            // self.reset();
            if (i == 4 && callback) {
                callback()
            }
            self.node.destroy()
        }))
        this.node.runAction(action)
    },

    //hide 
    reset() {

        this.node.rotation = this.startRotation;
        this.node.x = this.startPos.x;
        this.node.y = this.startPos.y;
        this.node.active = false;
        this._isopen = 0;
        this._status = 1;

    },
    setStartPos() {
        this.startPos = this.node.position;
        this.startRotation = this.node.rotation;
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});