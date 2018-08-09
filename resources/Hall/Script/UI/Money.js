var vvCommon = require("vvCommon");
cc.Class({
    extends: vvCommon,

    properties: {
        target: cc.Node,
        inner: cc.Node,
        out: cc.Node,
        intext: cc.Node,
        outtext: cc.Node,
        inbutton: cc.Node,
        outbutton: cc.Node,
        money: cc.EditBox,
        sli: cc.Slider,
        pro: cc.ProgressBar,
        num: cc.Label,
        count: cc.Label,
        changemoneys: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },
    init() {
        var slider = cc.find("content", this.target).getChildByName('pro');
        cc.vv.utils.addSlideEvent(slider, this.node, "Money", "onSlided");
        var self = this
        if (cc.vv.user.money != null) {
            Object.defineProperty(cc.vv.user, "money", {
                get: function () {
                    if (cc.vv.io.get('userinfo')) {
                        let userinfo = JSON.parse(cc.vv.io.get('userinfo'))
                        return userinfo.money
                    }
                },
                set: function (value) {
                    if (value != null) {
                        let userinfo = JSON.parse(cc.vv.io.get('userinfo'))
                        userinfo.money = value
                        cc.vv.io.put('userinfo', JSON.stringify(userinfo))
                        self.num.string = value
                    }

                }
            });
        }
        this.num.string = cc.vv.user.money;
        this.count.string = cc.vv.user.kucun_money;
        this.pro.progress = 0;
        this.money.string = 0;
        this.sli.progress = 0;
        this.changemoneys.string = 0;
        this.outbutton.active == false;
        this.inbutton.active == true;
    },
    onSlided(slider) {
        if (this.inbutton.active == false) {
            this.money.string = parseInt(cc.vv.user.kucun_money * slider.progress).toString();
            this.changemoneys.string = parseInt(cc.vv.user.kucun_money * slider.progress).toString();
        } else {
            this.money.string = parseInt(cc.vv.user.money * slider.progress).toString();
            this.changemoneys.string = parseInt(cc.vv.user.money * slider.progress).toString();
        }


    },
    inputchange() {
        this.sli.progress = 0;
        this.pro.progress = 0;
        console.log(this.money)
        if (this.money.string == "" || this.money.string == null) return
        if (this.inbutton.active == false) {
            this.sli.progress = parseInt(this.money.string) / cc.vv.user.kucun_money;
            this.pro.progress = this.sli.progress;
            this.changemoneys.string = this.money.string;
        } else {
            this.sli.progress = parseInt(this.money.string) / cc.vv.user.money;
            this.pro.progress = this.sli.progress;

            this.changemoneys.string = this.money.string;
        }
    },
    sliderR() {
        // this.intext.active = true;
        this.out.active = true;
        this.inner.active = false;
        //this.outtext.active = false;
        this.inbutton.active = false;
        this.outbutton.active = true;
        this.out.getComponent(cc.Animation).play('sliderToright');
        this.money.string = parseInt(cc.vv.user.kucun_money * this.sli.progress).toString();
        this.changemoneys.string = parseInt(cc.vv.user.kucun_money * this.sli.progress).toString();
    },
    sliderL() {

        this.inner.active = true;
        /* this.outtext.active = true;
         this.intext.active = false;*/
        this.out.active = false;
        this.inbutton.active = true;
        this.outbutton.active = false;
        this.inner.getComponent(cc.Animation).play('sliderToleft');
        this.money.string = parseInt(cc.vv.user.money * this.sli.progress).toString();
        this.changemoneys.string = parseInt(cc.vv.user.money * this.sli.progress).toString();
    },
    save() {

        cc.vv.http.httpPost("/saveToVault", {
            save_bean: parseInt(this.changemoneys.string) //your money
        }, this.sucess, this.error, this);
    },
    getout() {

        cc.vv.http.httpPost("/getFromVault", {
            get_bean: parseInt(this.changemoneys.string) //your money
        }, this.sucess, this.error, this);
    },

    sucess: function (result, object) {
        var data = JSON.parse(result);
        if (data != null && data.code == 0) {
            if (cc.vv.layers.size() > 0) {

                object.layered('成功');
            }
            object.num.string = data.data.current_bean;
            object.count.string = data.data.remain_bean;
            cc.vv.user.money = data.data.current_bean;
            cc.vv.user.kucun_money = data.data.remain_bean;
            object.node.parent.getChildByName('DataBind').getComponent('DefaultHallDataBind').changemoney(data.data.current_bean);
        } else {

            if (cc.vv.layers.size() > 0) {

                object.layered(data.info);
            }
        }

    },
    error: function (object) {
        object.closeloadding(object.loaddingDialog);
        object.alert("网络异常，服务访问失败");
    },
    moneychang(data) {

        this.num.string = data.current_bean;
        this.count.string = data.remain_bean;
        cc.vv.user.money = data.current_bean;
        cc.vv.user.kucun_money = data.remain_bean;
        this.node.parent.getChildByName('DataBind').getComponent('DefaultHallDataBind').changemoney(data.current_bean);
    }

});