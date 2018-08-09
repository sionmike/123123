var form = require("form");
cc.Class({
    extends: form,

    properties: {
        confirm: cc.Node,
        phoneCode: cc.Node,
        passward1: cc.EditBox,
        passward2: cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    onNextClick() {
        this.layered("请填写登陆密码")
        this.phoneCode.active = false;
        this.confirm.active = true;
    },

    reset() {
        this.username.string = ""
        this.password.string = ""
        this.confirm.active = false;
        this.phoneCode.active = true;
    },
    userRegister() {
        var xhr = cc.vv.http.httpPost("/user_login", {
            tel: this.username.string,
            msg: this.password.string,
            password1: this.passward1.string,
            password: this.passward2.string
        }, this.getUserInfo.bind(this), this.error.bind(this), this);
    },
    // update (dt) {},
});