var Common = require("vvCommon");

//此模块主要注册网络事件，网络控制器
cc.Class({
    extends: Common,

    properties: {
        resultPannel: {
            default: null,
            type: cc.Node,
            tooltip: '房卡结算界面'
        }

    },

    // use this for initialization
    onLoad() {
        this.gamestatus = 0;
        this.initGame();
        this.currentRound = 0;
    },


    //开房游戏
    initGame() {
        var self = this;
        this.game = this.node.getComponent('NiuDataBind')
        cc.vv.gameNotify.on('NIU_GAME', this.wait_player, this)
        cc.vv.gameNotify.on('CLEAN', this.clean, this) //加入游戏房间初始化
        cc.vv.Notifycation.on('recharge', this.usercharge, this)
        cc.vv.socket.on('GAME_READY', this.game_ready, this) //加入游戏房间初始化
        cc.vv.socket.on('GAME_CATCH', this.catch, this) // 开始抢庄
        cc.vv.socket.on('GAME_BET', this.begin_bet, this) //开始下注，内含抢庄结果
        cc.vv.socket.on('GAME_CARD', this.card_push, this) //开始发牌
        cc.vv.socket.on('GAME_RESULT', this.card_result, this) //游戏结束
        cc.vv.socket.on('PLAYER_OUT', this.player_out, this)
        cc.vv.socket.on('PLAYER_IN', this.player_in, this) //有玩家进入
        cc.vv.socket.on('PLAYER_CATCH', this.player_catch, this) //有玩家抢庄
        cc.vv.socket.on('PLAYER_SHOW', this.player_show, this) //有玩家亮牌
        cc.vv.socket.on('PLAYERS_SHOW', this.players_show, this) //所有人亮牌
        cc.vv.socket.on('PLAYER_BET', this.player_bet, this)
        cc.vv.socket.on('PLAYER_CHANGEROOM', this.wait_player, this)
        // cc.vv.socket.on('PLAYER_CALL', this.card_tips.bind(this))
        cc.vv.socket.on('PLAYER_EXIT', this.player_exit, this)
        cc.vv.socket.on('GAME_ACTIVE', this.active_start, this)
        cc.vv.socket.on('GAME_OVER', this.game_over, this)
        cc.vv.socket.on('GAME_STATUS', this.change_status, this)
        cc.vv.socket.on('PLAYER_READY', this.player_ready, this) //有玩家准备
        // cc.vv.socket.on('RETURN', this.return_command, this)



    },

    //房间等待玩家
    wait_player(msg) {

        let data = msg.detail.data;

        cc.vv.user = data.user_data;
        //设置自己信息
        this.onLinePlayer = new Array();
        //设置房间信息
        this.game.setRoomInfo({
            max_round: data.room_data.max_round,
            room_number: data.room_data.room_number,
            way: data.room_data.way,
            multiple: data.room_data.multiple,
            round: data.room_data.round,
            room_owner: data.room_data.room_owner,
            isWan: (data.room_data.room_number + '').indexOf('W') == -1 ? false : true
        });

        let gamestatus = this.gamestatus = Number(data.game_data.game_status);
        // this.temExitPlayer = new Array();

        this.setUserInfo(data.user_data)
        //设置其他玩家信息
        if (data.play_list != null) {
            this.initSeats(data.play_list);
        }



        if (!this.game.roomdata.isWan) {
            this.currentRound = data.room_data.round
        }


        //获取状态

        let handled = Number(data.user_data.handled);
        if (!(gamestatus && handled)) {
            if (gamestatus == 0) {
                if (!this.game.roomdata.isWan && data.room_data.room_owner == cc.vv.user.id) {
                    //如果是房主
                    cc.vv.gameNotify.emit('playstatus', cc.vv.STATUS_ENUM.WAITING);

                    let readyPlayer = this.onLinePlayer.find((player, index, arr) => {
                        return player.getUserStatus() == 8
                    });
                    if (readyPlayer != null) this.game.startbtn.getComponent(cc.Button).interactable = true;
                }
                if (!this.game.roomdata.isWan && (data.room_data.room_owner != cc.vv.user.id)) {
                    //普通玩家准备变坐下
                    cc.vv.gameNotify.emit('playstatus', cc.vv.STATUS_ENUM.ROOMREADY)
                }
            }
            if (gamestatus == 1) {
                //万人场准备
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.READY, 14)
            }

            if (gamestatus == 2) {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.CATCH, 7)
            }
            if (gamestatus == 3) {
                this.game.myselfSeat.isBanker ? this.game.setStatusTmer(cc.vv.STATUS_ENUM.WAITTINGDOUBLE, 5) : this.game.setStatusTmer(cc.vv.STATUS_ENUM.DOUBLE, 5)

            }
            if (gamestatus == 4) {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.SHUFF, 12)
            }

        }
        //操作过
        if (gamestatus && handled) {

            if (gamestatus == 3) {
                this.game.myselfSeat.isBanker ? this.game.setStatusTmer(cc.vv.STATUS_ENUM.WAITTINGDOUBLE, 5) : this.game.setStatusTmer(cc.vv.STATUS_ENUM.DOUBLE, 5)
            } else {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
            }

        }
        if (data.user_data.user_status == 6) {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
        }
    },
    //发牌
    card_push(msg) {
        this.gamestatus = 4;
        if (this.game.roomdata.way == 'open') {
            this.game.startbtn.active = false;
        }
        var data = msg.detail.data;

        this.game.playersSeatList.forEach((player) => {
            if (player.getUserStatus() != 6) {
                player.ready(0);
            }
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
            this.fapai(data.handCard)
        } else {
            this.fapai()
            // this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 15)
        }


        if (this.game.myselfSeat.getUserStatus() != 6) {
            this.game.myselfSeat.setNiutype(data.niuType, data.three)
        }
    },

    //抢庄结果  开始闲家下注
    begin_bet(msg) {
        this.gamestatus = 3;
        let data = msg.detail.data;

        //动画结束的回调
        let callback = () => {
            this.onLinePlayer.forEach((player) => {
                player.hideZhuangCatch()
            });

            if (data.banker_id == cc.vv.user.id) {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.WAITTINGDOUBLE, 6)
            } else {
                if (this.game.myselfSeat.getUserStatus() == 6) {
                    this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
                    return
                }
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.DOUBLE, 5)
            }
            let banker = this.getBanker();
            this.onLinePlayer.forEach((player) => {
                player.setBanker(false)
            });
            if (banker) {
                banker.setBanker(true)
                banker.qiangzhuangDouble(data.mul)
            }
        }

        //隐藏所有抢庄标识



        if (data.id.length > 1) {
            if (data.mul != 0) {
                //多人抢庄
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.BANKERANIMATION, 0);
            } else {
                //无人抢庄  data.mul = 0
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.NOCATCH, 0);
            }
            this.zhuangAnimation(data.banker_id, data.id, callback);
        } else {
            this.getPlayer(data.banker_id).setBanker(true, callback);
        }
    },

    //改变游戏状态
    change_status(msg) {
        let data = msg.detail.data
        if (this.game.myselfSeat.getUserStatus() == 6) return
        if (data.next_status == 1) {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.READY, 14)
        }
        if (data.next_status == 2) {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.CATCH, 7)
        }
        if (data.next_status == 3) {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.DOUBLE, 5)
        }
        if (data.next_status == 4) {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.SHUFF, 12)
        }
    },


    game_ready(msg) {
        let data = msg.detail.data
        var self = this
        this.game.playersSeatList.forEach((player) => {
            player.ready(0);
        })
        this.scheduleOnce(() => {
            this.gamestatus = 1;
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.READY, 12);
            this.onLinePlayer.forEach((player) => {
                if (player.getUserStatus() == 6) {
                    player.setStatus(1)
                }
                player.reset()
            })
            if (!this.game.roomdata.isWan) {

                if (data.round != null) {
                    this.game.changeRound(data.round)
                }
            }
        })

    },
    //开始抢庄
    catch (msg) {
        this.gamestatus = 2;
        this.onLinePlayer.forEach((player) => {
            if (player.getUserStatus() != 6) {
                player.ready(0);
            }
        })

        if (this.game.myselfSeat.getUserStatus() != 6) {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.CATCH, 7)
        } else {
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 7)
        }

    },

    //结果
    card_result(msg) {
        var data = msg.detail.data;
        if (data == null) return
        if (this.game.roomdata.way != 'an') {
            this.mpqzResult(data)
        }
        if (this.game.roomdata.way == 'an') {
            this.tbResult(data)
        }
    },

    game_over(msg) {
        let data = msg.detail.data
        this.resultPannel.setLocalZOrder(3)
        let history = this.resultPannel.getChildByName('niushare').getComponent(cc.Component);
        history.historyRenderer(data, this.game.roomdata.room_owner);
        this.game.stopTimer();
        cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.GAMEOVER);
    },


    //激活开始游戏按钮
    active_start() {
        this.game.startbtn.getComponent(cc.Button).interactable = true;
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
        if (this.game.roomdata.isWan) {
            if (data.id != cc.vv.user.id) {
                let player = this.getPlayer(data.id)
                this.scheduleOnce(function () {
                    if (player) {
                        player.reset(true)
                    }
                    this.removeOnLineList(player);
                }, 0.5)
                //维护在线玩家

            }

        } else {
            //房卡掉线，显示离线不清除
            if (data.id != cc.vv.user.id) {
                let player = this.getPlayer(data.id)
                // this.temExitPlayer.push(this.getPlayer(data.id))
                this.scheduleOnce(function () {
                    if (player) {
                        player.reset(true)
                    }
                }, 1)
                this.removeOnLineList(player);
                // 维护在线玩家
            }
        }

    },

    //有玩家抢庄
    player_catch(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.id)
        if (player) {
            player.qiangzhuang(data.mul);
        }
    },
    //玩家加入
    player_in(msg) {
        let data = msg.detail.data
        this.initSingleSeat(data)
    },
    //玩家准备
    player_ready(msg) {
        let data = msg.detail.data;

        if (data.id instanceof Array) {
            data.id.forEach((id) => {
                if (id == cc.vv.user.id) {
                    this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
                }
                let player = this.getPlayer(id)
                if (player) {
                    player.ready(1)
                }

            })
        } else {
            let player = this.getPlayer(data.id)
            if (data.id == cc.vv.user.id) {
                this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
            }
            if (player) {
                player.ready(1)
            }

        }
    },
    //玩家加注
    player_bet(msg) {
        let data = msg.detail.data;
        if (this.game.roomdata.way == 'an') {
            this.onLinePlayer.forEach((player) => {
                player.ready(0);
            })
        }
        if (data.id instanceof Array) {
            data.id.forEach((id) => {
                let player = this.getPlayer(id)
                if (player) {
                    player.double(data.mul);
                }
            })
            this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED)
        } else {
            let player = this.getPlayer(data.id)
            if (player) player.double(data.mul);
        }
    },
    //玩家离线
    player_out(msg) {
        let data = msg.detail.data;
        let player = this.getPlayer(data.id)
        if (player) {
            player.setOnline(0);
        }

    },

    //重新开局
    restart(msg) {
        let data = msg.detail.data
    },

    //show牛
    player_show(msg) {
        let data = msg.detail.data;
        if (data.id == cc.vv.user.id) {
            this.game.myselfSeat.setNiutype(data.niuType, data.three)
            this.game.myselfSeat.result(data.niuType);
            this.game.myselfSeat.sortHandcard()

        } else {
            let player = this.getPlayer(data.id)
            if (player) {
                player.showCard({
                    handCard: data.handCard,
                    niuType: data.niuType
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
                this.game.myselfSeat.result(data[id].niuType)
                this.game.myselfSeat.setNiutype(data[id].niuType, data[id].three)
                this.game.myselfSeat.sortHandcard()
            } else {
                let player = this.getPlayer(id)
                if (player) {
                    player.showCard({
                        handCard: data[id].handCard,
                        niuType: data[id].niuType
                    })
                }

            }
        }
        this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
    },




    /**
     * 多人抢庄动画
     * 
     * @param {int} userid 
     * @param {Array[int]} list 
     * @param {Fun} callback 
     */
    zhuangAnimation(userid, list, callback) {
        let self = this;
        let count = 0;
        let rand = parseInt(Math.random() * 2 + 3)
        let baseRate = 0.1;
        let lastround = false; //是不是最后一圈
        let randomList = []
        let currentIndex = 0;
        list.forEach((id) => {
            let player = self.getPlayer(id)
            if (player != null) {
                randomList.push(player)
            }
        })


        var round = function () {
            currentIndex = ++count % randomList.length;
            randomList.forEach((player) => {
                player._zhuang.active = false;
            })
            if (lastround && randomList[currentIndex].getUserId() == userid) {

                randomList[currentIndex].setZhuang(callback);
                return
            }
            if ((count / randomList.length) == rand) {
                lastround = true
            }
            this.scheduleOnce(round1, 0)
        }.bind(this)

        var round1 = function () {
            cc.vv.audio.playSFX('niuniu/random_banker.wav')
            randomList[currentIndex]._zhuang.active = true;
            this.scheduleOnce(round, baseRate)
        }.bind(this)
        // this.schedule(round, baseRate)
        this.scheduleOnce(round, baseRate)
    },


    //恢复游戏手牌
    recorveyHandCard(player, handcardlist, ishandle) {

    },

    //请桌
    clean() {
        this.game.clean();
    },

    /**
     * 初始化游戏所有玩家
     * @param {any} seats 
     */
    initSeats(seats) {
        if (seats instanceof Array) {
            for (let i = 0; i < seats.length; i++) {
                this.initSingleSeat(seats[i]);
            }
        }
        if (seats instanceof Object) {
            for (let seat in seats) {
                this.initSingleSeat(seats[seat]);
            }
        }

    },
    /**
     * @param {data} user  玩家信息
     */

    //安排玩家找空位坐下  
    initSingleSeat(seat) {
        for (let i = 1; i < this.game.playersSeatList.length; i++) {
            if (this.game.playersSeatList[i].getUserId() == seat.id) {
                this.game.playersSeatList[i].setOnline(1)
                return
            }
        }
        //找空位
        for (let i = 1; i < this.game.playersSeatList.length; i++) {
            if (!this.game.playersSeatList[i].getUserId()) {
                var player = this.game.playersSeatList[i];
                break;
            }
        }
        player.setInfo({
            id: seat.id,
            name: seat.name,
            money: seat.money,
            gender: seat.gender,
            user_status: seat.user_status,
            handled: seat.handled,
            niuType: seat.niuType,
            three: seat.three,
            handCard: seat.handCard,
            is_banker: seat.is_banker,
            header: seat.header
        });



        if (seat.handCard) {
            if (this.gamestatus == 4 && seat.handled == 1) {
                player.recorveyCard(seat.handCard, true);
                player.result(seat.niuType)
            }
            if (this.gamestatus == 4 && seat.handled == 0) {
                player.recorveyCard(seat.handCard, false)
            }
            if (this.gamestatus < 4) {

                player.recorveyCard(seat.handCard, false)
            }
        }
        this.addOnlineList(player)
        return player
    },


    //换房点击
    onChangeRoomClick() {
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "userChange"
        })
    },


    //坐下按钮
    onsitClick() {
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "userDown"
        })
        cc.vv.audio.playSFX('niuniu/sit.wav')
    },
    //准备
    onReadyClick(event) {
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "userReady"
        })
    },


    //加倍
    onAddBtnClick(event) {
        var mul;
        mul = parseInt(event.target.children[0].getComponent(cc.Label).string)
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "userDouble"
        }, {
            mul: mul
        });
        this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
    },


    //抢不抢
    onQiangBtnClick(event) {
        var mul;
        if (event.target.name == 'buqiang') {
            mul = 0;
        } else if (event.target.name == 'qiang') {
            mul = 2;
        }
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "userHamlet"
        }, {
            mul: mul
        })
        this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
    },


    //搓牌  收起手牌，打开搓牌
    onCuopaiBtnClick(event) {
        this.game.initCuoPai();
        this.game.cuopaiAnimation();
        this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
    },
    //亮牌
    onShowToAllBtnClick() {
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "openCard"
        })
        // this.unscheduleAllCallbacks();
        // this.game.myselfSeat.handcard.forEach((element, index) => {
        //     cc.director.getActionManager().removeAllActionsFromTarget(element.node, true);
        // });
        this.game.setStatusTmer(cc.vv.STATUS_ENUM.HANDLED, 0)
    },

    //提示
    onTipBtnClick() {
        let myniu = this.game.myselfSeat.getNiutype()
        this.game.myselfSeat.result(myniu.niuType)
    },

    //翻牌
    onFanpaiClike(event) {
        var self = this;
        cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.SHOW);

        this.game.myselfSeat.handcard.forEach((element, index) => {
            element.openCard()

        });

    },

    //开始游戏
    onStartGameBtnClick() {
        cc.vv.socket.send({
            controller_name: "YtxScoketService",
            method_name: "startGame"
        })
        cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.HANDLED);
        cc.vv.audio.playSFX('niuniu/gamestart.wav')
    },



    setUserInfo(seat) {
        let player = this.game.myselfSeat
        player.setInfo(seat);
        if (seat.handCard) {
            if (this.gamestatus == 4 && seat.handled == 1) {
                if (this.game.roomdata.way == 'open') {
                    player.recorveyMpCard(seat.handCard, true)
                } else {
                    player.recorveyCard(seat.handCard, true);

                }
                player.result(seat.niuType)
            }
            if (this.gamestatus == 4 && seat.handled == 0) {
                if (this.game.roomdata.way == 'open') {
                    player.recorveyMpCard(seat.handCard, false)
                } else {
                    player.recorveyCard(seat.handCard, false);
                }
            }
            if (this.gamestatus < 4) {
                if (this.game.roomdata.way == 'open') {
                    player.recorveyMpCard(seat.handCard, false)
                } else {
                    player.recorveyCard(seat.handCard, false);
                }
            }
        }
        this.addOnlineList(this.game.myselfSeat);
    },



    //发牌  明牌抢庄，自己没操作的话。需要亮一张牌，其他暗牌
    fapai(cardlist) {
        var self = this;
        var count = 0;
        this.game.fapaiyuan.active = true;
        // for (let j = 0; j < 5; j++) {
        //     for (let i = 0; i < this.playersSeatList.length; i++) {
        //         count++;
        //         self.scheduleOnce(() => {
        //             self.playersSeatList[i].getCard()
        //         }, count * 0.1)
        //     }
        // }


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
        var activelist = []
        this.onLinePlayer.forEach((player, i) => {
            if (player.getUserStatus() != 6) {
                activelist.push(player)
            }
        });

        var fa = function (cardIndex) {
            if (cardIndex >= activelist.length) return;

            if (cardIndex == activelist.length - 1) {
                self.game.fapaiyuan.active = false;

            }
            if (activelist[cardIndex] == self.game.myselfSeat) {
                if (self.game.roomdata.way == 'open') {
                    self.game.myselfSeat.getMpFiveCard(cardlist, fa(cardIndex + 1))
                }
                if (self.game.roomdata.way != 'open') {
                    self.game.myselfSeat.getFiveCard(fa(cardIndex + 1))
                    self.game.myselfSeat.setCardInfo(cardlist)
                }
            } else {
                activelist[cardIndex].getFiveCard(fa(cardIndex + 1))
            }
        }
        fa(0)
    },

    //获取于id匹配的玩家
    getPlayer(userid) {
        var tempRender;
        for (var inx = 0; inx < this.game.playersSeatList.length; inx++) {
            var render = this.game.playersSeatList[inx];
            if (render.getUserId() && render.getUserId() == userid) {
                tempRender = render;
                break;
            }
        }
        return tempRender;
    },
    usercharge(msg) {
        let data = msg.detail;
        this.game.myselfSeat.setBean(data)
    },
    //获取庄家
    getBanker() {
        var tempRender;
        for (var inx = 0; inx < this.game.playersSeatList.length; inx++) {
            var render = this.game.playersSeatList[inx];
            if (render.isBanker) {
                tempRender = render;
                break;
            }
        }
        return tempRender;
    },
    removeOnLineList(player) {
        for (let i = 0; i < this.onLinePlayer.length; i++) {
            if (this.onLinePlayer[i] == player) {
                this.onLinePlayer.splice(i, 1)
                break
            }
        }
    },
    addOnlineList(player) {
        for (let i = 0; i < this.onLinePlayer.length; i++) {
            if (this.onLinePlayer[i] == player) {
                return
            }
        }
        this.onLinePlayer.push(player)
    },
    onHistoryBtnClick() {
        this.resultPannel.active = true;
    },
    onBackHallBtnClick() {
        this.scene('hall', this)

    },

    //名牌抢庄，以及自由抢庄
    mpqzResult(data) {
        var self = this
        var banker = this.getBanker();
        if (banker == null) {
            return
        }
        //赢的人
        var winnertemp = [];
        //输的人
        var losertemp = [];
        let losertempBankerIndex;
        //庄家输了有2种
        var istongpei = false;

        for (let id in data) {

            let templayer = this.getPlayer(id)
            if (templayer == null) {
                break
            }
            let result = Number(data[id].win_result)
            if (templayer) {
                templayer.score(data[id].win_result, data[id].new_bean)
                templayer.resetGold();
            }
            if (result > 0) {
                winnertemp.push(templayer)
            }
            if (result < 0) {
                if (templayer == banker) {
                    losertempBankerIndex = losertemp.length
                }
                losertemp.push(templayer)
            }
        }
        if (losertemp.length == 1) {
            if (losertemp[0].getUserId() == banker.getUserId()) {
                istongpei = true;
            }
        }
        //改成递归回调
        this.scheduleOnce(() => {
            //庄家钱大于0
            if (data[banker.getUserId()].win_result >= 0) {
                //输的人飞向庄家
                losertemp.forEach(((loser, index) => {
                    if (index != losertemp.length - 1) {
                        loser.flyGold(banker.node)
                    } else {
                        loser.flyGold(banker.node, function () {
                            if (winnertemp.length == 1) {
                                //庄家飞向赢家
                                banker.flyGold(winnertemp[0].node)
                            }
                            if (winnertemp.length > 1) {
                                winnertemp.forEach((win) => {
                                    banker.direcitonFly(win.node)
                                })
                            }
                        })
                    }
                }))
            }
            //小于0
            if (data[banker.getUserId()].win_result < 0) {
                if (istongpei) {
                    winnertemp.forEach((win, index) => {
                        banker.direcitonFly(win.node)
                    })
                } else {
                    if (losertempBankerIndex != "undefined") {
                        losertemp.splice(losertempBankerIndex, 1)
                    }
                    losertemp.forEach(((loser, index) => {
                        if (index != losertemp.length - 1) {
                            loser.flyGold(banker.node)
                        } else {
                            loser.flyGold(banker.node, function () {
                                winnertemp.forEach((win) => {
                                    banker.direcitonFly(win.node)
                                })
                            })
                        }
                    }))
                }
            }
        }, 1)
    },
    tbResult(data) {
        var winnertemp = [];
        //输的人
        var losertemp = [];

        for (let id in data) {
            let templayer = this.getPlayer(id)
            if (templayer == null) {
                break
            }
            let result = Number(data[id].win_result)
            if (templayer) {
                templayer.score(data[id].win_result, data[id].new_bean)
                templayer.resetGold();
            }
            if (result > 0) {
                winnertemp.push(templayer)
            }
            if (result < 0) {
                losertemp.push(templayer)
            }
        }
        this.scheduleOnce(() => {
            losertemp.forEach((loser, index) => {
                loser.flyGold(winnertemp[0].node)
            })
        }, 1)

    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});