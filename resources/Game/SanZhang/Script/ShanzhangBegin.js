var Room = require("ShanzhangRoom");
cc.Class({
    extends: Room,

    properties: {
        gamebtn: {
            default: null,
            type: cc.Node
        },

        //結束的界面
        summary: {
            default: null,
            type: cc.Prefab
        },
        databind: {
            default: null,
            type: cc.Node
        },
        emojiAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        cardinfoAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        losercardinfoAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

    },

    // use this for initialization
    onLoad: function () {
        /**
         * 适配屏幕尺寸
         */
        this.betCoinList = new Array();
        this.pokercards = new Array();
        this.lastcards = new Array();
        this.playerAnchorsPosition = new Array();
        this.chipColour = new Array();
        this.summarypage = null;
        this.inited = false;
        this.lasttip = null;
        this.node.addComponent("ShanzhangRoom")
        if (cc.vv != null && cc.vv.gamestatus != null && cc.vv.gamestatus == "playing") {
            //恢复数据
            this.recovery();
        }
        this.game = this.databind.getComponent("ShanzhangDataBind");

        this.gameStart();
        this.initgame()
    },

    initgame() {
        cc.vv.kk = this
        cc.vv.gameNotify.on('GAMING', this.wait_player, this)
        cc.vv.gameNotify.on('CLEAN', this.clean, this) //加入游戏房间初始化
        cc.vv.Notifycation.on('recharge', this.usercharge, this)
        cc.vv.socket.on('GAME_READY', this.game_ready, this) //加入游戏房间初始化
        cc.vv.socket.on('PLAYER_CHANGEROOM', this.change_room, this) //加入游戏房间初始化
        cc.vv.socket.on('GAME_CARD', this.card_push, this) //开始发牌
        cc.vv.socket.on('GAME_LUCKING', this.show_msg, this) //幸运召唤师降临
        cc.vv.socket.on('GAME_RESULT', this.card_result, this) //游戏结束
        cc.vv.socket.on('PLAYER_OUT', this.player_out, this) //玩家退出
        cc.vv.socket.on('PLAYER_BET_MONEY', this.bet_money, this) //获取能加多少钱
        cc.vv.socket.on('PLAYER_BET', this.player_bet, this) //加注
        cc.vv.socket.on('PLAYER_IN', this.player_in, this) //有玩家进入
        cc.vv.socket.on('PLAYER_CHANGEROOM', this.wait_, this) //换房
        cc.vv.socket.on('PLAYER_COMPARE_DATA', this.player_chosecompare, this) //比牌人选
        cc.vv.socket.on('PLAYER_COMPARE', this.player_compare, this) //比牌
        cc.vv.socket.on('PLAYER_WATCH', this.player_watch, this) //看牌
        cc.vv.socket.on('PLAYER_FOLLOWING', this.follow_all, this) //无限跟
        cc.vv.socket.on('PLAYER_FOLLOW', this.player_follow, this) //跟注
        cc.vv.socket.on('PLAYER_EXIT', this.player_exit, this) //退出
        cc.vv.socket.on('PLAYER_DISCARD', this.player_discard, this) //弃牌
        cc.vv.socket.on('GAME_ACTIVE', this.active_start, this) //激活
        cc.vv.socket.on('GAME_OVER', this.game_over, this) //结束
        cc.vv.socket.on('PLAYER_READY', this.player_ready, this) //有玩家准备
        cc.vv.socket.on('PLAYER_TALK', this.player_talk, this) //有玩家说话
        cc.vv.socket.on('GAME_SHOW', this.game_show, this)
    },

    wait_player(msg) {
        let data = msg.detail.data;
        this.game.initRoom(this.setRoomInfo(data.room_data))
        this.setGameInfo(data.game_data)
        this.game.setRound(this.getCurrentTurnRound(), this.getMaxTurnRound())

        if (!this.RoomisWan()) {
            this.game.setRoomRound(this.getCurrentRound(), this.getMaxRound())
        }
        if (data.game_data.total_money) {
            this.game.setBetCount(data.game_data.total_money)
        }
        this.chipColour = data.game_data.chip_colour
        this.initMyseat(data.user_data);
        this.initCoin(data.game_data.clips)
        this.initSeates(data.play_list);
        let userdata = data.user_data;
        if (data.game_data.game_status >= 2) {
            this.node.emit("user_ready", false)
            if (userdata.is_discard == 1) this.setRoomChangeAble(true)
            this.game.refreshBtn([`1-${userdata.is_follow}`, `4-${Number(userdata.is_show)?"0":"1"}`, `6-${Number(userdata.is_discard)?"0":"1"}`])
            this.game.refreshBtn(`5-${userdata.is_discard== 0&&this.getCurrentTurnRound()>=3?1:0}`)
            this.recoveryCard(data)
            if (userdata.is_active == 1) this.game.refreshBtn(true)
            if (userdata.user_status == 6) {
                this.game.setBtnAble(false)
                this.setRoomChangeAble(true)
            }

        } else if (data.game_data.game_status < 2) {
            this.game.setBtnAble(false)
            if (userdata.user_status == 8) this.node.emit("user_ready", false)
            if (this.RoomisWan()) {
                this.setRoomChangeAble(true)
            }
            if (userdata.ready) this.node.emit("user_ready", true)
        }

        if (data.game_data.game_status == 0 && !this.RoomisWan()) {
            if (cc.vv.user.id == this.getRoomOwn()) {
                this.game.startBtnActive(true)
                this.setRoomChangeAble(false)
            } else {
                this.setRoomChangeAble(false)
            }
            let readyPlayer = this.getPlayerList().find((player) => {
                return player.getStatus() == 8
            });
            if (readyPlayer != null) this.game.startgame.getComponent(cc.Button).interactable = true;
        }
        // this.game.setBtnAble(false)
        // this.initSeates(data.play_list)
    },
    show_msg(msg) {
        let data = msg.detail.data;
        this.game.showScollMsg(data.talk)
    },
    change_room(msg) {
        let data = msg.detail;

        if (data.code == 1) {
            this.layered(msg.detail.info)
            this.setRoomChangeAble(true)
        }
        if (data.code == 0) {
            this.clean()
            this.wait_player(msg)
        }
    },
    player_chosecompare(msg) {
        let data = msg.detail.data;
        let compareData = data.compareData;
        compareData.forEach((id) => {
            let player = this.getPlayer(id)
            if (player && player != this.getMyself()) player.setActive(true)
        })
        this.game.refreshBtn("5-0")

    },

    player_discard(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.current.id)
        if (player) {
            player.stopcatchtimer()
            player.paomove("弃牌")
            player.showtips(2)
        }
        if (data.current.id == cc.vv.user.id) {
            this.game.setBtnAble(false)
            console.log(222222222222)
            this.getPlayerList().forEach(element => {
                element.setActive(false)
            });
            if (this.RoomisWan()) this.setRoomChangeAble(true)
        }

        if (data.next instanceof Array) {
            this.game.setBtnAble(false)
            return
        }

        if (data.is_change) {
            this.next(data.next)
        }

    },
    //跟注
    player_follow(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.current.id)
        this.game.addBetCount(data.current.clips)
        player.paomove("跟注")
        // player.addMoney(-data.current.clips)
        this.bet(player, data.current.clips)
        this.getPlayerList().forEach(element => {
            element.setActive(false)
        });
        if (data.next instanceof Array) {
            return
        }
        this.next(data.next)
    },

    //加注
    player_bet(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.current.id)
        player.paomove("加注")
        // player.addMoney(-data.current.clips)
        this.game.addBetCount(data.current.clips)
        this.bet(player, data.current.clips)
        this.getPlayerList().forEach(element => {
            element.setActive(false)
        });
        if (data.next instanceof Array) {
            return
        }
        this.next(data.next)
    },
    player_talk(msg) {
        let data = msg.detail.data;
        let info = data.talk
        if (msg.detail.code == 1) {
            this.layered(msg.detail.info)
        }

        if (msg.detail.code == 0) {
            let player = this.getPlayer(data.uid)
            if (player == null) return

            if (info < 10) {
                let sprite = this.emojiAtlas.getSpriteFrame(info)
                player.setemoji(sprite)
            } else {
                player.chatBubble(cc.vv.global.zjhChatMsg[info - 10])
            }
        }

    },
    //比牌
    player_compare(msg) {
        let data = msg.detail.data;
        let loser = this.getPlayer(data.loser.id);
        let winner = this.getPlayer(data.winner.id);
        let org_loser_vec = loser.node.parent.position
        let org_winner_vec = winner.node.parent.position
        let vec2 = [new cc.Vec2(374, 0), new cc.Vec2(-374, 0)]
        let curplayer = this.getPlayer(data.current.id)
        cc.vv.audio.playSFX(`zjh/PK/${curplayer.getGenderH()}_PK_03.wav`)
        this.bet(curplayer, data.current.clips)
        curplayer.addMoney(-data.current.clips)
        this.game.addBetCount(data.current.clips)
        vec2.sort(() => {
            return 0.5 - Math.random()
        })
        let list = this.getPlayerList()
        list.forEach((player) => {
            player.stopcatchtimer();
            player.setActive(false)
        })
        loser.pk(true)
        winner.pk(true)
        this.game.pkstart(true, winner.node.parent, loser.node.parent)
        loser.node.parent.runAction(new cc.Sequence(
            cc.moveTo(1, vec2[0]),
            cc.callFunc(() => {
                this.game.pkshow(
                    () => {
                        loser.node.parent.runAction(new cc.Sequence(cc.moveTo(0.5, org_loser_vec), cc.callFunc(() => {
                            loser.pk(false)
                            winner.pk(false)
                            if (loser == this.getMyself()) {
                                this.setRoomChangeAble(true)
                            }
                            if (winner == this.getMyself()) {
                                this.game.playbtn.active = true
                            }
                            this.node.emit("radio", "vsknock")
                            if (!(data.next instanceof Array)) {
                                this.next(data.next)
                            }
                        })))
                        winner.node.parent.runAction(cc.moveTo(0.5, org_winner_vec))
                    }
                )
                this.node.emit("radio", "vsbegin")
                this.scheduleOnce(() => {
                    if (loser == this.getMyself()) {
                        loser.myselfLoseCompare();
                    } else {
                        loser.compareLose()
                    }
                }, 1)
            })
        ));

        winner.node.parent.runAction(
            cc.moveTo(1, vec2[1]),
        );

        if (data.loser.id == cc.vv.user.id) {
            this.game.setBtnAble(false)
        }
        if (data.winner.id == cc.vv.user.id) {
            this.game.playbtn.active = false
        }

        if (data.next instanceof Array) {
            this.game.setBtnAble(false)
            return
        }

        //比牌动画
    },
    game_show(msg) {
        let data = msg.detail.data.cards;
        let len = 0
        for (var id in data) {
            len += 1
        }
        let im_Win = len >= 2 ? false : true
        for (var id in data) {
            let player = this.getPlayer(id)
            if (player != null) {
                if (cc.vv.user.id == id) {
                    if (player.getIsShow() == 1) {
                        continue
                    } else {
                        if (im_Win == false) player.loserShowCard(data[id].card, data[id].card_type)
                        if (im_Win == true) player.showCard(data[id].card, data[id].card_type)
                    }
                } else {
                    if (im_Win == false) player.showCard(data[id].card, data[id].card_type)
                    if (im_Win == true) player.loserShowCard(data[id].card, data[id].card_type)
                }
            }
        }
    },

    //结算
    card_result(msg) {
        let data = msg.detail.data.settle;
        let winner = [];
        //清理倒计时
        let list = this.getPlayerList()
        list.forEach((player) => {
            player.stopcatchtimer();
        })
        //设置钱  赢家显示
        for (var id in data) {
            let player = this.getPlayer(id)
            if (player == null) continue
            player.setMoney(data[id].new_bean)
            player.score(data[id].win_result)
            if (data[id].win_result > 0) {
                winner.push(id)
                player.showCard(data[id].win_card.result_data.card, player, data[id].win_card.result_data.card_type)
                // this.getPlayer(id).showCard(data[id].win_card.result_data.card)
                if (id == cc.vv.user.id) {
                    this.game.winnershow(null, data[id].win_result)
                    this.node.emit("radio", "win")
                }
            } else {
                // setLoserCardInfo
            }
        }
        //回收
        this.userGetCoin(winner)
        this.game.refreshBtn()
        //显示输赢
        for (var id in data) {

        }
    },
    game_over(msg) {
        let data = msg.detail.data;
        this.resultPannel = cc.instantiate(this.summary)
        this.resultPannel.setLocalZOrder(cc.vv.global.locZorder.GAMEEND)
        let history = this.resultPannel.getComponent(cc.Component);
        history.historyRenderer(data, this.getRoomOwn());
        this.game.gameover()
    },
    active_start() {
        this.game.startgame.getComponent(cc.Button).interactable = true
    },
    bet_money(msg) {
        let data = msg.detail.data;
        this.game.initAbleCoin(data.clipsData);
    },
    game_ready(msg) {
        // data.card_uid
        let data = msg.detail.data;
        if (!this.RoomisWan()) {
            this.setCurrentRound(data.round)
            this.game.setRoomRound(this.getCurrentRound(), this.getMaxRound())
        }
        this.node.emit("user_ready", true)
        this.getPlayerList().forEach((player) => {
            player.clean()
        })
        this.game.setBtnAble(false)
        this.setRoomChangeAble(true)

        this.game.setBetCount("")
        this.game.setRound(this.setCurrentTurnRound(0), this.getMaxTurnRound())
    },
    follow_all(msg) {
        let data = msg.detail.data;
        // this.game.
        if (data.id == cc.vv.user.id) {
            if (this.getMyself().isTrun() == 1) {
                if (data.is_follow == 1) {
                    this.game.refreshBtn([`1-${data.is_follow}`, `2-${Number(data.is_follow)?"0":"1"}`, `3-${Number(data.is_follow)?"0":"1"}`])
                }
                if (data.is_follow == 0) {
                    this.game.refreshBtn([`1-${data.is_follow}`, `2-${Number(data.is_follow)?"0":"1"}`, `3-${Number(data.is_follow)?"0":"1"}`, `5-${this.getCurrentTurnRound()>3?"0":"1"}`])
                }
            } else {
                this.game.refreshBtn(`1-${data.is_follow}`)
            }
        } else {

        }

        let player = this.getPlayer(data.id)
        if (player) player.followAll(data.is_follow)
    },
    player_watch(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.id)
        player.showtips(1)
        //自己看
        if (data.id == cc.vv.user.id) {
            this.game.refreshBtn(`4-0`)
            player.showCard(data.cardData.card, data.cardData.card_type)
        }

    },

    card_push(msg) {
        let data = msg.detail.data;
        let next = data.next;
        let isvisitor = false
        this.node.emit("user_ready", false)
        this.node.emit("radio", "start")
        data.card_uid.forEach((id) => {
            let player = this.getPlayer(id);
            if (player) player.setStatus(6)
            if (id == cc.vv.user.id) {
                this.game.setBtnAble(false);
                this.setRoomChangeAble(true)
                isvisitor = true
            }
        })
        if (isvisitor == false) {
            this.game.setBtnAble(true)
        }
        this.deliverCard(data.game_score);
        if (next.id == cc.vv.user.id) {
            this.game.refreshBtn(true);
        }


        this.game.setBetCount(data.game_money)
        this.next(next);
    },

    next(next) {
        let iscompare = next.is_compare;
        let gameround = next.game_round;
        let time = next.user_time;
        let id = next.id;
        let istip = next.is_tips;
        let iswatch = next.is_watch;
        let player = this.getPlayer(id)
        if (id == cc.vv.user.id) {
            if (this.getMyself().isFollowing() == 1) {
                this.game.refreshBtn(false)
            } else {
                this.game.refreshBtn(true)
                this.game.refreshBtn(`5-${iscompare?1:0}`)
            }
            if (istip) {
                this.makesure({
                    message: '星豆即将不足，请充值',
                    ok: () => {
                        this.showrechangbean()
                    }
                })
            }
            if (iswatch) {
                this.game.refreshBtn(`4-${iswatch?1:0}`)
            }
        } else {
            this.game.refreshBtn(false)
        }
        if (player) {
            this.getPlayerList().forEach((player) => {
                player.stopcatchtimer()
            })
            player.catchtimer(time)
        }
        if (gameround != null) {
            this.game.setRound(this.setCurrentTurnRound(gameround), this.getMaxTurnRound())
        }

    },
    //玩家退出，自己收到指令退出场景，别人玩家的话，清空数据

    player_exit(msg) {
        let data = msg.detail.data;
        if (msg.detail.code == 1) {
            this.alertmsg('游戏进行中不能退出房间')
            return
        }
        //如果是自己，就退出了
        if (data.id == cc.vv.user.id) {
            this.scene('hall', this)
        }

        let player = this.getPlayer(data.id)
        if (player) {
            player.clean()
            this.removeFromPlayerList(player)
            this.game.playerspool.put(player.node)
        }
    },

    player_in(msg) {
        let data = msg.detail.data
        let player = this.getPlayer(data.id)
        if (this.isInRoom(data.id) == false) {
            this.initSingleSeat(data)
        } else {
            player = this.getPlayer(data.id)
            if (player != null) {
                player.setStatus(data.user_status)
                return
            }
        }
    },

    player_ready(msg) {
        let data = msg.detail.data;
        if (data.id instanceof Array) {
            data.id.forEach((id) => {
                let player = this.getPlayer(id);
                if (id == cc.vv.user.id) {
                    this.node.emit("user_ready", false);
                    this.game.startgame.active = false
                }
                if (player) {
                    player.setStatus(8)
                }
            })
        } else {
            let player = this.getPlayer(data.id)
            if (data.id == cc.vv.user.id) {
                this.game.startgame.active = false
                this.node.emit("user_ready", false)
            }
            if (player) {
                player.setStatus(8)

            }
        }
    },

    //玩家离线
    player_out(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.id)
        if (player) {
            player.setStatus(0);
        }
    },


    gameStart() {
        this.node.on("init_myself", this.initMyself, this);
        this.node.on("init_player", this.newplayer, this);
        this.node.on("user_ready", this.refreshbtn, this);
        this.node.on("getuserbetcoin", this.addbtnclick, this);
        this.node.on("destoryAbleCoin", this.destroyPanel, this);
        this.node.on("disablechangebtn", this.roomchangeloading, this);
        this.node.on("radio", this.radioPlay, this);
    },

    destroyPanel() {
        this.game.destoryAbleCoin()
    },
    roomchangeloading() {
        console.log(555)
        this.game.changeroom.getComponent(cc.Button).interactable = false
    },
    refreshbtn(data) {
        let boolean = data.detail;
        this.game.readybtn.active = boolean;
        if (this.RoomisWan()) {
            if (!boolean) this.setRoomChangeAble(false)
        }
    },
    addbtnclick() {
        if (this.game.betCoinPanel == null) {
            cc.vv.socket.send({
                controller_name: "YhtZjhWsService",
                method_name: "getUserBetMoney"
            })
        } else {
            this.game.destoryAbleCoin()
        }
    },
    newplayer(data) {
        var data = data.detail;
        var player;
        var pos = cc.v2(0, 0);
        console.log("player")
        if (this.game.playerspool.size() > 0) {
            let inx = this.getMyPositionIndex();
            player = this.game.playerspool.get()
            let index = inx - data.position
            let seat = index > 0 ? index : index + 8
            player.parent = this.game.playerAnchors.children[seat];
            player.setPosition(pos);
            let my = this.getMyself()
            var render = player.getComponent("PlayerRender");
            render.initplayer(data, seat);
            if (my != null) my.node.parent.setPosition(cc.vv.global.zjhPlayerVec2[0].player)
            this.addPlayerList(render)
            if (data[data.id]) {
                if (data[data.id].total_money) {
                    render.setBetCoin(data[data.id].total_money)
                }
            }
            return render
        }
    },

    initMyself(data) {
        var data = data.detail
        var pos = cc.v2(0, 0);

        console.log("myself")
        if (this.game.myselfpool.size() > 0) {
            let player = this.game.playerspool.get()
            player.parent = this.game.playerAnchors.children[0];
            player.setPosition(pos);
            var render = player.getComponent("PlayerRender");
            render.initplayer(data, 0);
            this.getPlayerList().push(render);
            this.setMyself(render)
            if (data[data.id]) {
                if (data[data.id].total_money) {
                    render.setBetCoin(data[data.id].total_money)
                }
            }
            return render
        }
    },



    clean() {
        let playerlist = this.getPlayerList()
        for (var i = 0; i < playerlist.length; i++) {
            playerlist[i].clean();
            this.game.playerspool.put(playerlist[i].node)
        }
        this.betCoinList.forEach((coin) => {
            coin.destroy()
        })
        this.betCoinList = []
        this.removeAllPlayer()
        this.game.clean(this);
    },


    userGetCoin(userid) {
        let player;
        var vec;
        let canvas;
        let action;
        this.node.emit("radio", "getcoin")
        if (userid instanceof Array) {
            canvas = cc.find("Canvas")
            let space = Math.floor(this.betCoinList.length / userid.length)
            var result = [];
            for (var i = 0, len = this.betCoinList.length; i < len; i += space) {
                result.push(this.betCoinList.slice(i, i + space));
            }

            if (result.length == 0) return
            userid.forEach((id, index) => {
                player = this.getPlayer(id);
                vec = cc.vv.global.getPositon(canvas, player.node)
                result[index].forEach((coin) => {
                    action = cc.sequence(cc.scaleTo(0.5, 1.5, 1.5), cc.moveTo(0.5, vec.x, vec.y), cc.callFunc(() => {
                        coin.destroy()
                    }))
                    coin.runAction(action)
                })
            })
        }
        this.betCoinList = new Array();
    },

    setRoomChangeAble(bool) {
        if (this.RoomisWan() == true) {
            if (this.game.changeroom) {
                this.game.changeroom.active = bool
                this.game.changeroom.getComponent(cc.Button).interactable = true
            }
        }
    },

    deliverCard(gamescore) {
        let actvePlayerList = this.getActvePlayerList()
        let num = 3;
        let time = 0.04;
        let pokerComponent;
        var fapai = (index) => {
            if (index >= actvePlayerList.length) {
                return
            };
            this.node.emit("radio", "card")
            var player = actvePlayerList[index]
            player.setStatus(1)
            this.bet(player, gamescore)
            var hold = player.getHoldNode()
            let vec = cc.vv.global.getPositon(hold, this.node)
            for (let i = 0; i < num; i++) {
                let poker = cc.instantiate(this.game.poker)
                hold.addChild(poker);
                poker.setScale(0.7, 0.7);
                pokerComponent = poker.getComponent(cc.Component)
                poker.setPosition(vec);
                player.addHandCard(pokerComponent);
                poker.runAction(new cc.Sequence(
                    cc.moveTo(time * (i + 1), 25 * i, 0),
                    cc.callFunc(() => {
                        if (i == num - 1) fapai(index + 1);
                    })
                ));
            };
        }
        fapai(0)
    },

    recoveryCard(data) {
        let actvePlayerList = this.getActvePlayerList()
        let num = 3;
        let pokerComponent;
        var fapai = (index) => {
            if (index >= actvePlayerList.length) {
                return
            };
            var player = actvePlayerList[index]
            player.setStatus(1)
            var hold = player.getHoldNode()
            for (let i = 0; i < num; i++) {
                let poker = cc.instantiate(this.game.poker)
                hold.addChild(poker);
                poker.setScale(0.7, 0.7);
                pokerComponent = poker.getComponent(cc.Component)
                poker.setPosition(20 * i, 0);
                player.addHandCard(pokerComponent);
                if (i == num - 1) fapai(index + 1);
            };
        }
        fapai(0)
        let playerlist = data.play_list
        let userdata = data.user_data
        let myself = this.getMyself()
        if (userdata[userdata.id].hand_card) {
            myself.showCard(userdata[userdata.id].hand_card, userdata[userdata.id].hand_card.card_type)
            // myself.showtips(1)
        }
        if (userdata.is_discard == 1) {
            this.game.setBtnAble(false)
            myself.showtips(2)
        }
        playerlist.forEach((el) => {
            let player = this.getPlayer(el.id)
            if (el[el.id].hand_card) {
                player.showCard(el[el.id].hand_card, el[el.id].hand_card.card_type)
                // player.showtips(1)

            }
            if (el.is_discard == 1) {
                player.showtips(2)
            }
        })
    },

    //下注筹码
    bet(player, num) {
        let Max = 6
        let Min = 1
        // let type = Min + Math.floor(Math.random() * (Max - Min));
        let type = this.getCoinType(num)
        let roa = Math.random() * 720 - 360
        this.node.emit("radio", "betcoin")
        if (player == null) return
        let canvas = cc.find("Canvas");

        let item = cc.instantiate(this.game.betcoin);
        item.getComponent(cc.Sprite).spriteFrame = this.game.atlas.getSpriteFrame(`coin-${type}`);
        item.getChildByName("lbl").getComponent(cc.Label).string = num
        canvas.addChild(item);
        item.setLocalZOrder(cc.vv.global.locZorder.CION)
        this.betCoinList.push(item);
        let vec = cc.vv.global.getPositon(canvas, player.node)
        item.setPosition(vec);
        player.addMoney(-num)
        player.addBetCoin(num);
        let x, y;
        x = Math.random() * 100 - 50;
        y = Math.random() * 100 - 50;
        item.setScale(1, 1)
        item.runAction(new cc.spawn(
            cc.moveTo(0.5, x, y),
            cc.rotateTo(0.65, roa * 2)
        ))
    },

    initCoin(data) {
        for (let num in data) {
            for (let i = 0; i < data[num]; i++) {
                let Max = 6
                let Min = 1
                let type = this.getCoinType(num)
                let canvas = cc.find("Canvas")
                let item = cc.instantiate(this.game.betcoin);
                item.getComponent(cc.Sprite).spriteFrame = this.game.atlas.getSpriteFrame(`coin-${type}`);
                item.getChildByName("lbl").getComponent(cc.Label).string = num
                item.setScale(1, 1)
                canvas.addChild(item);
                this.betCoinList.push(item);
                let x, y;
                x = Math.random() * 100 - 50;
                y = Math.random() * 100 - 50;
                item.setPosition(x, y);
            }
        }
    },

    setPlayerCardInfo(player, result) {
        let info = this.cardinfoAtlas.getSpriteFrame(result)
        player.showcardinfo(result, result)
    },
    onDestroy: function () {
        this.inited = false;
    },
    onViewHistory() {
        if (this.resultPannel != null) {
            this.root().addChild(this.resultPannel)
        }
    },
    radioPlay(data) {
        let res = data.detail
        switch (res) {
            case "card":
                cc.vv.audio.playSFX('zjh/sendcard2.wav')
                break;
            case "lose":
                cc.vv.audio.playSFX('zjh/lose.wav')
                break;
            case "getcoin":
                cc.vv.audio.playSFX('zjh/gotcoins.wav')
                break;
            case "betcoin":
                cc.vv.audio.playSFX('zjh/coin1.wav')
                break;
            case "vsbegin":
                cc.vv.audio.playSFX('zjh/vs_begin.wav')
                break;
            case "vsknock":
                cc.vv.audio.playSFX('zjh/vs_knock.wav')
                break;
            case "win":
                cc.vv.audio.playSFX('zjh/win.wav')
                break;
            case "start":
                cc.vv.audio.playSFX('niuniu/gamestart.wav')
                break;
            default:
                break;
        }
    },
    getCoinType(num) {
        let type
        this.chipColour.forEach((element, index) => {
            if (num == element) type = index
        });
        if (type == null || type >= 6) {
            return type = 6
        }
        if (type < 6) {
            return type = type + 1
        }
    }
});