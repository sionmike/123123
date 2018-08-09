cc.Class({
    extends: cc.Component,

    properties: {
        makernum: {
            default: null,
            type: cc.Label,
            tooltip: "庄家编号"
        },
        makername: {
            default: null,
            type: cc.Label,
            tooltip: "庄家昵称"
        },
        makermoney: {
            default: null,
            type: cc.Label,
            tooltip: "庄家金额"
        },
    },
    onLoad: function () {

    },
    refresh(makerInfo,i) {
        this.makernum.string =i+1;
        this.makername.string = makerInfo.name;
        this.makermoney.string =makerInfo.apply_money;
    },
});
