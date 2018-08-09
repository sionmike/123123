cc.Class({
    extends: cc.Component,
    properties: {
        texFront: cc.Node,
        texBack: cc.Node,
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

        type: {
            get() {
                return this._type
            },
            set(value) {
                // value<10?:this.texFront.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('M_white')
                if(value<10){
                    this.texFront.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('M_dot_' + value)
                }
                if(value==10){
                    this.texFront.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("M_white")
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
                this._realscore = value;
            },
        },
        _score: 0,
        _type: 0,
        _isopen: 0,
        _realscore: 0,
    },

    //有参数 为正面，没参数反面
    init(card) {
        card ? this.openCard(card) : this.hideCard();
        this.node.setPosition(0, 0);
    },

    hideCard(card) {
        if (card) {
            this.texFront.active = 0;
            this.texFront.scaleX = 0;
            this.texBack.active = 1;
            this.texBack.scaleX = 1;
            this._isopen = 0;
            this.type = Number(card);

        } else {
            this.texFront.active = 0;
            this.texFront.scaleX = 0;
            this.texBack.active = 1;
            this.texBack.scaleX = 1;
            this._isopen = 0;
        }

    },


    openCard(mj) {
        if (mj) {
            this.type=mj;
        }
        this.texFront.scaleX = 1;
        this.texFront.active = 1;
        this.texBack.active = 0;
        this.texBack.scaleX = 0;
        this._isopen = 1;
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.node.on('touchend', function (e) {
            if (self.node.parent.parent.name != 'myseats') return
            if (self._selected) {
                self.node.y = 0
                self._selected = false;
            } else {
                self.node.y = +30;
                self._selected = true;
            }
        })

    },

    reverse() {
        var self = this;
        if (this._isopen == 0) {
            let action = cc.sequence(cc.scaleTo(0.2, 0, 1), cc.callFunc(() => {
                self.texFront.active = 1;
                self.texFront.runAction(cc.scaleTo(0.2, 1, 1));
                
            }));
            this.texBack.runAction(action)
            self._isopen = 1;
        }
    },
    setCardValue(card) {
        this.type = Number(card.cards);
        this.score = Number(card.points);
    },
    getCardValue() {
        var card = {};
        card.type = this.type;
        card.score = this._realscore;
        return card
    },
    reset(){
        // this.node.setLocalZOrder(1);
        this.node.setScale(0.5, 0.5);
        this.texFront.active = 0;
        this.texFront.scaleX = 0;
        this.texBack.active = 1;
        this.texBack.scaleX = 1;
        this._isopen = 0;
        return this.node
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});