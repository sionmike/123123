var Common = require("vvCommon");
cc.Class({
    extends: Common,
    properties: {
        rule: {
            default: null,
            type: cc.Node,
            tooltip: '规则'
        },
        makeranim: {
            default: null,
            type: cc.Animation,
            tooltip: "庄家列表动画"
        },
        trendanim: {
            default: null,
            type: cc.Animation,
            tooltip: "走势列表动画"
        },
        playeranim: {
            default: null,
            type: cc.Animation,
            tooltip: "玩家列表动画"
        },
        setting: {
            default: null,
            type: cc.Node,
            tooltip: '设置'
        },
        back: {
            default: null,
            type: cc.Node,
            tooltip: '返回'
        },
        makerlistbtn: {
            default: null,
            type: cc.Node,
            tooltip: '庄家列表按钮'
        },
        makerlistdis: {
            default: null,
            type: cc.Node,
            tooltip: '庄家列表'
        },
        trendlistbtn: {
            default: null,
            type: cc.Node,
            tooltip: '走势按钮'
        },
        trendlistdis: {
            default: null,
            type: cc.Node,
            tooltip: '走势列表'
        },
        onlinebtn: {
            default: null,
            type: cc.Node,
            tooltip: '在线玩家按钮'
        },
        onlinelistdis: {
            default: null,
            type: cc.Node,
            tooltip: '在线玩家列表'
        },
        music: {
            default: null,
            type: cc.Node,
            tooltip: '音乐'
        },
        effect: {
            default: null,
            type: cc.Node,
            tooltip: '音效'
        }
    },


    onLoad: function () {
        if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE){
            let size = cc.view.getFrameSize();

            let isIphoneX = (size.width == 2436 && size.height == 1125) 
                   ||(size.width == 1125 && size.height == 2436);
            if(isIphoneX){
                this.makerlistbtn.getComponent(cc.Widget).left=44
                this.trendlistbtn.getComponent(cc.Widget).left=44
            }
        }

    },

    // 显示规则
    showrule() {
        this.rule.active == 1 ? this.rule.active = 0 : this.rule.active = 1;
    },
    // 关闭规则  
    closerule() {
        this.rule.active == 1 ? this.rule.active = 0 : this.rule.active = 1;
    },
    // 显示和关闭设置
    showsetting() {
        this.setting.active == 1 ? this.setting.active = 0 : this.setting.active = 1;
    },
    // 打开和关闭音乐，音效
    openmusic() {},
    bank() {

    },
    // 庄家列表的显示
    makerPlayright() {
        this.makerlistdis.setLocalZOrder(99999)
        this.makerlistdis.active = true;
        this.makerlistbtn.active = false;
        this.makeranim.play('makerlistright');
    },
    makerPlayleft() {
        this.makerlistdis.active = false;
        this.makerlistbtn.active = true;
        this.makeranim.play('makerlistleft');
    },
    // 庄家列表的显示
    palyerleft() {
        this.onlinelistdis.setLocalZOrder(99999)
        this.onlinelistdis.active = 1;
        this.onlinebtn.active = 0;
        this.playeranim.play('playerleft');
    },

    palyerright() {
        this.onlinelistdis.active = 0;
        this.onlinebtn.active = 1;
        this.playeranim.play('playerright');
    },
    trendright() {
        this.trendlistdis.setLocalZOrder(99999);
        this.trendlistdis.active = 1;
        this.trendlistbtn.active = 0;
        this.trendanim.play('trendlistdisright');
        cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "getHistorySettlement" });
       
    },
    trendleft() {
        this.trendlistdis.active = 0;
        this.trendlistbtn.active = 1;
        this.trendanim.play('trendlistdisleft');
    },
    outbanker() {
        cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "goOutBankerList" });
    },
    onBackBtnClick() {
        let self = this
        this.makesure({
            message: '是否返回大厅',
            ok: function () {
                cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "getOutRoom" });
            }
        })
    }

});