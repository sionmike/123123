cc.Class({
    extends: cc.Component,

    properties: {
        trendzhaung: {
            default: null,
            type: cc.Label,
            tooltip: "庄家点数"
        },
        trendtian: {
            default: null,
            type: cc.Label,
            tooltip: "天门点数"
        },
        trendzhong: {
            default: null,
            type: cc.Label,
            tooltip: "中门点数"
        },
        trenddi: {
            default: null,
            type: cc.Label,
            tooltip: "地门点数"
        },
    },

    // use this for initialization
    onLoad: function () {},
    refresh(trendInfo) {
        if (trendInfo.free.top < 50) {
            if (trendInfo.free.top % 1 == 0.5) {
                this.trendtian.string = Math.floor(trendInfo.free.top) + "点半";
            } else {
                this.trendtian.string = trendInfo.free.top + "点";
            }
        } else {
            this.trendtian.string = "豹子";
        }
        if (trendInfo.free.middle < 50) {
            if (trendInfo.free.middle % 1 == 0.5) {
                this.trendzhong.string = Math.floor(trendInfo.free.middle) + "点半";
            } else {
                this.trendzhong.string = trendInfo.free.middle + "点";
            }
        } else {
            this.trendzhong.string = "豹子";
        }
        if (trendInfo.free.lower < 50) {
            if (trendInfo.free.lower % 1 == 0.5) {
                this.trenddi.string = Math.floor(trendInfo.free.lower) + "点半";
            } else {
                this.trenddi.string = trendInfo.free.lower + "点";
            }
        } else {
            this.trenddi.string = "豹子";
        }
        if (trendInfo.banker < 50) {
            if (trendInfo.banker % 1 == 0.5) {
                this.trendzhaung.string = Math.floor(trendInfo.banker) + "点半";
            } else {
                this.trendzhaung.string = trendInfo.banker + "点";
            }
        } else {
            this.trendzhaung.string = "豹子";
        }
    }
});