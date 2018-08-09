cc.Class({
    extends: cc.Component,
    properties: {
        handcard: [],
        _cardPool: null,
        _hold: null,
        _niutype: null,
        _niulist: null,
        _deliver: null,
        _cardlist: null,
        _numofhandcard: {
            default: 5,
            type: cc.Integer,
            tooltip: '初始化手牌数量',
        },
        _points: 0
    },
    onLoad: function () {

    },

    //找发牌员补充手牌
    getCard() {
        if (!this._cardPool) return
        if (this._cardPool.size() > 0 && cc.vv) {
            let node = this._cardPool.get();
            let card = node.getComponent(cc.Component);
            node.setPosition(this._hold.convertToNodeSpaceAR(this._deliver));
            if (this.node.name == 'myseats') {
                // cc.rotateBy(0.1,360),
                var action = cc.spawn(cc.moveTo(0.1, this.handcard.length * 122, 0), cc.scaleTo(0.1, 1, 1))
                // node.setScale(1,1)
            } else /*var action=cc.spawn(cc.moveTo(0.1,this.handcard.length*25,0),cc.rotateBy(0.1,360))*/ var action = cc.moveTo(0.1, this.handcard.length * 25, 0)
            card.node.runAction(action)
            node.parent = this.node.getChildByName('hold')
            this.handcard.push(node.getComponent(cc.Component))
        }
    },

    getFiveCard(callback) {
        if (!this._cardPool) return
        for (let i = 0; i < this._numofhandcard; i++) {
            if (this._cardPool.size() > 0 && cc.vv) {
                let node = this._cardPool.get();
                let card = node.getComponent(cc.Component);
                //发牌员相对于每个玩家的位置
                node.setPosition(this._hold.convertToNodeSpaceAR(this._deliver));
                if (this.node.name == 'myseats') {
                    var action = cc.spawn(cc.moveTo(0.1, i * 122, 0), cc.scaleTo(0.1, 1, 1))
                } else {
                    var action = cc.moveTo(0.1, this.handcard.length * 25, 0)
                }
                let animation = cc.sequence(action, cc.callFunc(callback))
                card.node.runAction(animation)
                node.parent = this.node.getChildByName('hold')
                this.handcard.push(node.getComponent(cc.Component))
            }
        }
        cc.vv.audio.playSFX('niuniu/fapai.wav')
    },
    getMpFiveCard(cardlist, callback) {
        if (!this._cardPool) return
        for (let i = 0; i < this._numofhandcard; i++) {
            if (this._cardPool.size() > 0 && cc.vv) {
                let node = this._cardPool.get();
                let card = node.getComponent(cc.Component);
                //发牌员相对于每个玩家的位置
                node.setPosition(this._hold.convertToNodeSpaceAR(this._deliver));
                if (this.node.name == 'myseats') {
                    var action = cc.spawn(cc.moveTo(0.1, i * 122, 0), cc.scaleTo(0.1, 1, 1))
                } else {
                    var action = cc.moveTo(0.1, this.handcard.length * 25, 0)
                }
                if (i < 4) {
                    card.openCard(cardlist[i])
                } //do something
                if (i == 4) {
                    card.hideCard(cardlist[i])
                } //do something
                let animation = cc.sequence(action, cc.callFunc(callback))
                card.node.runAction(animation)
                node.parent = this.node.getChildByName('hold')
                this.handcard.push(node.getComponent(cc.Component))
            }
        }

        cc.vv.audio.playSFX('niuniu/fapai.wav')
    },


    getTwoMj(callback) {
        if (!this._cardPool) return
        for (let i = 0; i < this._numofhandcard; i++) {
            if (this._cardPool.size() > 0 && cc.vv) {
                let node = this._cardPool.get();
                let card = node.getComponent(cc.Component);
                //发牌员相对于每个玩家的位置
                node.setPosition(this._hold.convertToNodeSpaceAR(this._deliver));
                if (this.node.name == 'myseats') {
                    var action = cc.spawn(cc.moveTo(0.1, i * 122, 0), cc.scaleTo(0.1, 1, 1))
                } else {
                    var action = cc.moveTo(0.1, this.handcard.length * 122, 0)
                }
                let animation = cc.sequence(action, cc.callFunc(callback))
                card.node.runAction(animation)
                node.parent = this.node.getChildByName('hold')
                this.handcard.push(node.getComponent(cc.Component))
            }
        }
        cc.vv.audio.playSFX('niuniu/fapai.wav')
    },

    //恢复手牌
    recorveyCard(list, isopen) {
        if (!this._cardPool) return
        if (typeof list == "string") {
            var cardlist = list.split(",")
        } else {
            var cardlist = list;
        }
        for (let i = 0; i < this._numofhandcard; i++) {
            if (this._cardPool.size() > 0 && cc.vv) {
                let node = this._cardPool.get();
                let card = node.getComponent(cc.Component);
                if (isopen) {
                    card.openCard(cardlist[i])
                } else {
                    card.hideCard(cardlist[i])
                } //do something
                //发牌员相对于每个玩家的位置
                if (this.node.name == 'myseats') {
                    node.setPosition(cc.p(i * 122, 0));
                    node.setScale(1, 1)
                } else {
                    node.setPosition(cc.p(this.handcard.length * 25, 0));
                }
                node.parent = this.node.getChildByName('hold')
                this.handcard.push(node.getComponent(cc.Component))
            }
        }
    },

    recorveyMpCard(cardlist, isopen) {
        if (!this._cardPool) return
        for (let i = 0; i < this._numofhandcard; i++) {
            if (this._cardPool.size() > 0 && cc.vv) {
                let node = this._cardPool.get();
                let card = node.getComponent(cc.Component);
                if (i < this._numofhandcard - 1) {
                    card.openCard(cardlist[i])
                }
                if (i == this._numofhandcard - 1) {
                    if (isopen) {
                        card.openCard(cardlist[i])
                    } else {
                        card.hideCard(cardlist[i])
                    } //do something
                }
                //发牌员相对于每个玩家的位置
                if (this.node.name == 'myseats') {
                    node.setPosition(cc.p(i * 122, 0));
                    node.setScale(1, 1)
                } else {
                    node.setPosition(cc.p(this.handcard.length * 25, 0));
                }
                node.parent = this.node.getChildByName('hold')
                this.handcard.push(node.getComponent(cc.Component))

            }
        }
    },
    setHandcardFree() {
        var self = this;
        this.handcard.forEach(function (component, index) {
            self._cardPool.put(component.reset());
        })
        this.handcard = [];
        this._cardlist = null;
    },

    sortHandcard() {
        var self = this
        if (this._niutype != 0) {
            let cardlist = []
            let threelist = []
            for (let i = 0; i < this.handcard.length; i++) {
                cardlist.push(this.handcard[i].getCardValue())
            }
            this._niulist.forEach((threecard, index) => {
                for (let i = 0; i < cardlist.length; i++) {
                    if (threecard == cardlist[i].score) {
                        threelist.push(cardlist.splice(i, 1)[0])
                        break;
                    }
                }
            })
            cardlist = threelist.concat(cardlist);

            this.handcard.forEach((card, index) => {
                let cardinfo = cardlist[index]
                card.openCard({
                    card_type: cardinfo.type,
                    card_res: cardinfo.score
                })
                if (index <= 2) {
                    card.node.setPosition(index * 50 + 100, 0)
                } else {
                    card.node.setPosition(index * 122, 0)
                }
            })

        } else {
            this.handcard.forEach((card, index) => {
                card.openCard();
                card.node.setPosition(index * 122, 0)
            })
        }
    },
    setCardInfo(cardlist) {
        this.handcard.forEach((card, index) => {
            card.hideCard(cardlist[index])
        })
        this._cardlist = cardlist
    },
    setNiutype(val, list) {
        this._niutype = val;
        this._niulist = list;
    },
    setPoints(num) {
        this._points = num
    },
    getPoints() {
        return this._points
    },
    getNiutype() {
        return {
            niuType: this._niutype,
            three: this._niulist
        }
    },
    setDeliver(delivervec) {
        this._deliver = delivervec
    },
    setCardPool(pool) {
        this._cardPool = pool
    },
    setNumOfCard(num) {
        this._numofhandcard = num;
    }

});