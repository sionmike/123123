function initMrg() {
    cc.vv.gametimer = require('ttz_Timer');
}
cc.Class({
    extends: cc.Component,

    properties: {
        majiang: {
            default: null,
            type: cc.Node,
            tooltip: "麻将资源引用"
        },
        infoshow: {
            default: null,
            type: cc.Node,
            tooltip: "列表信息的显示"
        },
        player: {
            default: null,
            type: cc.Node,
            tooltip: "玩家信息"
        },
        tablepanel: {
            default: null,
            type: cc.Node,
            tooltip: "玩家投注操作"
        },
        endtime: {
            default: null,
            type: cc.Label,
            tooltip: "结束剩余时间"
        },
        text: {
            default: null,
            type: cc.Label,
            tooltip: "回合文字"
        },
        jiesuan: {
            default: null,
            type: cc.Label,
            tooltip: "结算文字"
        },
        touzhu: {
            default: null,
            type: cc.Label,
            tooltip: "投注文字"
        },
        xipai: {
            default: null,
            type: cc.Label,
            tooltip: "洗牌文字"
        },
        playeritem: {
            default: null,
            type: cc.Prefab,
            tooltip: "玩家预制图"
        },
        makeritem: {
            default: null,
            type: cc.Prefab,
            tooltip: "庄家预制"
        },
        trenditem: {
            default: null,
            type: cc.Prefab,
            tooltip: "走势预制"
        },
        gameresult: {
            default: null,
            type: cc.Node,
            tooltip: "游戏结果"
        },
        touzhutime: {
            default: null,
            type: cc.Label,
            tooltip: "投注倒计时"
        },
        tishi: {
            default: null,
            type: cc.Label,
            tooltip: "提示信息"
        },
        playernum: {
            default: null,
            type: cc.Label,
            tooltip: "玩家列表人数"
        },
        playerlistnum: {
            default: null,
            type: cc.Label,
            tooltip: "玩家列表人数"
        },
        makerbetmoney: {
            default: null,
            type: cc.Label,
            tooltip: "庄家金额"
        },
        playermoney: {
            default: null,
            type: cc.Label,
            tooltip: "玩家投注金额"
        },
        xianshi: {
            default: null,
            type: cc.Label,
            tooltip: "显示剩余牌数"
        },
        upmaker: {
            default: null,
            type: cc.Node,
            tooltip: "下庄按钮"
        }
    },

    onLoad: function () {
        cc.game.setFrameRate(30); //设置游戏帧频率
        initMrg();
        cc.vv.audio.playBGM("horse/ttzbg.mp3");
        this.mjfactory = this.majiang.getComponent("ttz_MajiangMgr");
        this.basePlayer = this.player.getComponent('ttz_Player');
        this.myinfoshow = this.infoshow.getComponent("ttz_Infoshow");
        this.mytablepanel = this.tablepanel.getComponent("ttz_TablePanel");
        this.mygameresult = this.gameresult.getComponent("ttz_Gameresult");
        this.timerArr = new cc.vv.gametimer();
        // 距离本场结束时间
        this.getendtime();
    },
    getendtime() {
        this.schedule(function () {
            var date = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
            var nowdate = new Date();
            var msd = date - nowdate;
            var time = parseFloat(msd) / 1000;
            if (time > 60 && time < 60 * 60) {
                this.endtime.string = "距离本场结束:0时" + parseInt(time / 60.0) + "分" + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + "秒";
            } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                this.endtime.string = "距离本场结束:" + parseInt(time / 3600.0) + "时" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + "分" + parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            } else {
                this.endtime.string = "距离本场结束:0时0分" + parseInt(time) + "秒";
            }
        }, 1);
    },

    onDestroy() {

    }
});