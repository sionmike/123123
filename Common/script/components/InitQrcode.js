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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },
    init(url){
        var qrcode = new QRCode(6, QRErrorCorrectLevel.H);
        qrcode.addData(url);
        qrcode.make();
        let size = this.node.width;
        let num = qrcode.getModuleCount();
        var ctx = this.node.getComponent(cc.Graphics);
        ctx.clear();
        ctx.fillColor = cc.Color.BLACK;
        // compute tileW/tileH based on node width and height
        var tileW = size / num;
        var tileH = size / num;
        // draw in the Graphics
        for (var row = 0; row < num; row++) {
            for (var col = 0; col < num; col++) {
                if (qrcode.isDark(row, col)) {
                    // cc.log(row, col)
                    // ctx.fillColor = cc.Color.BLACK;
                    var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                    var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                    ctx.rect(Math.round(col * tileW), size - tileH - Math.round(row * tileH), w, h);
                    ctx.fill();
                } else {
                    // ctx.fillColor = cc.Color.WHITE;
                }
                // var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                // var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                // ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                // ctx.fill();
            }
        }
    },

    start () {

    },

    // update (dt) {},
});
