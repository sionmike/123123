var card = require("NiuCard")


cc.Class({
    extends: card,

    properties: {
        // nodes
        //黑红梅方 1,2,3,4
        type: {
            get() {
                return this._type
            },
            set(value) {
                let res = value == 'A' && 1 || value == 'B' && 2 || value == 'C' && 3 || value == 'D' && 4
                this.big.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(res + '');
                this.small.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame('m_' + res);

                if (value == "A" || value == "C") {
                    this.scoreNode.color = cc.Color.BLACK;
                }
                if (value == "B" || value == "D") {
                    this.scoreNode.color = cc.Color.RED;
                } else {

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
                if (value == 14) {
                    this.scoreNode.getComponent(cc.Label).string = "A";
                } else if (value <= 10) {
                    this.scoreNode.getComponent(cc.Label).string = value.toString();
                } else if (value == 11) {
                    this.scoreNode.getComponent(cc.Label).string = 'J'
                } else if (value == 12) {
                    this.scoreNode.getComponent(cc.Label).string = 'Q'
                } else if (value == 13) {
                    this.scoreNode.getComponent(cc.Label).string = 'K'
                } else {

                }
            },
        },
        gap: {
            default: null,
            type: cc.SpriteFrame,

        },
        losefont: {
            default: null,
            type: cc.SpriteFrame,

        },
        loseback: {
            default: null,
            type: cc.SpriteFrame,

        },
        gapSprite: {
            default: null,
            type: cc.Sprite,

        }
    },
    init(card) {
        card ? this.openCard(card) : this.hideCard();
    },

    hideCard(card) {
        if (card) {
            this.texFront.active = 0;
            this.texFront.scaleX = 0;
            this.texBack.active = 1;
            this.texBack.scaleX = 1;
            this._isopen = 0;
            this.type = card.card_type;
            this.score = card.card_res;
        } else {
            this.texFront.active = 0;
            this.texFront.scaleX = 0;
            this.texBack.active = 1;
            this.texBack.scaleX = 1;
            this._isopen = 0;
        }

    },
    loseFrontCard() {
        this.texFront.getComponent(cc.Sprite).spriteFrame = this.losefont
    },
    loseBackCard() {
        this.texBack.getComponent(cc.Sprite).spriteFrame = this.loseback
    },
    setGap() {
        if (this.gapSprite.spriteFrame == null) {
            this.gapSprite.spriteFrame = this.gap
        }
    },
    openCard(card) {
        if (card) {
            this.type = card.card_type;
            this.score = card.card_res;
        }
        this.texFront.scaleX = 1;
        this.texFront.active = 1;
        this.texBack.active = 0;
        this.texBack.scaleX = 0;
        this._isopen = 1;
    },
    setCardValue(card) {
        this.type = card.card_type;
        this.score = card.card_res;
    },
    getCardValue() {
        var card = {};
        card.type = this.type;
        card.score = this._realscore;
        return card
    },
    // use this for initialization
    onLoad: function () {


    },
});