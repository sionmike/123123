// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        qrcodetexture: {
            default: null,
            type: cc.Sprite
        },
        rendername: {
            default: null,
            type: cc.Label
        },
        renderorder: {
            default: null,
            type: cc.Label
        },
        rendertime: {
            default: null,
            type: cc.Label
        },
        qrcoderender: {
            default: null,
            type: cc.Node
        },
        icon: {
            default: null,
            type: cc.Node
        }

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init(data) {
        var self = this;
        this.rendername.string = data.name;
        this.renderorder.string = '订单编号：' + data.order_num;
        this.rendertime.string = '发起时间：' + this.formatDate(data.time);
        this.qrcodetexture.node.active = true
    },
    initqrcode(data) {
        this.rendername.string = data.name;
        this.renderorder.string = '订单编号：' + data.order_num;
        this.rendertime.string = '发起时间：' + this.formatDate(data.time);
        this.qrcoderender.getComponent("InitQrcode").init(data.info);
        this.icon.active = true
        this.qrcoderender.active = true;
    },
    destoyed() {
        this.node.destroy();
    },
    start() {

    },
    formatDate() {
        var now = new Date()
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },
    onSaveBtnClick(ev) {
        if (cc.sys.platform == cc.sys.ANDROID) {

            //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
            // var renderTexture = cc.RenderTexture.create(1280,640, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            var renderTexture = cc.RenderTexture.create(1280, 640);

            //实际截屏的代码
            renderTexture.begin();
            //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
            // this.qrcodetexture.node._sgNode.visit();
            
            this.node.parent._sgNode.visit();

            //把 renderTexture 添加到场景中去，否则截屏的时候，场景中的元素会移动
            // this.qrcodetexture.node.parent._sgNode.addChild(renderTexture);
             this.node.parent._sgNode.addChild(renderTexture);
            //把 renderTexture 设置为不可见，可以避免截图成功后，移除 renderTexture 造成的闪烁
            renderTexture.setVisible(false);
            renderTexture.end();
            var filename = new Date().getTime() + ".png"
            renderTexture.saveToFile(filename, cc.ImageFormat.PNG, true, function () {
                if (cc.sys.platform == cc.sys.ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onScreenSave", "(Ljava/lang/String;Ljava/lang/String;)V", ev.target.name, filename);
                }
                console.log("capture screen successfully!");
            });
            //打印截图路径
            console.log(jsb.fileUtils.getWritablePath())
        }

        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("CXHY_Share",
                "onScreenSave:andImgpath:",
                ev.target.name,
                "https://app.200le.com/upload/" + ev.target.name + ".png"
            );
        }

    }
    // update (dt) {},
});