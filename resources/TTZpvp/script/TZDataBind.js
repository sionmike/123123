// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html


var model = require("NiuDataBind")
cc.Class({
    extends: model,
    properties: {
        majiangInfo: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: "麻将纹理"
        },
        majiangInfo: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: "麻将纹理"
        },
        majiangInfo: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: "麻将纹理"
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super();
    },

    start() {

    },

    // update (dt) {},
    cuopaiAnimation() {
        var self = this;
        //在中间手牌的位置显示
        var po = this.myselfSeat.handcard[0].node.position;
        for (let i = 0; i < this.myselfSeat.handcard.length; i++) {
            var cp_card = this.cuopaiList[i];
            var card = this.myselfSeat.handcard[i];
            var action = cc.sequence(cc.moveTo(0.3, po), cc.moveTo(0.3, po.x, -250), cc.callFunc(function () {
                //最后一张手牌收起后，打开搓牌
                if (i == self.myselfSeat.handcard.length - 1) {
                    self.cuopaiList.forEach((card, index) => {
                        card.node.active = true;
                        let action =cc.moveTo(0.3, cc.p(((index - 2) * 5), self.resetCPos))
                        card.setStartPos();
                        card.node.runAction(action);
                        //最后一张搓牌出来，打开关闭按钮
                        if (index == self.myselfSeat.handcard.length - 1) {
                            self.close.active = true;
                            self.shadow.active = true;
                        }
                    })
                }
            }))
            //搓牌对应手牌
            cp_card.init(card.getCardValue());
            card.node.runAction(action);
        }
    },

    cuopaiEnd() {
        var self = this;
        var cp = this.cuopaiList;
        //isopen 为 01111  开过牌了
        var result = function () {
            cp.forEach((component, i) => {
                i != 1 ? component.hideCard(i) : component.hideCard(i, function () {
                    let po = 244;
                    self.myselfSeat.handcard.forEach((card, index) => {
                        card.node.runAction(cc.sequence(cc.moveTo(0.3, po, 0), cc.moveTo(0.3, index * 122, 0)));
                        card.openCard();
                    })
                    cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.SHOW);
                })
            })
        }
        //01
        if (!cp[0]._isopen && cp[1]._isopen) {
            result()
        }
        //isopen 为 11  开过牌了
        if (cp[0]._isopen && cp[1]._isopen) {
            result()
        }

        //10
        if (cp[0]._isopen && !cp[1]._isopen) {
            result()
        }
        
    },

    onCloseClick() {
        var self = this;
        if (!this.closeflag) {
            this.closeflag = 1;
            this.cuopaiList.forEach((component, i) => {
                i != 1 ? component.hideCard(i) : component.hideCard(i, function () {
                    let po = 244;
                    self.myselfSeat.handcard.forEach((card, index) => {
                        card.node.runAction(cc.sequence(cc.moveTo(0.3, po, 0), cc.moveTo(0.3, index * 122, 0)));
                        card.openCard();
                    })
                    cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.SHOW);
                })
            })
        }
    },

    setRoomInfo(room) {
        this.roomdata = room;
        this.roominfo.getChildByName('room_id').getComponent(cc.Label).string = '房号:' + room.room_number;
        let wanfa;
        switch (room.way) {
            case 'open':
                wanfa = "明牌抢庄";
                break;
            case 'free':
                wanfa = "抢庄玩法";
                break;
            case 'an':
                wanfa = "通比玩法";
                break;
        }
        this.roominfo.getChildByName('room_type').getComponent(cc.Label).string = '庄位:' + wanfa;
        this.roominfo.getChildByName('room_score').getComponent(cc.Label).string = '底分:' + room.multiple;
        if (!room.max_round) {
            this.roominfo.getChildByName('room_round').active = false;
        } else {
            this.roominfo.getChildByName('room_round').active = true;
            this.changeRound(room.round)
            this.roominfo.getChildByName('room_round').getChildByName('total').getComponent(cc.Label).string = '/' + room.max_round;
        }
    },
});