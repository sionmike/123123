var Common = require("vvCommon");
cc.Class({
    extends: Common,
    properties: {
        player: {
            default: null,
            type: cc.Node,
            tooltip: '玩家组'
        },
        poker: {
            default: null,
            type: cc.Prefab,
            tooltip: '扑克'
        },
        timer: {
            default: null,
            type: cc.Node,
            tooltip: '定时器'
        },
        timer_num: {
            default: null,
            type: cc.Label,
            tooltip: '定时器的string'
        },
        btn: {
            default: null,
            type: cc.Node,
            tooltip: '游戏按钮'
        },
        cuopai: {
            default: null,
            type: cc.Prefab,
            tooltip: '搓牌'
        },
        close: {
            default: null,
            type: cc.Node,
            tooltip: '搓牌关闭按钮'
        },
        roominfo: {
            default: null,
            type: cc.Node,
            tooltip: '房间信息'
        },
        playertips: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: '房间信息'
        },
        cardtotal:{
            default: 30,
            type: cc.Integer,
            tooltip: '初始化卡牌总数',
        },
        cuopaitotal:{
            default: 5,
            type: cc.Integer,
            tooltip: '初始化卡牌总数',

        },
        resetCPos:{
            default: -250,
            type: cc.Integer,
            tooltip: '初始化搓牌位置',
        },
        numofcard:{
            default: 5,
            type: cc.Integer,
            tooltip: '初始化手牌数量',
        }

    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        if (this.timer) {
            this.timer.active = false;
        }
        if (this.catchbtn) {
            this.catchbtn.active = false;
        }
        if (this.playbtn) {
            this.playbtn.active = false;
        }
        if (this.notallow) {
            this.notallow.active = false;
        }
        if (this.operesult) {
            this.operesult.active = false;
        }
        if (this.close) {
            this.close.active = false;
        }

        /*存放玩家Component */
        //所有玩家的list
        this.playersSeatList = new Array();
        //我自己
        this.myselfSeat = null;
        cc.vv.playstatus = null;
        //poke池，拿出后存入玩家手牌
        this.pokerpool = new cc.NodePool();
        this.canvas = cc.vv.global.getCanvas();
        this.roomdata;


        this.shadow = this.canvas.getChildByName('shadow');

        var player = this.player.children;

        this.fapaiyuan = this.canvas.getChildByName('fapaiyuan');
        let fapaiyuanVec = this.node.convertToWorldSpaceAR(this.fapaiyuan.position);

        //初始化卡片池,放到发牌员处
        for (var i = 0; i < this.cardtotal; i++) {
            let poker = cc.instantiate(this.poker).getComponent(cc.Component);
            poker.init();
            this.pokerpool.put(poker.node);
            poker.node.setScale(0.5, 0.5);
            this.fapaiyuan.addChild(poker.node), this.fapaiyuan.active = false;
        }
        this.closeflag = 0;

        this.initCuoPai();

        //存放玩家组件引用
        for (var i = 0; i < player.length; i++) {
            let component = player[i].getComponent("Seat")
            if (i == 0) {
                this.myselfSeat = component;
            }
            this.playersSeatList.push(component);

            //玩家引用 卡牌池
            component.setCardPool(this.pokerpool, this.coinCollection);
            component.setNumOfCard(this.numofcard)
            //玩家引用发牌员坐标
            component.setDeliver(fapaiyuanVec);
        }

        //场面计时器
        let timer = require("NiuTimer")
        this.gametimer = new timer();





        //初始化个人信息
        if (this.myselfSeat && cc.vv) {
          
        }

        //场景数据
        this.initView();
    },



    //初始化btn
    initView() {
        this.readyBtn = this.btn.getChildByName('prepare');
        this.buqiangbtn = this.btn.getChildByName('buqiang');
        this.doubllebtn = this.btn.getChildByName('doubleiterm');
        this.qiangbtn = this.btn.getChildByName('qiang');
        this.cuopaibtn = this.btn.getChildByName('cuopai');
        this.fanpaibtn = this.btn.getChildByName('open');
        this.tishibtn = this.btn.getChildByName('tishi');
        this.liangpaibtn = this.btn.getChildByName('liangpai');
        this.startbtn = this.btn.getChildByName('start');
        this.round = this.roominfo.getChildByName('room_round').getChildByName('current').getComponent(cc.Label);
        this.sitbtn = this.btn.getChildByName('sit');
        this.historybtn = this.btn.getChildByName('history');
        this.backhallbtn = this.btn.getChildByName('backhall');
    },
    initCuoPai(){
        // 初始化大的搓牌用
        this.cuopaiList = new Array();
        for (var i = 0; i < this.cuopaitotal; i++) {
            let poker = cc.instantiate(this.cuopai).getComponent(cc.Component);
            poker.init();
            poker.node.setLocalZOrder(2)
            this.cuopaiList.push(poker);
            this.canvas.addChild(poker.node), poker.node.active = false;
            poker.node.setPosition(cc.p(0, this.resetCPos))
        }
        //监听搓牌
        cc.vv.gameNotify.on('cuopai', this.cuopaiEnd, this); //搓牌结束动画
        cc.vv.gameNotify.on('playstatus', this.statusChange, this); //改变我的游戏状态，通过emit 提交游戏状态会刷新游戏按钮
        return  this.cuopaiList
    },



    //刷新按钮  根据全局游戏状态
    refreshActionBtn() {
        this.btn.children.forEach((btn) => {
            btn.active = false;
        });
        switch (cc.vv.playstatus) {
            case cc.vv.STATUS_ENUM.READY:
                this.readyBtn.active = true;
                break;
            case cc.vv.STATUS_ENUM.CATCH:
                this.buqiangbtn.active = true;
                this.qiangbtn.active = true;
                break;
            case cc.vv.STATUS_ENUM.DOUBLE:
                this.doubllebtn.active = true;
                break;
            case cc.vv.STATUS_ENUM.OBERSERVER:
                break;
            case cc.vv.STATUS_ENUM.SHUFF:
                this.fanpaibtn.active = true;
                if (this.roomdata.way != 'open') {
                    this.cuopaibtn.active = true;
                }
                if (this.roomdata.way == 'open') {
                    this.fanpaibtn.x = this.cuopaibtn.x 
                }
                break;
            case cc.vv.STATUS_ENUM.SHOW:
                this.tishibtn.active = true;
                this.liangpaibtn.active = true;
                break;
            case cc.vv.STATUS_ENUM.WAITING:
                this.startbtn.active = true;
                break;
            case cc.vv.STATUS_ENUM.HANDLED:
                break;
            case cc.vv.STATUS_ENUM.ROOMREADY:
                this.sitbtn.active = true;
                break;
            case cc.vv.STATUS_ENUM.GAMEOVER:
                this.historybtn.active = true;
                this.backhallbtn.active = true;
                break;
            default:
                break;
        }
    },

    /**
     * 开始定时器
     * @param {int} times 剩余时间
     * @param {int} text 
     */
    startTimer(times) {
        if (this.timer) {
            this.timer.active = true,
                this.timer_num ? this.gametimer.startTmer(times, this.timer_num) : void 0
        }
    },
    /**
     * 设置游戏文字
     * @param {string} text 
     */
    setGameText(text) {
        if (this.timer) {
            this.timer.active = true,
                this.timer_num ? this.timer_num.getComponent(cc.Label).string = text : void 0
        }
    },
    /**
     * 改变状态+刷新按钮+触发定时器+改变文字
     * @param {enum} status 
     * @param {int} time 
     */
    setStatusTmer(status, time) {
        cc.vv.gameNotify.emit("playstatus", status);

        this.startTimer(time);

        if (status == cc.vv.STATUS_ENUM.HANDLED) {
            this.myselfSeat.handled = 1;
        } else {
            this.myselfSeat.handled = 0;
        }
    },

    stopTimer() {
        this.gametimer.stop(this.timer_num);
    },

    // //抢庄结果
    // catchresult: function (data) {
    //     if (this.timer) {
    //         this.timer.active = false;
    //     }
    //     if (this.catchbtn) {
    //         this.catchbtn.active = false;
    //     }
    //     if (this.playbtn) {
    //         this.playbtn.active = false;
    //     }
    //     if (this.timesrc) {
    //         this.vvtimer.stop();
    //     }
    //     this.doOperatorResult("catch", data.docatch, false);
    // },

    //搓牌结束
    cuopaiEnd() {
        var self = this;
        var cp = this.cuopaiList;
        //isopen 为 01111  开过牌了
        var result = function () {
            cp.forEach((component, i) => {
                i != 4 ? component.hideCard(i) : component.hideCard(i, function () {
                    let po = 244;
                    self.myselfSeat.handcard.forEach((card, index) => {
                        card.node.runAction(cc.sequence(cc.moveTo(0.3, po, 0), cc.moveTo(0.3, index * 122, 0)));
                        card.openCard();
                    })
                    cc.vv.gameNotify.emit("playstatus", cc.vv.STATUS_ENUM.SHOW);
                })
            })
        }
        if (!cp[0]._isopen && (cp[1]._isopen && cp[2]._isopen && cp[3]._isopen && cp[4]._isopen)) {
            result()
        }
        //isopen 为 11110  开过牌了
        if (cp[0]._isopen && cp[1]._isopen && cp[2]._isopen && cp[3]._isopen && !cp[4]._isopen) {
            result()
        }

        //11111
        if (cp[0]._isopen && cp[1]._isopen && cp[2]._isopen && cp[3]._isopen && cp[4]._isopen) {
            result()
        }
    },
    cuopaiAnimation() {
        var self = this;
        //在中间手牌的位置显示
        var po = this.myselfSeat.handcard[2].node.position;
        for (let i = 0; i < this.myselfSeat.handcard.length; i++) {
            var cp_card = this.cuopaiList[i];
            var card = this.myselfSeat.handcard[i];
            var action = cc.sequence(cc.moveTo(0.3, po), cc.moveTo(0.3, po.x, -250), cc.callFunc(function () {
                //最后一张手牌收起后，打开搓牌
                if (i == self.myselfSeat.handcard.length - 1) {
                    self.cuopaiList.forEach((card, index) => {
                        card.node.active = true;
                        let action = cc.spawn(cc.moveTo(0.3, cc.p(((index - 2) * 5), -250)), cc.rotateTo(0.3, ((index - 2) * 5)))
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

    onCloseClick() {
        var self = this;
        if (!this.closeflag) {
            this.closeflag = 1;
            this.cuopaiList.forEach((component, i) => {
                i != 4 ? component.hideCard(i) : component.hideCard(i, function () {
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

    //阴影下强制释放搓牌
    cuopaiHide() {
        if (this.shadow.active) {
            this.cuopaiList.forEach((component, i) => {
                // component.node.active = false;
                if(component.node.isValid==true)component.node.destroy();
            })
            this.myselfSeat.handcard.forEach((card, index) => {
                card.node.setPosition(index * 122, 0);
                card.openCard();
            })
        }
    },

    statusChange(data) {
        var self = this;
        let status = data.detail;
        cc.vv.playstatus = status;
        this.refreshActionBtn();
        if (this.close.active) {
            this.close.active = false;
        }
        if (this.shadow.active) {
            this.shadow.active = false;
        }
        this.closeflag = 0;
        if (status == cc.vv.STATUS_ENUM.HANDLED) {
            this.myselfSeat.handled = 1;
        } else {
            this.myselfSeat.handled = 0;
        }
    },
    /**
     * @param {{score:xx,type:xx}} card 
     */
    /**
     * @param game
     * @param times
     * @param automic 不允许 不出
     */
    //清桌
    clean() {
        this.playersSeatList.forEach((player) => {
            player.reset();
        });
        this.refreshActionBtn();
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
                wanfa = "自由抢庄";
                break;
            case 'an':
                wanfa = "通比牛牛";
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

    /**
     * 
     * void 改变回合
     * @param {int} num 
     */
    changeRound(num) {

        this.round.string = num + ''
    },
    restart: function () {

    }



    // update: function (dt) {

    // },
});