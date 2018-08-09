cc.Class({
    extends: cc.Component,

    properties: {
        mslider: cc.Slider,
        mprogressBar: cc.ProgressBar,
        sslider: cc.Slider,
        sprogressBar: cc.ProgressBar,
        _btnYXOpen: null,
        _btnYXClose: null,
        _btnYYOpen: null,
        _btnYYClose: null,

    },

    // use this for initialization
    onLoad: function () {
        this.updateProgressBar();
    },
    init() {


        if (cc.vv == null) {
            return;
        }
        var slider = this.node.getChildByName("music").getChildByName('progress');
        cc.vv.utils.addSlideEvent(slider, this.node, "Settings", "onSlided");

        var slider = this.node.getChildByName("sound").getChildByName('progress');

        cc.vv.utils.addSlideEvent(slider, this.node, "Settings", "onSlided");

        this._btnYYClose = this.node.getChildByName("sound").getChildByName("switch");

        this.refreshVolume();
    },
    updateProgressBar() {

        if (this.mslider && this.mprogressBar) {
            this.mprogressBar.progress = this.mslider.progress;
        }
        if (this.sslider && this.sprogressBar) {
            this.sprogressBar.progress = this.sslider.progress;

        }
    },

    close() {
        this.node.destroy();
    },
    gameSettingClose(){
        let setting = cc.find('Canvas/gamesetting')
        if (setting) {
            cc.vv.gamesetting.put(setting);
        }
    },
    onSlided: function (slider) {
        if (slider.node.parent.name == "music") {
            cc.vv.audioMgr.setSFXVolume(slider.progress);
        } else if (slider.node.parent.name == "sound") {
            cc.vv.audioMgr.setBGMVolume(slider.progress);
        }
        this.refreshVolume();
    },

    initButtonHandler: function (btn) {
        cc.vv.utils.addClickEvent(btn, this.node, "Settings", "onBtnClicked");
    },

    refreshVolume: function () {

        //this._btnYXClose.active = cc.vv.audioMgr.sfxVolume > 0;
        //this._btnYXOpen.active = !this._btnYXClose.active;

        var yx = this.node.getChildByName("music");
        var width = 360 * cc.vv.audioMgr.sfxVolume;
        var progress = yx.getChildByName("progress")
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.sfxVolume;
        progress.getChildByName("pro").progress = width;
        //yx.getChildByName("btn_progress").x = progress.x + width;


        //this._btnYYClose.active = cc.vv.audioMgr.bgmVolume > 0;
        // this._btnYYOpen.active = !this._btnYYClose.active;
        var yy = this.node.getChildByName("sound");
        var width = 360 * cc.vv.audioMgr.bgmVolume;
        var progress = yy.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.bgmVolume;

        progress.getChildByName("pro").progress = width;
        //yy.getChildByName("btn_progress").x = progress.x + width;
    },

    onBtnClicked: function (event) {
        if (event.target.name == "reload") {
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
            cc.director.loadScene("login");
        } else if (event.target.name == "put") {
            cc.vv.audioMgr.setPutong(1.0);

        } else if (event.target.name == "btn_yx_close") {
            cc.vv.audioMgr.setSFXVolume(0);
            this.refreshVolume();
        } else if (event.target.name == "pbi") {
            cc.vv.audioMgr.setPingbi(1);

        } else if (event.target.name == "btn_yy_close") {
            cc.vv.audioMgr.setBGMVolume(0);
            this.refreshVolume();
        }
    }

});