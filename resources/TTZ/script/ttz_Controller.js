var Common = require("vvCommon");
cc.Class({
    extends: Common,
    properties: {
        _fapaidata: null
    },
    onLoad: function () {
        this.model = cc.find("Canvas/Game").getComponent("ttz_Modle");
        this.initHandlers();
    },
    initHandlers: function () {
        var self = this;
        // 进入游戏
        cc.vv.gameNotify.on('userVerify', this.userLogin, this);
        // 加入房间
        cc.vv.gameNotify.on('roomIndex', this.roomIndex, this);
        // 投注接口
        cc.vv.socket.on('freeBet', this.betting, this);
        // 进入房间获取游戏信息
        cc.vv.socket.on('getInRoomGameInfo', this.getINfo, this);
        // 获取发牌信息
        cc.vv.socket.on("getGamePointsInfo", this.getmajiangs, this);
        // 获取当前状态剩余时间和期号
        cc.vv.socket.on("gameStatusInfo", this.zhuangtai, this);
        // 获取历史开奖信息
        cc.vv.socket.on("getHistorySettlement", this.gethistory, this)
        // 获取闲家列表
        cc.vv.socket.on("freeList", this.getPlayerlist, this);
        // 投注时间改成3秒
        cc.vv.socket.on("upGameBetTime", this.upgametime, this);
        // 庄家下庄接口
        cc.vv.socket.on("goOutBankerList", this.outmakerlist, this);
        // 获取游戏结算信息
        cc.vv.socket.on("getPCResult", this.getcurrentINfo, this);
        //获取游戏结算信息
        cc.vv.socket.on("getGameInfoByNo", this.gameResule, this);
        // 玩家推出房间
        cc.vv.socket.on("getOutRoom", this.playerout, this);
        // 玩家上庄接口
        cc.vv.socket.on("addBankerList", this.addBanker, this);
        // 接受推送的庄家信息及庄家列表
        cc.vv.socket.on("bankerinfo", this.bankerinfo, this);

        cc.vv.socket.on("bankerinfo", this.bankerinfo, this);
        // 结束投注数据
        cc.vv.socket.on("sendBetInfo", this.sendBetInfo, this)
        // 踢出
        cc.vv.socket.on("delFreeUserZero", this.kickplayer, this)
    },

    // { "controller_name": "TtzWsController", "method_name": "***" }

    // 投注时间改为3秒
    upgametime(data) {
        var data = data.detail.data;

        this.cleanTimer();
        let gametimers = new cc.vv.gametimer();
        this.model.timerArr.init({
            text: "请投注",
            time: data.end_time,
            target: this.model.touzhu,
            type: "bet"
        });
        gametimers.init({
            time: data.end_time,
            target: this.model.touzhutime,
            type: "bettime"
        });
        this.model.mytablepanel.setButtonDisabled();
    },
    bankerinfo(data) {
        var data = data.detail.data;
        this.model.basePlayer.makerlist(data.current_banker);
        this.model.basePlayer.makerinfo(data.current_banker);
        this.showupmaker();
        this.model.myinfoshow.makerlist.removeAllChildren();
        for (let i = 0; i < data.apply_banker.length; i++) {
            this.model.myinfoshow.addmakerlist(data.apply_banker[i], i);
        }

    },
    // 玩家上庄接口
    addBanker(data) {
        var data = data.detail.data;
        if (data.status == 0) {
            let newtishi = new cc.vv.gametimer();
            newtishi.init({
                text: "金额不足，请前往大厅充值",
                time: 1,
                target: this.model.tishi,
                type: "tishi"
            });
        };
        if (data.status == 1) {
            let newtishi = new cc.vv.gametimer();
            this.model.basePlayer.playerMoney.string = data.user_money;
            newtishi.init({
                text: "上庄成功",
                time: 1,
                target: this.model.tishi,
                type: "tishi"
            });
        }
        if (data.status == 2) {
            let newtishi = new cc.vv.gametimer();
            newtishi.init({
                text: "您已上庄，无需重复上庄",
                time: 1,
                target: this.model.tishi,
                type: "tishi"
            });
        }
    },
    // 玩家退出房间
    playerout(data) {
        var data = data.detail.data;
        if (data.status == 1) {
            this.scene('hall', this)
        }
        if (data.status == 0) {
            this.alertmsg(data.msg)
        }
    },
    //获取游戏结算信息
    gameResule(data) {
        var data = data.detail.data;
        if (data.status == 1) {
            cc.vv.audio.playSFX('guess/win.mp3');
            this.model.mygameresult.youwin(data);
        }
        if (data.status == 0) {
            cc.vv.audio.playSFX('guess/lose.mp3');
            this.model.mygameresult.youlose(data);
        }
        this.model.basePlayer.playerMoney.string = data.playermoney;
        this.model.basePlayer.makerMoney.string = data.bankerBetMoney;
    },
    // 获取游戏结算信息
    getcurrentINfo(data) {
        var self = this;
        var data = data.detail.data;
        cc.vv.audio.playSFX("niuniu/dropCoin.mp3");
        this.model.mjfactory.mjdiannum(this._fapaidata);
        this.model.mytablepanel.backCoin(data.top, data.middle, data.lower);
        this.model.mytablepanel.showwin(data.top, data.middle, data.lower);
    },
    // 庄家下庄
    outmakerlist(data) {
        var data = data.detail.data;
        if (data == 1) {
            let newtishi = new cc.vv.gametimer();
            newtishi.init({
                text: "下庄成功",
                time: 1,
                target: this.model.tishi,
                type: "tishi"
            });
        }
        if (data == 0) {
            let newtishi = new cc.vv.gametimer();
            newtishi.init({
                text: "请坐满三回合再下庄",
                time: 1,
                target: this.model.tishi,
                type: "tishi"
            });
        }
    },
    // 获取历史开奖信息
    gethistory(data) {
        var data = data.detail.data;
        this.model.myinfoshow.trendlist.removeAllChildren();
        for (var i in data) {
            this.model.myinfoshow.addtrendlist(data[i]);
        }
    },
    // 获取闲家列表
    getPlayerlist(data) {
        var data = data.detail.data;
        this.model.playernum.string = data.free_num;
        this.model.playerlistnum.string = data.free_num;
        this.model.myinfoshow.playerlist.removeAllChildren(true);
        for (var i = 0; i < data.free_list.length; i++) {
            this.model.myinfoshow.addplayerlist(data.free_list[i]);
        }
    },
    // 获取当前状态剩余时间和期号
    zhuangtai(data) {
        var self = this;
        var data = data.detail.data;
        this.showupmaker();
        if (data.status == 20) {
            this.model.mytablepanel.setButtonEable();
        } else {
            this.model.mytablepanel.setButtonDisabled();
        }
        this.cleanTimer()
        switch (data.status) {
            case 1:
                self.model.timerArr.init({
                    text: "正在洗牌...",
                    time: data.surplus_time,
                    target: self.model.xipai,
                    type: "xipai"
                });
                break;
            case 10:
                if (data.num == 5) {
                    self.model.timerArr.init({
                        text: "第一回合即将开始",
                        time: data.surplus_time,
                        target: self.model.text,
                        type: "start"
                    });
                    self.model.xianshi.string = "1/5(40张)"
                }
                if (data.num == 4) {
                    self.model.xianshi.string = "2/5(32张)"
                    self.model.timerArr.init({
                        text: "第二回合即将开始",
                        time: data.surplus_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.num == 3) {
                    self.model.xianshi.string = "3/5(24张)"
                    self.model.timerArr.init({
                        text: "第三回合即将开始",
                        time: data.surplus_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.num == 2) {
                    self.model.xianshi.string = "4/5(16张)"
                    self.model.timerArr.init({
                        text: "第四回合即将开始",
                        time: data.surplus_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.num == 1) {
                    self.model.xianshi.string = "5/5(8张)"
                    self.model.timerArr.init({
                        text: "第五回合即将开始",
                        time: data.surplus_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                break;
            case 20:
                cc.vv.audio.playSFX("guess/tzready.mp3");
                this.gametoutimer = new cc.vv.gametimer();
                this.gametimer = new cc.vv.gametimer();
                this.gametoutimer.init({
                    text: "请投注",
                    time: data.surplus_time,
                    target: self.model.touzhu,
                    type: "bet",
                    request: false
                });
                this.gametimer.init({
                    time: data.surplus_time,
                    target: self.model.touzhutime,
                    type: "bettime"
                });
                this.model.makerbetmoney.string = Number(this.model.basePlayer.makerMoney.string);
                break;
            case 30:
                let time = data.surplus_time;

                cc.vv.socket.send({
                    "controller_name": "TtzWsController",
                    "method_name": "getGamePointsInfo"
                });
                break;
            case 35:
                switch (data.num) {
                    case 5:
                        self.model.xianshi.string = "1/5(32张)";
                        break;
                    case 4:
                        self.model.xianshi.string = "2/5(24张)";
                        break;
                    case 3:
                        self.model.xianshi.string = "3/5(16张)";
                        break;
                    case 2:
                        self.model.xianshi.string = "4/5(8张)";
                        break;
                    case 1:
                        self.model.xianshi.string = "5/5(0张)";
                        break;
                    default:
                        break;
                }
                cc.vv.socket.send({
                    "controller_name": "TtzWsController",
                    "method_name": "getPCResult"
                });

                break
            case 40:
                self.model.timerArr.init({
                    text: "结算中,请等待下一局",
                    time: data.surplus_time,
                    target: self.model.jiesuan,
                    type: "wait"
                });
                if (data.surplus_time > 6) {
                    cc.vv.socket.send({
                        "controller_name": "TtzWsController",
                        "method_name": "getGameInfoByNo"
                    });

                }
                self.model.mjfactory.clearAll();
                self.model.mytablepanel.clearAll();
                this.model.makerbetmoney.string = 0;
                this.model.playermoney.string = 0;
                break;
            default:

                break;
        }
    },

    // 获取游戏的状态信息
    getINfo(data) {
        var self = this;
        var data = data.detail.data;
        if (data.game_info.length < 1) {
            cc.vv.socket.send({
                "controller_name": "TtzWsController",
                "method_name": "getInRoomGameInfo"
            });

        }
        this.cleanTimer()
        switch (data.game_info.game_num) {
            case 5:
                self.model.xianshi.string = "1/5(40张)";
                break;
            case 4:
                self.model.xianshi.string = "2/5(32张)";
                break;
            case 3:
                self.model.xianshi.string = "3/5(24张)";
                break;
            case 2:
                self.model.xianshi.string = "4/5(16张)";
                break;
            case 1:
                self.model.xianshi.string = "5/5(8张)";
                break;
            default:
                break;
        }
        this.model.basePlayer.makerRefresh(data.current_banker);
        this.model.basePlayer.makerlist(data.current_banker);
        this.showupmaker();
        if (data.apply_banker.length > 0) {
            for (let i = 0; i < data.apply_banker.length; i++)
                this.model.myinfoshow.addmakerlist(data.apply_banker[i], i);
        }
        if (data.game_info.game_status == 20) {
            this.model.mytablepanel.setButtonEable();
        } else {
            this.model.mytablepanel.setButtonDisabled();
        }
        switch (data.game_info.game_status) {
            case 1:
                self.model.timerArr.init({
                    text: "正在洗牌...",
                    time: data.game_info.game_time,
                    target: self.model.xipai,
                    type: "xipai"
                });
                break;
            case 10:
                if (data.game_info.game_num == 5) {
                    self.model.xianshi.string = "1/5(40张)"
                    self.model.timerArr.init({
                        text: "第一回合即将开始",
                        time: data.game_info.game_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.game_info.game_num == 4) {
                    self.model.xianshi.string = "2/5(32张)"
                    self.model.timerArr.init({
                        text: "第二回合即将开始",
                        time: data.game_info.game_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.game_info.game_num == 3) {
                    self.model.xianshi.string = "3/5(24张)"
                    self.model.timerArr.init({
                        text: "第三回合即将开始",
                        time: data.game_info.game_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.game_info.game_num == 2) {
                    self.model.xianshi.string = "4/5(16张)"
                    self.model.timerArr.init({
                        text: "第四回合即将开始",
                        time: data.game_info.game_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                if (data.game_info.game_num == 1) {
                    self.model.xianshi.string = "5/5(8张)"
                    self.model.timerArr.init({
                        text: "第五回合即将开始",
                        time: data.game_info.game_time,
                        target: self.model.text,
                        type: "start"
                    });
                }
                break;
            case 20:
                this.gametimer = new cc.vv.gametimer();
                this.gametoutimer = new cc.vv.gametimer();
                this.gametoutimer.init({
                    text: "请投注",
                    time: data.game_info.game_time,
                    target: self.model.touzhu,
                    type: "bet",
                    request: false
                });
                this.gametimer.init({
                    time: data.game_info.game_time,
                    target: self.model.touzhutime,
                    type: "bettime"
                });

                if (data.bet_info.length > 0) {
                    for (let i = 0; i < data.bet_info.length; i++) {
                        this.model.mytablepanel.gamestartCoin(data.bet_info[i]);
                    }
                }
                this.model.makerbetmoney.string = Number(this.model.basePlayer.makerMoney.string);
                this.model.playermoney.string = Number(data.game_info.bet_money_1) + Number(data.game_info.bet_money_2) + Number(data.game_info.bet_money_3);
                this.model.mytablepanel.othertianmoney.string = Number(data.game_info.bet_money_1);
                this.model.mytablepanel.otherzhongmoney.string = Number(data.game_info.bet_money_2);
                this.model.mytablepanel.otherdimoney.string = Number(data.game_info.bet_money_3);
                break;
            case 30:
                cc.vv.socket.send({
                    "controller_name": "TtzWsController",
                    "method_name": "getGamePointsInfo"
                });

                let time = data.game_info.game_time;
                break;
            case 35:
                cc.vv.socket.send({
                    "controller_name": "TtzWsController",
                    "method_name": "getPCResult"
                });

                self.model.mjfactory.wtianmj(data);
            case 40:
                self.model.timerArr.init({
                    text: "结算中,请等待下一局",
                    time: data.game_info.game_time,
                    target: self.model.jiesuan,
                    type: "wait"
                });
                if (data.game_info.game_time > 6) {
                    cc.vv.socket.send({
                        "controller_name": "TtzWsController",
                        "method_name": "getGameInfoByNo"
                    });

                }
                self.model.mjfactory.clearAll();
                self.model.mytablepanel.clearAll();
                this.model.makerbetmoney.string = 0;
                this.model.playermoney.string = 0;
                break;
            default:

                break;
        }
    },
    // 获取房间信息
    roomIndex(data) {
        cc.vv.socket.send({
            "controller_name": "TtzWsController",
            "method_name": "getInRoomGameInfo"
        });
    },
    // 获取玩家信息
    userLogin(data) {
        var data = data.detail;
        this.model.basePlayer.refresh(data);
        // cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "roomIndex" });

    },
    // 投注信息
    betting(data) {
        var data = data.detail.data;
        // if (data == 1){

        //     switch (this.model.mytablepanel.betInfo.betMoneyType) {
        //         case 1:
        //                 this.model.playermoney.string = Number(this.model.playermoney.string) + 10;
        //                 this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 10;
        //                 this.model.mytablepanel.drawMyCoin(this.model.mytablepanel.betInfo);

        //             break;
        //         case 2:

        //                 this.model.playermoney.string = Number(this.model.playermoney.string) + 50;
        //                 this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 50;
        //                 this.model.mytablepanel.drawMyCoin(this.model.mytablepanel.betInfo);

        //             break;
        //         case 3:

        //                 this.model.playermoney.string = Number(this.model.playermoney.string) + 100;
        //                 this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 100;
        //                 this.model.mytablepanel.drawMyCoin(this.model.mytablepanel.betInfo);

        //             break;
        //         case 4:

        //                 this.model.playermoney.string = Number(this.model.playermoney.string) + 500;
        //                 this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 500;
        //                 this.model.mytablepanel.drawMyCoin(this.model.mytablepanel.betInfo);

        //             break;
        //         case 5:

        //                 this.model.playermoney.string = Number(this.model.playermoney.string) + 1000;
        //                 this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 1000;
        //                 this.model.mytablepanel.drawMyCoin(this.model.mytablepanel.betInfo);

        //             break;
        //         default:
        //             break;
        //     }
        // }

        if (data == 3) {
            // this.model.timerArr.init({
            //     text: "正在结算中",
            //     time: 1,
            //     target: this.model.tishi,
            //     type: "tishi"
            // });
            this.layered("停止下注")
            this.model.mytablepanel.setButtonDisabled();

        }
        if (data == 2) {
            // this.model.timerArr.init({
            //     text: "金额不足",
            //     time: 1,
            //     target: this.model.tishi,
            //     type: "tishi"
            // });
            this.layered("金额不足")

        }
        if (data == 0) {

        }
    },
    showupmaker() {
        this.usercion = cc.find('Canvas/content/user/usercoin');

        if (this.model.basePlayer._userId == this.model.basePlayer._makerId) {
            this.model.upmaker.active = true;
            this.usercion.active = false;
        } else {
            this.model.upmaker.active = false;
            this.usercion.active = true;
        }
    },
    sendBetInfo(data) {
        var datas = data.detail.data;

        if (datas.status == 1) {
            cc.vv.audio.playSFX("niuniu/bet.wav");
            if (this.model.basePlayer._userId == datas.uid) {
                switch (datas.bet_info.betMoneyType) {
                    case 1:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 10;
                        this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 10;
                        this.model.mytablepanel.drawMyCoin(datas.bet_info);
                        break;
                    case 2:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 50;
                        this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 50;
                        this.model.mytablepanel.drawMyCoin(datas.bet_info);
                        break;
                    case 3:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 100;
                        this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 100;
                        this.model.mytablepanel.drawMyCoin(datas.bet_info);
                        break;
                    case 4:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 500;
                        this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 500;
                        this.model.mytablepanel.drawMyCoin(datas.bet_info);
                        break;
                    case 5:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 1000;
                        this.model.basePlayer.playerMoney.string = Number(this.model.basePlayer.playerMoney.string) - 1000;
                        this.model.mytablepanel.drawMyCoin(datas.bet_info);
                        break;
                    default:
                        break;
                }
            } else if (this.model.basePlayer._userId != datas.uid) {
                switch (datas.bet_info.betMoneyType) {
                    case 1:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 10;
                        break;
                    case 2:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 50;
                        break;
                    case 3:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 100;
                        break;
                    case 4:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 500;
                        break;
                    case 5:
                        this.model.playermoney.string = Number(this.model.playermoney.string) + 1000;
                        break;
                    default:
                        break;
                }
                this.model.mytablepanel.otnerdrawCoin(datas.bet_info);
            }
        } else if (datas.status == 0) {
            if (this.model.basePlayer._userId == datas.uid) {
                // this.model.timerArr.init({
                //     text: "超出下注金额",
                //     time: 1,
                //     target: this.model.tishi,
                //     type: "tishi"
                // });
                this.layered("超出下注金额")
            }
        }
    },
    getmajiangs(data) {
        var data = data.detail.data;
        this._fapaidata = data;

        this.model.mjfactory.getmajiangs(data);
    },
    cleanTimer() {
        if (this.gametimer != null) {
            this.gametimer.stop();
        }
        if (this.gametoutimer != null) {
            this.gametoutimer.stop();
        }
        if (this.model.timerArr != null) {
            this.model.timerArr.stop();
        }
    },
    //踢出房间
    kickplayer(){
        this.scene("hall",this)
    }
    // gameSchedule(time, callback) {
    //     let  self;
    //     var time=Number(time)
    //     let src = function () {
    //         time--;
    //         if (time < 0) {
    //             this.unschedule(src,this)
    //             // cc.vv.socket.send({ command: "getStatusSurplusTime" })
    //             callback()
    //         }
    //     }
    //     this.schedule(src, 1);
    // }
});