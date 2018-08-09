cc.Class({
    extends: cc.Component,

    properties: {
        // #06B759 lo
        // #C9030C win
        losecolor: cc.Color,
        wincolor: cc.Color,
        userid: {
            default: null,
            type: cc.Label,
            tooltip: '玩家id'
        },
        username: {
            default: null,
            type: cc.Label,
            tooltip: '名字'
        },
        dogtag: {
            default: null,
            type: cc.Sprite,
            tooltip: '狗牌'
        },
        score: {
            default: null,
            type: cc.Label,
            tooltip: '分数'
        },
        header: {
            default: null,
            type: cc.Sprite,
            tooltip: '头像'
        },
        playerAtlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: '头像'
        },
        lefttag: {
            default: null,
            type: cc.Sprite,
            tooltip: '头像'
        },


        // _isdyj:0,
        // _isowner:0,
        // _millionaire:0
    },



    onLoad() {


    },
    /**
     * 
     * 
     * @param {any} info 
     * @param {any} tag  正常玩家，还是房主
     */
    setInfo(info, tag) {
        if (info != null) {
            this.userid.string = info.user_id;
            this.username.string = info.name;
            this.header.spriteFrame=cc.vv.playerAtlas.getSpriteFrame(info.header)
            Number(info.settle_money) < 0 ? this.score.node.color = this.losecolor : this.score.node.color = this.wincolor
            this.score.string = parseInt(info.settle_money);
        }
        if (tag == 'nomal') {
            this.node.getComponent(cc.Sprite).spriteFrame = this.playerAtlas.getSpriteFrame('namal');
        }
        if (tag == 'own') {
            this.node.getComponent(cc.Sprite).spriteFrame = this.playerAtlas.getSpriteFrame('own_wrap');
        }
        // this.header.spriteFrame
    },
    setDyj() {
        let djytexture = this.playerAtlas.getSpriteFrame('dyj');
        this.dogtag.spriteFrame = djytexture;
    },
    setRoomOwn() {
        let ownner = this.playerAtlas.getSpriteFrame('own');
        this.lefttag.spriteFrame = ownner;
    },
    setMillionaire() {
        let millionaire = this.playerAtlas.getSpriteFrame('rich');
        this.dogtag.spriteFrame = millionaire;
    },

    // update (dt) {},
});