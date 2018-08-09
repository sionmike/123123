var vvCommon = require("vvCommon");
const ORIGINACTION = [0, 0, 0, 1, 0, 1];
cc.Class({
    extends: vvCommon,
    properties: {
        tableinfo: {
            default: null,
            type: cc.Node
        },
        roundinfo: {
            default: null,
            type: cc.Node
        },
        player: {
            default: null,
            type: cc.Prefab
        },
        poker: {
            default: null,
            type: cc.Prefab
        },
        myself: {
            default: null,
            type: cc.Prefab
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        readybtn: {
            default: null,
            type: cc.Node
        },

        playbtn: {
            default: null,
            type: cc.Node
        },


        pkske: {
            default: null,
            type: cc.Prefab
        },
        winnerske: {
            default: null,
            type: cc.Prefab
        },

        betcoin: {
            default: null,
            type: cc.Prefab
        },
        bettable: {
            default: null,
            type: cc.Node
        },
        betatlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        pklayer: {
            default: null,
            type: cc.Prefab
        },
        playerAnchors: {
            default: null,
            type: cc.Node
        },
        plus: {
            default: null,
            type: cc.Prefab
        },

        pluspanel: {
            default: null,
            type: cc.Node
        },
        chat: {
            default: null,
            type: cc.Node
        },
        startgame: {
            default: null,
            type: cc.Node
        },
        // changeroom: {
        //     default: null,
        //     type: cc.Node
        // },
        overbtn: {
            default: null,
            type: cc.Node
        },
        tipmsg: {
            default: null,
            type: cc.Node
        },
        scrollmsg: {
            default: null,
            type: cc.Prefab
        },

    },

    // use this for initialization
    onLoad: function () {
        if (this.timer) {
            this.timer.active = false;
        }
        if (this.catchbtn) {
            this.catchbtn.active = false;
        }
        /* if(this.playbtn){
             this.playbtn.active = false ;
         }*/


        if (this.cardtipmsg) {
            this.cardtipmsg.active = false;
        }
        this.ORIGINACTION = ORIGINACTION
        this.playerspool = new cc.NodePool();
        this.myselfpool = new cc.NodePool();
        this.pokerpool = new cc.NodePool(); //背面
        this.minpokerpool = new cc.NodePool(); //背面
        this.betCoinPanel = null;
        this.tempLocalZOrder = [];
        this.msgactive = true;
        this.msgList = new Array();
        this.playerAnchors.setLocalZOrder(cc.vv.global.locZorder.PLAYER)
        this.pluspanel.setLocalZOrder(cc.vv.global.locZorder.PLUSPANNEL)
        this.overbtn.setLocalZOrder(cc.vv.global.locZorder.ROOMBTN)
        this.tipmsg.setLocalZOrder(cc.vv.global.locZorder.SCROLLMSG)
        this.playbtn.setLocalZOrder(cc.vv.global.locZorder.PLAYBTN)
        this.selectedcards = new Array(); //存放当前玩家 选中 的牌
        this.cardslist = new Array(); //存放当前玩家 的牌
        this.gameAction = Array.prototype.slice.call(ORIGINACTION, 0)
        this._round = this.roundinfo.getChildByName('round').getComponent(cc.Label)
        this._roomRound = this.roundinfo.getChildByName('roomround').getComponent(cc.Label)
        this._currentcount = this.roundinfo.getChildByName('count').getComponent(cc.Label)
        for (i = 0; i < 8; i++) {
            this.playerspool.put(cc.instantiate(this.player)); // 创建节点
        }
        this.myselfpool.put(cc.instantiate(this.myself)); //本人
        this.refreshBtn();
        cc.vv.audio.playBGM('zjh_bgm.mp3');
    },

    initView(iswan) {

    },
    refreshview(type) {

    },
    gameover() {
        this.setBtnAble(false)
        this.overbtn.active = true
    },
    refreshBtn(config) {
        let action
        if (config == undefined) {
            action = this.gameAction = Array.prototype.slice.call(ORIGINACTION, 0)
        }

        if (typeof (config) == "string") {
            action = this.gameAction;
            let arr = config.split("-");
            let dex = arr[0] - 1;
            action[dex] = arr[1];
        }
        if (config instanceof Array) {
            action = this.gameAction;
            config.forEach((el) => {
                let arr = el.split("-");
                let dex = arr[0] - 1;
                action[dex] = arr[1];
            })
        }
        //自己刷新
        if (config === true) {
            action = this.gameAction;
            action[1] = 1
            action[2] = 1
            action[4] = 1
        }
        //恢复0位
        if (config === false) {
            action = this.gameAction;
            action[1] = 0
            action[2] = 0
            action[4] = 0
        }
        this.destoryAbleCoin();
        this.playbtn.children.forEach((btn, index) => {
            btn.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame(`${index+1}-${action[index]}`)
            if (index > 0 && action[index] == 0) {
                btn.getComponent(cc.Button).interactable = false
            }
            if (action[index] == 1) {
                btn.getComponent(cc.Button).interactable = true
            }
        })
    },
    //房间信息
    initRoom(room) {
        this.tableinfo.getChildByName('room_id').getComponent(cc.Label).string = '房号:' + room.number;
        let wanfa;
        switch (room.way) {
            case 'open':
                wanfa = "明牌抢庄";
                break;
            case 'free':
                wanfa = "自由抢庄";
                break;
            case 'an':
                wanfa = "通比牛牛";
                break;
        }
        // this.tableinfo.getChildByName('room_type').getComponent(cc.Label).string = '游戏模式:' + wanfa;
        this.tableinfo.getChildByName('room_score').getComponent(cc.Label).string = '底分:' + room.mul;
    },
    setBtnAble(bool) {
        if (bool == false) {
            this.refreshBtn()
        }
        
        this.playbtn.active = bool
    },

    showScollMsg(msg) {
        if (this.tipmsg) {
            this.msgList.push(msg)
            var self = this
            let callback = () => {
                if (self.msgList.length > 0) {
                    self.msgactive = 0
                    let msg = self.msgList.pop()
                    let iterm = cc.instantiate(self.scrollmsg)
                    self.tipmsg.addChild(iterm)
                    let script = iterm.getComponent(cc.Component)
                    script.setMsg(msg, callback, self)
                }
            }
            if (this.msgactive) {
                if (this.msgList.length > 0) {
                    this.msgactive = 0
                    let msg = this.msgList.pop()
                    let iterm = cc.instantiate(this.scrollmsg)
                    this.tipmsg.addChild(iterm)
                    let script = iterm.getComponent(cc.Component)
                    script.setMsg(msg, callback, this)
                }
            }
        }
    },
    setRoomChangeAble(bool) {
        if(this.changeroom){
            this.changeroom.active = bool
            this.changeroom.getComponent(cc.Button).interactable = true
        }
    },

    findbtn(name) {
        return this.playbtn.getChildByName(name).getComponent(cc.Button);
    },
    //看牌
    lookcard() {
        var render = this.playermysql.getComponent("PlayerRender");
        render.lookcard();
        this.findbtn('see').interactable = false;
    },

    //pk pklayer
    pkstart(bool, winner, loser) {
        this.pklayer
        if (this.pklayer) {
            if (bool) {
                let layer = this.playerAnchors.getChildByName("layer")
                if (layer == null) {
                    var item = cc.instantiate(this.pklayer);
                    this.playerAnchors.addChild(item);
                    item.setLocalZOrder(cc.vv.global.locZorder.PKLAYER)
                    this.playerAnchors.children.forEach(element => {
                        if (element == winner || element == loser) {
                            element.setLocalZOrder(cc.vv.global.locZorder.PKPLAYER)
                        } else {
                            element.setLocalZOrder(cc.vv.global.locZorder.VISITORPLAYER)
                        }
                    });
                }
            } else {
                let layer = this.playerAnchors.getChildByName("layer")
                if (layer != null) {
                    layer.destroy()
                }
            }
        }
    },
    //比牌结果展示
    pkshow(callback) {
        var callback = callback || function () {}
        var item = cc.instantiate(this.pkske);
        this.root().addChild(item);
        item.setLocalZOrder(cc.vv.global.locZorder.PKANIMATE)
        item.getComponent(cc.Component).setCompleteListener(() => {
            item.destroy()
            this.pkstart(false)
            this.playerAnchors.children.forEach((element, index) => {
                element.setLocalZOrder(0)
            });
            callback()
        })

        return item
    },

    winnershow(callback, num) {
        var layer = cc.instantiate(this.pklayer);
        this.root().addChild(layer);
        layer.setLocalZOrder(cc.vv.global.locZorder.PKLAYER)
        var callback = callback || function () {}
        var item = cc.instantiate(this.winnerske);
        this.root().addChild(item);
        item.setLocalZOrder(cc.vv.global.locZorder.PKANIMATE)
        item.getChildByName("lbl").getComponent(cc.Label).string = `+${num}`;
        this.scheduleOnce(() => {
            item.destroy()
            layer.destroy()
            callback()
        }, 3)

        return item
    },



    startBtnActive(bool) {
        this.readybtn.active = false
        this.startgame.active = bool
    },

    /**
     *
     * @param game
     * @param times
     * @param automic 不允许 不出
     */
    initAbleCoin(list) {
        this.betCoinPanel = cc.instantiate(this.plus);
        list.forEach((el) => {
            var item = cc.instantiate(this.betcoin);
            item.height = 70;
            item.width = 70;
            item.order = el.order
            item.getChildByName("lbl").getComponent(cc.Label).string = el.name;
            let btn = cc.vv.utils.addClickEvent(item, this.node, "ShanzhangDataBind", "onCoinClick");
            if (el.is_click == 0) {
                btn.interactable = false
            }
            this.betCoinPanel.addChild(item)
        })
        this.pluspanel.addChild(this.betCoinPanel)
    },
    onCoinClick(ev) {
        this.destoryAbleCoin();
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userBet"
        }, {
            money: ev.target.order
        })
    },
    onChatClick() {
        this.chat.active = true
    },
    destoryAbleCoin() {
        if (this.betCoinPanel != null) {
            this.betCoinPanel.destroy()
            this.betCoinPanel = null
        }
    },
    clean() {
        this.setBetCount("")
    },
    restart() {
        for (i = 0; i < 2; i++) {
            this.playerspool.put(cc.instantiate(this.player)); // 创建节点
        }

        /**
         * 费劲巴拉的收集起来，然后又给销毁了，浪费资源！！！
         */
        this.pokerpool.clear();
        this.minpokerpool.clear();

        for (var inx = 0; inx < 25; inx++) {
            this.pokerpool.put(cc.instantiate(this.poker)); //牌-背面
        }
        for (var inx = 0; inx < 60; inx++) {
            this.minpokerpool.put(cc.instantiate(this.poker_min)); //牌-背面
        }
    },

    //获取位置
    getFatherPosition(index) {
        var po = this.playermysql.getPosition();
        if (index == 0) {
            po.y = 0;
            po.x = 0;
        }
        if (index <= 2 && index > 0) {
            po.x += 130;
            po.y -= 45;
        }
        if (index > 2) {
            po.x -= 130;

        }
        return po;
    },

    //随机产生码落地位置
    creatPlayerBetPoint() {
        var x, y;
        x = Math.random() * (380) - 190;
        y = Math.random() * (180);
        return cc.p(x, y);
    },

    /**
     * void 改变回合 轮数
     * @param {int} num 
     */
    setRound(curound, maxround) {
        this._round.string = "第" + `${curound}` + "/" + `${maxround}` + "轮";
    },
    setBetCount(count) {
        this._currentcount.string = count + "";
    },
    addBetCount(value) {
        let num = Number(this._currentcount.string)
        this._currentcount.string = (num + Number(value)) + "";
    },

    setRoomRound(curound, maxround) {
        this._roomRound.node.active = true
        this._roomRound.string = `当前局数：${curound}/${maxround}`
    },
    update(dt) {

    }
});