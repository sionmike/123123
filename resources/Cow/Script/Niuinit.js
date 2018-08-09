cc.Class({
    extends: cc.Component,

    properties: {


    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.init()
    },
    init() {
        cc.vv.STATUS_ENUM = cc.Enum({
            READY: -1, //准备
            CATCH: -1, //抢庄
            DOUBLE: -1, //加倍
            OBERSERVER: -1, //旁观
            SHUFF: -1, //翻牌
            SHOW: -1, //亮牌
            WAITING: -1, // 显示开始按钮
            HANDLED: -1, //本状态操作完成
            BANKERANIMATION: -1, //有人抢庄等待动画
            NOCATCH: -1, //无人抢庄
            WAITTINGDOUBLE: -1, //等待闲家下注
            ROOMREADY: -1,  //房卡类准备
            GAMEOVER:-1 //游戏结束
        })

        //玩家
        cc.vv.TIPS_STATUS = cc.Enum({
            GETREADY: -1,
            OFFLINE: -1,
            NATURE: -1,
            OBERSERVER: -1
        })
      
        cc.vv.audio.playBGM('niu_bgm.wav');
    },
    onDestroy() {
        cc.vv.TIPS_STATUS = null;
        cc.vv.STATUS_ENUM = null;
    
    }

    // update (dt) {},
});