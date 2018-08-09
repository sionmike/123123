cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        music: {
            default: null,
            type: cc.Sprite
        },
        musicSlider: {
            default: null,
            type: cc.Slider
        },
        sound: {
            default: null,
            type: cc.Sprite
        },
        soundSlider: {
            default: null,
            type: cc.Slider
        },
        musicon: {
            default: null,
            type: cc.Node
        },
        musicoff: {
            default: null,
            type: cc.Node
        },
        soundon: {
            default: null,
            type: cc.Node
        },
        soundoff: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {

        this.init();
    },
    init() {
        var t = cc.sys.localStorage.getItem("bgVolume");
        var d = cc.sys.localStorage.getItem("deskVolume");
        if (t == null || d == null) return

        if (t != null) {
            this.bgVolume = parseFloat(t);
            this.musicSlider.progress = this.bgVolume;
            this.music.fillRange = this.bgVolume;
        }
        if (d != null) {
            this.deskVolume = parseFloat(d);
            this.soundSlider.progress = this.deskVolume;
            this.sound.fillRange = this.deskVolume;
        }



        if (this.bgVolume == 0) {
            this.musicon.active = false;
            this.musicoff.active = true;
        }
        if (this.deskVolume == 0) {
            this.soundon.active = false;
            this.soundoff.active = true;
        }


    },
    onMusicSlide: function (slider) {
        this.music.fillRange = slider.progress;
        cc.vv.audio.setBGMVolume(slider.progress);
        this.musicon.active = true;
        this.musicoff.active = false;
    },
    onSoundSlide: function (slider) {
        this.sound.fillRange = slider.progress;
        cc.vv.audio.setSFXVolume(slider.progress);
        this.soundon.active = true;
        this.soundoff.active = false;

    },
    onMusiceBtnClick: function () {
        if (cc.vv.audio.getState() == cc.audioEngine.AudioState.PLAYING) {
            this.musicon.active = false;
            this.musicoff.active = true;
            cc.vv.audio.pauseAll();
        } else {
            this.musicon.active = true;
            this.musicoff.active = false;
            cc.vv.audio.resumeAll();
        }
    },
    gameSettingClose() {
        let setting = cc.find('Canvas/gamesetting')
        if (setting) {
            cc.vv.gamesetting.put(setting);
        }
    },
    onBtnClicked: function (event) {
        if (event.target.name == "xiao-on") {
            cc.vv.audio.setSFXVolume(0);
            this.soundon.active = false;
            this.soundoff.active = true;

        } else if (event.target.name == "mu-on") {
            cc.vv.audio.setBGMVolume(0);
            this.musicon.active = false;
            this.musicoff.active = true;
        }
        if (event.target.name == "xiao-off") {
            cc.vv.audio.setSFXVolume(1);
            this.soundon.active = true;
            this.soundoff.active = false;

        } else if (event.target.name == "mu-off") {
            cc.vv.audio.setBGMVolume(1);
            this.musicon.active = true;
            this.musicoff.active = false;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});