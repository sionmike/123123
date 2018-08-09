var vvCommon = require("vvCommon");
cc.Class({
    extends: vvCommon,

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
    },

    // use this for initialization
    onLoad: function () {

    },
    onClick: function () {
        if (cc.sys.isNative) {
            cc.game.end();
        }
        if (cc.sys.isBrowser) {
            this.logout();
            this.scene("login", this);
        }
    },
    onReLogin(){
        this.closesetting()
        this.logout();
        this.scene("login", this);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});