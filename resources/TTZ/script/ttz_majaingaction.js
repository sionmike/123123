cc.Class({
    extends: cc.Component,

    properties: {
        majaingPra:{
            default:null,
            type: cc.Node,
            tooltip:"麻将正面"
        },
        majiangback:{
            default:null,
            type:cc.Node,
            tooltip:"麻将背面"
        }

    },
    onLoad: function () {
        this.init(); 
        this.scheduleOnce(this.reverse.bind(this),1) 
    },
    init: function () {
        this.majaingPra.active = 0;
        this.majaingPra.scaleX = 0;
        this.majiangback.active = 1;
        this._isopen = 0;
    }, 
    // 翻转麻将
    reverse() {
        var self = this;
        if (!this._isOpen) {
            let action = cc.sequence(cc.scaleTo(0.2, 0, 1), cc.callFunc(() => {
                self.majaingPra.active = 1;
                self.majaingPra.runAction(cc.scaleTo(0.2, 1, 1));
                this._isOpen = 1;
            }));
            this.majiangback.runAction(action);
        }
    },
});
