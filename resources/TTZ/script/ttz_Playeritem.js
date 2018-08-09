cc.Class({
    extends: cc.Component,

    properties: {
        playername: {
            default: null,
            type: cc.Label,
            tooltip: "玩家昵称"
        },
        playerphoto: {
            default: null,
            type: cc.Sprite,
            tooltip: "玩家照片"
        },
        playermoney: {
            default: null,
            type: cc.Label,
            tooltip: "玩家金额"
        },
        _playerData:null
    },

    // use this for initialization
    onLoad: function () {
        
    },
    playerrefresh(playerInfo) {
        this.playername.string = playerInfo.name;
        this.playermoney.string = playerInfo.money;
    },
});
