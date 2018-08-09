var seats = require("Seat")
cc.Class({
    extends: seats,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
    },

    start() {

    },
    //亮牌
    showCard(data) {
        var cards = data.cards.split(",")
        this.handcard.forEach((card, index) => {
            card.openCard(cards[index])
        })
        this.result(data.points)
    },
    /**
     * @param {int} result 
     */
    result(result) {

        var re = Number(result)

        if (re < 50) {
            re % 1 == 0.5 ? re = Math.floor(re) + "点半" : re = re + "点"
        }
        if (re >= 50) {
            re = "豹子"
        }

        if (re >=50) {
            this._result.color = this._niuColor.highTextColor;
            this._result.getComponent(cc.LabelOutline).color = this._niuColor.highOutlineColor;
        } else {
            this._result.color = this._niuColor.lowTextColor;
            this._result.getComponent(cc.LabelOutline).color = this._niuColor.lowOutlineColor;
        }


        this._result.getComponent(cc.Label).string = re
        this._result.active = 1;
        this._result.getComponent(cc.Animation).play();
        // this._gender ? cc.vv.audio.playSFX('niuniu/niu_' + re + '_boy.wav') : cc.vv.audio.playSFX('niuniu/niu_' + re + '_girl.wav')
    },
    // update (dt) {},
});