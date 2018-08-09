cc.Class({
    extends: cc.Component,

    properties: {
        target:cc.Node,
        winInfo:cc.Sprite,
        winName:cc.Label,
        loseInfo:cc.Sprite,
        loseName:cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },
    init(personA,personB){
        //this.winInfo.spriteFrame = personA.img;
        this.winName.string = /*personA.name*/'77';
        //this.loseInfo.spriteFrame = personB.img;
        this.loseName.string = /*personB.name*/'66';
    },
    close(){
        this.target.destroy();
    }
});
