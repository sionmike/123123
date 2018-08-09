cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.invitecode = cc.vv.user.code || ""
    },

    close() {
        this.target.destroy()
    },
    onShareToWallClick() {
   
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onWXCircleShare", "(Ljava/lang/String;)V", this.invitecode);
        }

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("CXHY_Share",
                "Share_WX:",    
                this.invitecode
            );
        }
    },
    onShareToClick() {
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onWXShare", "(Ljava/lang/String;)V", this.invitecode);
        }

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("CXHY_Share",
                "Share_WXQuan:",
                this.invitecode
            );
        }
    },
});