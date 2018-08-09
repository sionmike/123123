var vvCommon = require("vvCommon");

cc.Class({
    extends: vvCommon,

    properties: {
        pao: cc.Prefab,
        card: cc.Prefab,

        username: {
            default: null,
            type: cc.Label,
            tooltip: '用户名字lbl',
        },
        goldcoins: {
            default: null,
            type: cc.Label,
            tooltip: '金币数量lbl',
        },
        watchtips: {
            default: null,
            type: cc.Prefab,
            tooltip: '扑克预制图',
        },
        discardtips: {
            default: null,
            type: cc.Prefab,
            tooltip: '扑克预制图',
        },
        pokercards: {
            default: null,
            type: cc.Node,
            tooltip: '存放扑克的节点',
        },
        photo: {
            default: null,
            type: cc.Sprite,
            tooltip: '头像精灵图',
        },
        timersprite: {
            default: null,
            type: cc.Sprite,
            tooltip: '外围边框倒计时',
        },
        result: {
            default: null,
            type: cc.Prefab,
            tooltip: '结算的',
        },

        visitor: {
            default: null,
            type: cc.Prefab,
            tooltip: '旁观',
        },
        outline: {
            default: null,
            type: cc.Prefab,
            tooltip: '离线',
        },
        readyprefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '准备',
        },

        //准备
        status: {
            default: null,
            type: cc.Node
        },

        betcoin: {
            default: null,
            type: cc.Label
        },
        betcoinPanel: {
            default: null,
            type: cc.Node
        },
        qipao: {
            default: null,
            type: cc.Node,
            tooltip: '气泡提示',
        },
        flashtip: {
            default: null,
            type: cc.Node,
            tooltip: '闪烁提示',
        },
        discard: {
            default: null,
            type: cc.Prefab,
            tooltip: '弃牌',
        },
        scorePrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: '分数',
        },
        emoji: {
            default: null,
            type: cc.Node,
        },
        loseCardinfo: {
            default: null,
            type: cc.SpriteAtlas
        },
        normalCardinfo: {
            default: null,
            type: cc.SpriteAtlas
        },
        _userId: 0,
        _isactive: 0,
        _status: 0,
        _offline: 0,
        _isFollow: 0,
        _tips: 0,
        _isShow: 0,
        _betcoin: 0,
        _timecount: 0,
        _seatIndex: 0,
        _lastChatTime: -1,
        _lastEmojiTime: -1,
        _gender: null,
        _genderH: "b",
        _cardType: 0,
        _flashable: false,
        _flashgap: 0,
        _remaintime: 0

    },
    onLoad() {
        this.handcard = new Array()
        this.cardcount = 0;
        this.cardslist = new Array();
        this.statusNode = null;
        this._discard = cc.instantiate(this.discard)
        this._scoreNode = this.node.getChildByName("score")
        this._tips = 0;
        this._chatBubble = this.node.getChildByName("chatbubble")
        this._timecleartip = this.node.getChildByName("jsq")
        this._timeclearnum = this._timecleartip.getChildByName("lbl").getComponent(cc.Label)
        //手牌
        this._hold = this.node.getChildByName("hold");
        this._timerfuc = () => {
            this.flashtip.active = !this.flashtip.active
        }
        this.clean()
    },
    initplayer(data, index) {
        this.username.string = data.name;
        this._userId = data.id;
        this._isFollow = data.is_follow
        this._isShow = data.is_show
        this._gender = data.gender
        this._gender == 1 ? this._genderH = "b" : this._genderH = "g"
        if (data.is_active == 1) {
            this.catchtimer(data.user_time)
        }
        this.photo.spriteFrame = cc.vv.playerAtlas.getSpriteFrame(data.header);
        if (data.is_online == 0) {
            this.setStatus(data.is_online)
        } else {
            this.setStatus(data.user_status)
        }


        this.setMoney(data.money)
        this._seatIndex = index
        this.node.parent.setPosition(cc.vv.global.zjhPlayerVec2[index].player)
        this.scheduleOnce(() => {
            this._hold.setPosition(cc.vv.global.zjhPlayerVec2[index].holdVec)
            this.betcoinPanel.setPosition(cc.vv.global.zjhPlayerVec2[index].coinVec)
        }, 0)
    },
    catchtimer(times) {
        this._timecount = 1 / (times * 60);
        this._remaintime = Math.ceil(times * 0.4)
        this._isactive = 1;
        // var gameTimer = require("GameTimer");
        // this.beimitimer = new gameTimer();
        // this.timesrc = this.beimitimer.runtimers(this, this.jsq, this.atlas, this.timer_num, 0, times);
    },
    stopcatchtimer() {
        this._isactive = 0;
        this._timecount = 0;
        this._remaintime = 0;
        this.timersprite.fillRange = this._timecount;
        this._timecleartip.active = false;
    },

    showCard(data, result) {
        this._cardType = result
        this.handcard.forEach((card, index) => {
            card.init({
                card_type: data[index].color,
                card_res: data[index].value
            })
        })
        this.showcardinfo(this._cardType, true)
    },

    Sendcompare() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userCompare"
        }, {
            uid: this._userId
        })
        this.setActive(false)
    },

    showtips(tips) {
        this._tips = tips
        let prefab;
        if (this._tips == 0) {
            if (this.tipsNode != null) {
                this.tipsNode.destroy()
            }
        }
        if (this.tipsNode != null) {
            this.tipsNode.destroy()
        }
        if (this._tips == 1) {
            cc.vv.audio.playSFX(`zjh/Look/${this._genderH}_Look_0${Math.round(Math.random()*5+1)}.wav`)
            prefab = cc.instantiate(this.watchtips);
            this._hold.addChild(prefab)
            this._isShow = 1
        }
        if (this._tips == 2) {
            cc.vv.audio.playSFX(`zjh/Quit/${this._genderH}_Quit_0${Math.round(Math.random()*5+1)}.wav`)
            prefab = cc.instantiate(this.discardtips);
            this._hold.addChild(prefab)
        }
        this.tipsNode = prefab
    },

    showcardinfo(result, type) {
        if (result == null || type == null) return
        let atlas = type ? this.normalCardinfo : this.loseCardinfo
        let sprite = atlas.getSpriteFrame(result)
        let prefab;
        if (this.tipsNode != null) {
            this.tipsNode.destroy()
        }
        prefab = new cc.Node();
        let sp = prefab.addComponent(cc.Sprite);
        sp.spriteFrame = sprite;
        prefab.setPosition(new cc.Vec2(20, 0))
        this._hold.addChild(prefab);
        this.tipsNode = prefab;
    },
    score(val) {
        this._scoreNode.removeAllChildren()
        let iterm = cc.instantiate(this.scorePrefab)
        this._scoreNode.addChild(iterm)
        iterm.getComponent(cc.Component).score(val)
    },
    // refresh(playerInfo) {
    //     var self = this;
    //     var url = 'https://wx.officesupplier.net';
    //     this.username.string = playerInfo.nick_name;
    //     this.username.node.parent.active = 1;
    //     cc.loader.load(url + playerInfo.avadar, function (err, texture) {
    //         let sp = new cc.SpriteFrame(texture);
    //         self.payerPhoto.spriteFrame = sp;
    //     });
    //     this.goldcoins.string = 1234;
    //     this._userId = playerInfo.position_id;
    //     // this.payerPhoto.spriteFrame =playerInfo.avadar;
    // },
    /* reset(){
         this._userId = null;
         this.username.node.parent.active = 0;
         this.username.string = '';
         this.payerPhoto.spriteFrame = this.nullAvadar;
     },*/

    //弃牌 跟注 显示
    paomove(str) {
        if (str == "加注") cc.vv.audio.playSFX(`zjh/Add/${this._genderH}_Add_0${Math.round(Math.random()*6+1)}.wav`)
        if (str == "跟注") cc.vv.audio.playSFX(`zjh/Call/${this._genderH}_Call_0${Math.round(Math.random()*6+1)}.wav`)
        var item = cc.instantiate(this.pao);
        item.getChildByName('text').getComponent(cc.Label).string = str;
        item.getComponent(cc.Animation).play('slowup');
        item.parent = this.qipao;
        item.setPosition(0, 0);
        item.getComponent(cc.Animation).on('stop', () => {
            item.destroy()
        })
    },
    getCurCardType() {
        return this._cardType
    },
    addBetCoin(num) {
        this._betcoin = Number(this._betcoin) + Number(num)
        this.betcoin.string = this._betcoin + ""
    },
    setBetCoin(num) {
        this.betcoin.string = this._betcoin = `${num}`
    },
    addHandCard(card) {
        this.handcard.push(card)
    },
    getHandCard() {
        return this.handcard
    },
    getIsShow() {
        return this._isShow
    },
    compareLose() {
        this.handcard.forEach((card, index) => {
            card.loseBackCard()
            if (index == this.handcard.length - 1) {
                card.setGap()
            }
        })
    },
    myselfLoseCompare() {
        if (this._isShow == 1) {
            this.showcardinfo(this._cardType, false)
            this.handcard.forEach((card, index) => {
                if (index == this.handcard.length - 1) {
                    // card.setGap()
                }
            })
        } else {
            this.handcard.forEach((card, index) => {
                card.loseBackCard()
                if (index == this.handcard.length - 1) {
                    card.setGap()
                }
            })
        }
    },

    loserShowCard(data, cardType) {
        this.showcardinfo(cardType, false)
        this.handcard.forEach((card, index) => {
            card.init({
                card_type: data[index].color,
                card_res: data[index].value
            })
            if (index == this.handcard.length - 1) {
       
            }
        })
    },

    destroyHandCard() {
        this.handcard.forEach((card) => {
            card.node.destroy()
        })

        this._discard.parent = null
        this.handcard = new Array();
    },
    getGenderH() {
        return this._genderH
    },

    getUserId() {
        return this._userId
    },
    getSeatIndex() {
        return this._seatIndex
    },
    setActive(bool) {
        // this.flashtip
        if (bool) {
            this.flashtip.active = true
            this.node.getComponent(cc.Button).interactable = true
            // this.schedule(this._timerfuc, 0.5)
            this._flashable = true
        } else {
            this._flashable = false
            this.flashtip.active = false
            this.node.getComponent(cc.Button).interactable = false
            // this.unschedule(this._timerfuc)
        }
    },

    followAll(val) {
        this._isFollow = val
    },
    isFollowing() {
        return Number(this._isFollow)
    },

    clean() {
        if (this.jsq) {
            this.jsq.active = false;
        }
        if (this.takecards) {
            this.takecards.active = false;
        }

        if (this.betcoin) {
            this._betcoin = 0
            this.betcoin.string = this._betcoin
        }
        if (this._scoreNode) {
            this._scoreNode.removeAllChildren()
        }
        this._isFollow = 0
        this._isShow = 0
        this._cardType = 0
        this.destroyHandCard();
        this.showtips(0)
        this.setStatus(1)
        this.stopcatchtimer()
        this.setActive(false)
    },
    setemoji(sprite) {
        this._lastEmojiTime = 2
        this.emoji.getComponent(cc.Sprite).spriteFrame = sprite
        this.emoji.active = true;
    },
    chatBubble(msg) {
        this._lastChatTime = 2
        this._chatBubble.getChildByName("lbl").getComponent(cc.Label).string = msg
        this._chatBubble.active = true;
    },
    getSeatIndex() {
        return this._seatIndex
    },
    getStatus() {
        return this._status
    },
    setCoinPanel(bool) {
        this.betcoinPanel.active = bool
    },
    setStatus(status) {
        this._status = status;
        let prefab;
        if (status == 1) {
            this.setCoinPanel(true)
        }
        if (this.statusNode != null) {
            this.statusNode.destroy()
        }
        if (status == 6) {
            prefab = cc.instantiate(this.visitor)
            this.status.addChild(prefab)
        }
        if (status == 8) {
            prefab = cc.instantiate(this.readyprefab)
            this.status.addChild(prefab)
        }
        if (status == 0) {
            this.setCoinPanel(false)
            prefab = cc.instantiate(this.outline)
            this.status.addChild(prefab)
        }
        this.statusNode = prefab
    },
    isTrun() {
        return this._isactive
    },

    pk(bool) {
        // this._hold.active = !bool
        this.betcoinPanel.active = !bool
    },
    setMoney(money) {
        if (this.goldcoins) {
            this.goldcoins.string = `${money}`;
        }
    },
    addMoney(money) {
        if (this.goldcoins) {
            let origin = Number(this.goldcoins.string)
            let add = Number(money)
            this.goldcoins.string = origin + add + "";
        }
    },
    getHoldNode() {
        return this._hold
    },
    update(dt) {

        if (this._isactive) {
            if (this.timersprite.fillRange > 0.6) {
                if (!this._timecleartip.active) {
                    this._timecleartip.active = true
                }
                this._remaintime -= dt
                if (this._remaintime >= 0) {
                    this._timeclearnum.string = `${parseInt(this._remaintime)}`
                }
            }
            this.timersprite.fillRange += this._timecount
        }

        if (this._lastChatTime > 0) {
            this._lastChatTime -= dt;
            if (this._lastChatTime < 0) {
                this._chatBubble.active = false;
                // this._emoji.active = false;
                // this._emoji.getComponent(cc.Animation).stop();
            }
        }
        if (this._lastEmojiTime > 0) {
            this._lastEmojiTime -= dt;

            if (this._lastEmojiTime < 0) {

                this.emoji.active = false;

                // this._emoji.active = false;
                // this._emoji.getComponent(cc.Animation).stop();
            }
        }
        if (this._flashable) {
            this._flashgap += dt;
            if (this._flashgap > 0.5) {
                this._flashgap = 0;
                this.flashtip.active = !this.flashtip.active
            }
        }

    }
});