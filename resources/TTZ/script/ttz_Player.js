cc.Class({
    extends: cc.Component,

    properties: {
        playerName: {
            default: null,
            type: cc.Label,
            tooltip: "玩家昵称"
        },
        playerPhoto:{
            default:null,
            type: cc.Sprite,
            tooltip: "玩家头像"
        },
        playerMoney:{
            default:null,
            type:cc.Label,
            tooltip:"玩家总金额"
        },
        makerName:{
            default:null,
            type:cc.Label,
            tooltip:"庄家昵称"
        },
        makerPhoto:{
            default: null,
            type: cc.Sprite,
            tooltip: "庄家头像"
        },
        makerMoney: {
            default: null,
            type: cc.Label,
            tooltip: "庄家总金额"
        },
        
        makerlistname:{
            default:null,
            type:cc.Label,
            tooltip:"庄家列表的庄家昵称"
        },
        makerlistmoney:{
            default:null,
            type:cc.Label,
            tooltip:"庄家上庄金额"
        },
        _userId: 0,
        _makerId:0

    },
    onLoad: function () {
    },
    // 玩家信息展示
    refresh(playerInfo) {
        var self = this;
        this.playerName.string = playerInfo.name;
        if ((Number(playerInfo.money) / 10) %1 ===0 ){
            this.playerMoney.string = (Number(playerInfo.money) / 10)
        }else{
            this.playerMoney.string = (Number(playerInfo.money) / 10).toFixed(1);
        }
        if (cc.vv.playerAtlas != null) {
           this.playerPhoto.spriteFrame=cc.vv.playerAtlas.getSpriteFrame(playerInfo.header_id)
        }
        this._userId = playerInfo.id;

    },
    // 庄家信息
    makerRefresh(makerInfo) {
        
        this.makerName.string = makerInfo.name;
        this.makerMoney.string = makerInfo.bet_money;
        if (cc.vv.playerAtlas != null) {
            this.makerPhoto.spriteFrame = cc.vv.playerAtlas.getSpriteFrame(makerInfo.header)
        }
        this._makerId = makerInfo.id;
    },
    makerlist(makerlistINfo){
        this.makerlistname.string = makerlistINfo.name;
        this.makerlistmoney.string = makerlistINfo.apply_money;
        this._makerId = makerlistINfo.banker_id || makerlistINfo.id;
    },
    makerinfo(data){
        this.makerName.string = data.name;
        this.makerMoney.string = data.apply_money;
        if (cc.vv.playerAtlas != null) {
            this.makerPhoto.spriteFrame = cc.vv.playerAtlas.getSpriteFrame(data.header)
        }
        this._makerId = data.banker_id;
    }
});
