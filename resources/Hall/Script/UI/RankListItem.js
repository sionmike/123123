cc.Class({
    extends: cc.Component,

    properties: {
        spRankBG: cc.Sprite,
        labelRank: cc.Label,
        labelPlayerName: cc.Label,
        labelGold: cc.Label,
        spPlayerPhoto: cc.Sprite,
        texRankBG: {
            default: [],
            type: cc.SpriteFrame
        },
        texPlayerPhoto: {
            default: [],
            type: cc.SpriteFrame
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        qrcode: {
            default: null,
            type: cc.Prefab
        }
        // ...
    },

    // use this for initialization
    init: function (rank, playerInfo) {
        if (rank < 3) { // should display trophy
            this.labelRank.node.active = false;
            this.spRankBG.spriteFrame = this.texRankBG[rank];
        } else {
            this.labelRank.node.active = true;
            this.labelRank.string = (rank + 1).toString();
        }

        this.labelPlayerName.string = playerInfo.name;
        this.labelGold.string = playerInfo.bean.toString();
        this.spPlayerPhoto.spriteFrame = this.atlas.getSpriteFrame(playerInfo.header_id);
    },
    creatQrcode(){
      
        if(this.qrcodetexture==null){
            this.qrcodetexture = cc.instantiate(this.qrcode)
            this.qrcodetexture.getComponent(cc.Component).init();
            this.qrcodetexture.parent=cc.find("Canvas");
        }
    },
    // called every frame
    update: function (dt) {

    },
});