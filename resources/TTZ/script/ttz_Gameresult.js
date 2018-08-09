
cc.Class({
    extends: cc.Component,

    properties: {
        result: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "游戏状态"
        },
        majiangArr: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: "麻将图集"
        },
        win: {
            default: null,
            type: cc.Node,
            tooltip: "赢了的节点"
        },
        lose: {
            default: null,
            type: cc.Node,
            tooltip: "输了的节点"
        },
        winmaker: {
            default: null,
            type: cc.Label,
            tooltip: "赢的庄家节点"
        },
        winplayer: {
            default: null,
            type: cc.Label,
            tooltip: "赢了的玩家节点"
        },
        winmakerdian: {
            default: null,
            type: cc.Label,
            tooltip: "赢庄家点数"
        },
        wintiandian: {
            default: null,
            type: cc.Label,
            tooltip: "赢天门点数"
        },
        winzhongdian: {
            default: null,
            type: cc.Label,
            tooltip: "赢中门点数"
        },
        windidian: {
            default: null,
            type: cc.Label,
            tooltip: "赢地门点数"
        },
        majiang: {
            default: null,
            type: cc.Prefab,
            tooltip: "麻将"
        },
        winmakerpaizu: {
            default: null,
            type: cc.Node,
            tooltip: "庄家牌组"
        },
        wintianpaizu: {
            default: null,
            type: cc.Node,
            tooltip: "天门牌组"
        },
        winzhongpaizu: {
            default: null,
            type: cc.Node,
            tooltip: "中门牌组"
        },
        windipaizu: {
            default: null,
            type: cc.Node,
            tooltip: "地门牌组"
        },
        winmakerstate: {
            default: null,
            type: cc.Sprite,
            tooltip: "赢庄家状态"
        },
        wintianstate: {
            default: null,
            type: cc.Sprite,
            tooltip: "赢天门状态"
        },
        winzhongstate: {
            default: null,
            type: cc.Sprite,
            tooltip: "赢中门状态"
        },
        windistate: {
            default: null,
            type: cc.Sprite,
            tooltip: "赢地门状态"
        },
        wintime: {
            default: null,
            type: cc.Label,
            tooltip: "赢倒计时"
        },


        losemaker: {
            default: null,
            type: cc.Label,
            tooltip: "输了庄家节点"
        },
        loseplayer: {
            default: null,
            type: cc.Label,
            tooltip: "输了的玩家节点"
        },
        losemakerdian: {
            default: null,
            type: cc.Label,
            tooltip: "输庄家点数"
        },
        losetiandian: {
            default: null,
            type: cc.Label,
            tooltip: "输天门点数"
        },
        losezhongdian: {
            default: null,
            type: cc.Label,
            tooltip: "输中门点数"
        },
        losedidian: {
            default: null,
            type: cc.Label,
            tooltip: "输地门点数"
        },
        losemakerpaizu: {
            default: null,
            type: cc.Node,
            tooltip: "输庄家牌组"
        },
        losetianpaizu: {
            default: null,
            type: cc.Node,
            tooltip: "输天门牌组"
        },
        losezhongpaizu: {
            default: null,
            type: cc.Node,
            tooltip: "输中门牌组"
        },
        losedipaizu: {
            default: null,
            type: cc.Node,
            tooltip: "输地门牌组"
        },
        losemakerstate: {
            default: null,
            type: cc.Sprite,
            tooltip: "输庄家状态"
        },
        losetianstate: {
            default: null,
            type: cc.Sprite,
            tooltip: "输天门状态"
        },
        losezhongstate: {
            default: null,
            type: cc.Sprite,
            tooltip: "输中门状态"
        },
        losedistate: {
            default: null,
            type: cc.Sprite,
            tooltip: "输地门状态"
        },
        losetime: {
            default: null,
            type: cc.Label,
            tooltip: "输倒计时"
        },
        winmaxWinMoney: {
            default: null,
            type: cc.Label,
            tooltip: "最大赢家"
        },
        losemaxWinMoney: {
            default: null,
            type: cc.Label,
            tooltip: "最大赢家"
        }
        // makermoney:{
        //     default:null,
        //     type:cc.Label,
        //     tooltip:"庄家金额"
        // },
        // usermoney:{
        //     default:null,
        //     type:cc.Label,
        //     tooltip:"玩家金额"
        // }
    },

    // use this for initialization
    onLoad: function () {
        this.createmjpra();

    },
    createmjpra() {
        this.resultmjPool = new cc.NodePool();
        for (let i = 0; i < 40; i++) {
            let majiang = cc.instantiate(this.majiang);
            this.resultmjPool.put(majiang);
        }

    },
    youwin(data) {
        this.win.active = true;
        let fenge = cc.find("Canvas/gameresult/win/weninfo/zhuang/fenge")
        // this.makermoney.string = Number(this.makermoney.string)+ Number(data.banker_money);
        // this.usermoney.string = Number(this.usermoney.string) + Number(data.bet_status);

        var count = 5;
        this.win.setLocalZOrder(999999);
        for (let i = 0; i < data.points.banker.cards.length; i++) {
            this.createmj(this.winmakerpaizu, data.points.banker.cards, i);
        }
        for (let i = 0; i < data.points.free.top.cards.length; i++) {
            this.createmj(this.wintianpaizu, data.points.free.top.cards, i);
        }
        for (let i = 0; i < data.points.free.middle.cards.length; i++) {
            this.createmj(this.winzhongpaizu, data.points.free.middle.cards, i);
        }
        for (let i = 0; i < data.points.free.lower.cards.length; i++) {
            this.createmj(this.windipaizu, data.points.free.lower.cards, i);
        }
        if (data.maxWinMoney > 0) {
            this.winmaker.node.parent.opacity = 255;
            this.winmaxWinMoney.node.parent.opacity = 255;
            this.winmaker.string = "最大赢家";
            if (data.maxWinName.length > 10) {
                this.winmaxWinMoney.string = data.maxWinName.slice(0, 6) + "...：" + data.maxWinMoney
            } else {
                this.winmaxWinMoney.string = data.maxWinName + "：" + data.maxWinMoney
            }
            fenge.opacity = 255;
        }
        else {
            this.winmaker.node.parent.opacity = 0;
            this.winmaxWinMoney.node.parent.opacity = 0;
            fenge.opacity = 0;
        }
        // if (data.points.banker.points > data.points.free.top.points && data.points.banker.points > data.points.free.middle.points && data.points.banker.points > data.points.free.lower.points){
        //     this.winmaxWinMoney.node.parent.opacity = 255; 
        //     this.winmaxWinMoney.string ="庄家通赔"
        // }
        data.bet_status == 0 ? this.winplayer.string = "未投注" : this.winplayer.string = "我的输赢：" + data.total;
        data.points.banker.points > data.points.free.top.points || data.points.banker.points > data.points.free.middle.points || data.points.banker.points > data.points.free.lower.points ? this.winmakerstate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.winmakerstate.getComponent(cc.Sprite).spriteFrame = this.result[1]
        data.points.free.top.points > data.points.banker.points ? this.wintianstate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.wintianstate.getComponent(cc.Sprite).spriteFrame = this.result[1];
        data.points.free.middle.points > data.points.banker.points ? this.winzhongstate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.winzhongstate.getComponent(cc.Sprite).spriteFrame = this.result[1];
        data.points.free.lower.points > data.points.banker.points ? this.windistate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.windistate.getComponent(cc.Sprite).spriteFrame = this.result[1];
        if (data.points.free.top.points < 50) {
            if (data.points.free.top.points % 1 == 0.5) {
                this.wintiandian.string = Math.floor(data.points.free.top.points) + "点半";
            } else {
                this.wintiandian.string = data.points.free.top.points + "点";
            }
        } else {
            this.wintiandian.string = "豹子";
        }
        if (data.points.free.middle.points < 50) {
            if (data.points.free.middle.points % 1 == 0.5) {
                this.winzhongdian.string = Math.floor(data.points.free.middle.points) + "点半";
            } else {
                this.winzhongdian.string = data.points.free.middle.points + "点";
            }
        } else {
            this.winzhongdian.string = "豹子";
        }
        if (data.points.free.lower.points < 50) {
            if (data.points.free.lower.points % 1 == 0.5) {
                this.windidian.string = Math.floor(data.points.free.lower.points) + "点半";
            } else {
                this.windidian.string = data.points.free.lower.points + "点";
            }
        } else {
            this.windidian.string = "豹子";
        }
        if (data.points.banker.points < 50) {
            if (data.points.banker.points % 1 == 0.5) {
                this.winmakerdian.string = Math.floor(data.points.banker.points) + "点半";
            } else {
                this.winmakerdian.string = data.points.banker.points + "点";
            }
        } else {
            this.winmakerdian.string = "豹子";
        }

        this.wintimes = function () {
            count = Number(count - 1);
            // console.log("胜剩余时间"+count)
            if (count < 0) {
                this.close();
                count = 5;
                this.unscheduleAllCallbacks();
            } else {
                this.wintime.string = count;

            }
        }.bind(this)
        this.schedule(this.wintimes, 1, count);
    },
    // 生成麻将
    createmj(parent, content, i) {
        let j = content[i];
        let majiang = null;
        if (this.resultmjPool.size() > 0) {
            majiang = this.resultmjPool.get();
        } else {
            majiang = cc.instantiate(this.majiang);
        };
        j == 10 ? j = 0 : j == i;
        majiang.getComponent(cc.Sprite).spriteFrame = this.majiangArr[j];
        parent.addChild(majiang);
    },
    youlose(data) {
        this.lose.active = true;
        let fenge = cc.find("Canvas/gameresult/lose/loseinfo/zhuang/fenge")
        // this.makermoney.string = Number(this.makermoney.string) + Number(data.banker_money);
        // this.usermoney.string = Number(this.usermoney.string) + Number(data.bet_status);

        var count = 5;
        for (let i = 0; i < data.points.banker.cards.length; i++) {
            this.createmj(this.losemakerpaizu, data.points.banker.cards, i);
        }
        for (let i = 0; i < data.points.free.top.cards.length; i++) {
            this.createmj(this.losetianpaizu, data.points.free.top.cards, i);
        }
        for (let i = 0; i < data.points.free.middle.cards.length; i++) {
            this.createmj(this.losezhongpaizu, data.points.free.middle.cards, i);
        }
        for (let i = 0; i < data.points.free.lower.cards.length; i++) {
            this.createmj(this.losedipaizu, data.points.free.lower.cards, i);
        }
        data.points.banker.points > data.points.free.top.points || data.points.banker.points > data.points.free.middle.points || data.points.banker.points > data.points.free.lower.points ? this.losemakerstate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.losemakerstate.getComponent(cc.Sprite).spriteFrame = this.result[1]
        data.points.free.top.points > data.points.banker.points ? this.losetianstate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.losetianstate.getComponent(cc.Sprite).spriteFrame = this.result[1];
        data.points.free.middle.points > data.points.banker.points ? this.losezhongstate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.losezhongstate.getComponent(cc.Sprite).spriteFrame = this.result[1];
        data.points.free.lower.points > data.points.banker.points ? this.losedistate.getComponent(cc.Sprite).spriteFrame = this.result[0] : this.losedistate.getComponent(cc.Sprite).spriteFrame = this.result[1];
        
        if (data.maxWinMoney > 0) {
            this.losemaker.node.parent.opacity = 255;
            this.losemaxWinMoney.node.parent.opacity = 255;
            this.losemaker.string = "最大赢家";
            if (data.maxWinName.length > 10) {
                this.losemaxWinMoney.string = data.maxWinName.slice(0, 6) + "...：" + data.maxWinMoney
            } else {
                this.losemaxWinMoney.string = data.maxWinName + "：" + data.maxWinMoney
            }
            fenge.opacity = 255;
        }
        else {
            this.losemaker.node.parent.opacity = 0;
            this.losemaxWinMoney.node.parent.opacity = 0;
            fenge.opacity = 0;
        }
        if (data.points.banker.points > data.points.free.top.points && data.points.banker.points > data.points.free.middle.points && data.points.banker.points > data.points.free.lower.points) {
            this.losemaker.node.parent.opacity = 255;
            this.losemaker.string = "庄家通杀";
            fenge.opacity = 255
        }
        data.bet_status == 0 ? this.loseplayer.string = "未投注" : this.loseplayer.string = "我的输赢：" + data.total;
        if (data.points.free.top.points < 50) {
            if (data.points.free.top.points % 1 == 0.5) {
                this.losetiandian.string = Math.floor(data.points.free.top.points) + "点半";
            } else {
                this.losetiandian.string = data.points.free.top.points + "点";
            }
        } else {
            this.losetiandian.string = "豹子";
        }
        if (data.points.free.middle.points < 50) {
            if (data.points.free.middle.points % 1 == 0.5) {
                this.losezhongdian.string = Math.floor(data.points.free.middle.points) + "点半";
            } else {
                this.losezhongdian.string = data.points.free.middle.points + "点";
            }
        } else {
            this.losezhongdian.string = "豹子";
        }
        if (data.points.free.lower.points < 50) {
            if (data.points.free.lower.points % 1 == 0.5) {
                this.losedidian.string = Math.floor(data.points.free.lower.points) + "点半";
            } else {
                this.losedidian.string = data.points.free.lower.points + "点";
            }
        } else {
            this.losedidian.string = "豹子";
        }
        if (data.points.banker.points < 50) {

            if (data.points.banker.points % 1 == 0.5) {
                this.losemakerdian.string = Math.floor(data.points.banker.points) + "点半";
            } else {
                this.losemakerdian.string = data.points.banker.points + "点";
            }
        } else {
            this.losemakerdian.string = "豹子";
        }
        this.losetimes = function () {
            count = Number(count - 1);
            // console.log("输剩余时间为"+count)
            if (count < 0) {
                this.close();
                count = 5;
                this.unscheduleAllCallbacks();
            } else {
                this.losetime.string = count;
            }
        }.bind(this)
        this.schedule(this.losetimes, 1, count);
    },
    close() {
        this.win.active = false;
        this.lose.active = false;
        this.unscheduleAllCallbacks();
        this.winmakerpaizu.removeAllChildren();
        this.wintianpaizu.removeAllChildren();
        this.windipaizu.removeAllChildren();
        this.winzhongpaizu.removeAllChildren();
        this.losemakerpaizu.removeAllChildren();
        this.losetianpaizu.removeAllChildren();
        this.losedipaizu.removeAllChildren();
        this.losezhongpaizu.removeAllChildren();
    }
});
