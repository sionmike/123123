var game = require("NiuGame")
cc.Class({
    extends: game,

    properties:{

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._super()
    },

    start() {

    },
    cardpush(card) {
        this.gamestatus = 4;
        if (this.game.roomdata.way == 'open') {
            this.game.startbtn.active = false;
        }
        var data = card;
        this.game.playersSeatList.forEach((player) => {
            player.ready(0);
        })

        if (this.game.myselfSeat.getUserStatus() != 6) {
            if (this.game.roomdata.way == 'open') {
                // this.game.setStatusTmer(cc.vv.STATUS_ENUM.CATCH, 7)
            }
            if (this.game.roomdata.way != 'open') {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.SHUFF, 12)
            }
        }
        if (data) {
            this.fapai(data)
        } else {

            // this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 15)
        }


        if (this.game.myselfSeat.getUserStatus() != 6) {
            this.game.myselfSeat.setPoints(data.points)
        }
    },
    card_push(msg) {
        this.gamestatus = 3;
        let cach = msg.detail.data.catch;
        let card = msg.detail.data.card;
        
        if(this.game.roomdata.way=="an"){
            this.cardpush(card);
            return
        }

        //动画结束的回调
        let callback = () => {
            if (cach.banker_id == cc.vv.user.id) {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.SHUFF, 6)
            } else {
                if (this.game.myselfSeat.getUserStatus() == 6) {
                    this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
                    return
                }
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.SHUFF, 8)
            }
            let banker = this.getBanker();
            if (banker != null) {
                banker.qiangzhuangDouble(cach.banker_mul)
            }

            this.cardpush(card);
        }

        //隐藏所有抢庄标识
        this.onLinePlayer.forEach((player) => {
            player.hideZhuangCatch()
        });


        if (cach.id.length > 1) {
            // if (cach.banker_mul != 0) {
            //     //多人抢庄
            //     this.game.setStatusTmer(cc.vv.STATUS_ENUM.BANKERANIMATION, 0);
            // } else {
            //     //无人抢庄  data.mul = 0
            //     this.game.setStatusTmer(cc.vv.STATUS_ENUM.NOCATCH, 0);
            // }
            if (cach.is_catch) {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.NOCATCH, 0);
            } else {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.BANKERANIMATION, 0);
            }
            this.zhuangAnimation(cach.banker_id, cach.id, callback);
        } else {
            this.getPlayer(cach.banker_id).setBanker(true, callback);
        }
    },
    fapai(card) {
        var cardlist = card.cards.split(",")
        var self = this;
        this.game.fapaiyuan.active = true;
        var activelist = []
        this.onLinePlayer.forEach((player, i) => {
            if (player.getUserStatus() != 6) {
                activelist.push(player)
            }
        });
        //fapai
        // dealCardsFromIndex: function(cardIndex) {
        //     if (cardIndex >= activelist.length) return;
        //     var self = this;
        //     this.cards[cardIndex].runAction(new cc.Sequence(
        //         cc.moveTo(time,x,y),
        //         cc.callFunc(function() {
        //             self.dealCardsFromIndex(cardIndex+1);
        //         })
        //     ));
        // }
        // this.dealCardsFromIndex(0);
        var fa = function (cardIndex) {
            if (cardIndex >= activelist.length) return;

            if (cardIndex == activelist.length - 1) {
                self.game.fapaiyuan.active = false;
            }
            if (activelist[cardIndex] == self.game.myselfSeat) {
                if (self.game.roomdata.way != 'open') {
                    self.game.myselfSeat.getTwoMj(fa(cardIndex + 1))
                    self.game.myselfSeat.setCardInfo(cardlist)
                    self.game.myselfSeat.setPoints(card.points)
                }
            } else {
                activelist[cardIndex].getTwoMj(fa(cardIndex + 1))
            }
        }
        fa(0)
    },
    player_show(msg) {
        let data = msg.detail.data;
        if (data.id == cc.vv.user.id) {
            this.game.myselfSeat.result(data.points);
        } else {
            let player = this.getPlayer(data.id)
            if (player) {
                player.showCard({
                    cards: data.cards,
                    points: data.points
                })
            }
        }
    },
    //超时所有人亮牌
    players_show(msg) {
        let data = msg.detail.data;
        this.game.cuopaiHide();
        for (let id in data) {
            if (id == cc.vv.user.id) {
                this.game.myselfSeat.result(data[id].points)
                this.game.myselfSeat.showCard({
                    cards: data[id].cards,
                    points: data[id].points
                })
            } else {
                let player = this.getPlayer(id)
                if (player) {
                    player.showCard({
                        cards: data[id].cards,
                        points: data[id].points
                    })
                }
            }
        }
        this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
    },
    
    onTipBtnClick() {
        let num = this.game.myselfSeat.getPoints()
        this.game.myselfSeat.result(num)
    },



    onFanpaiClike(event) {
        var self = this;
        this.game.myselfSeat.handcard.forEach((element, index) => {
            element.openCard();
        });
        cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.SHOW);
    },
    // update (dt) {},
});