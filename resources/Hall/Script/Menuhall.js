var vvCommon = require("vvCommon");

cc.Class({
    extends: vvCommon,

    properties: {
        pao: cc.Node,
        air: cc.Node,
        exit: cc.Prefab,
        share: cc.Prefab,
        kefu: cc.Prefab,
        // recharge: cc.Prefab,
        setting: cc.Prefab,
        money: cc.Node,
        threecards: cc.Node,
        niuniu: cc.Node,
        rule: cc.Node,
        rank: cc.Node,
        record: cc.Node,
        feedback: cc.Node,
        message: cc.Node,
        info: cc.Node,
        databind: cc.Node,
        chang: cc.Prefab,
        zjhchang: cc.Prefab,
        partyDH: cc.Node,
        waycharge: cc.Prefab,
        types: {
            type: cc.Node,
            default: []
        },
        payPrefab: cc.Prefab

        // defaults, set visually when attaching this script to the Canvas

    },

    // use this for initialization
    onLoad: function () {

        if (cc.vv.socket.isConnected == false) {
            this.connect();
        }
        this.io = require("IOUtils");
        this.login();
        cc.vv.audio.playBGM("hallbg2.mp3");

    },

    // called every frame
    update: function (dt) {

    },

    login() {
        var xhr = cc.vv.http.httpPost("/getUserMsg", {}, this.sucess, this.error, this);
        this.creatchang();
    },
    guest: function (result, object) {

    },
    error: function (object) {
        object.closeloadding(object.loaddingDialog);
        object.alertmsg("网络异常，服务访问失败");
    },

    sucess(result, object) {

        var data = JSON.parse(result);
        if (data != null && data.code == '0') {
            //放在全局变量
            object.resets(data, result);
            object.databind.getComponent('DefaultHallDataBind').init();
            if (cc.vv.user.third_source == 1) {
                cc.find('Canvas/header/3rd').active = true;
            }
        }


        // if( data.code == '1'){
        //     object.scene('login',object)
        // }

    },


    showpao() {
        this.pao.active = !this.pao.active;
    },
    closepao() {
        if (this.pao.active) {
            this.pao.active = false;
        }
    },
    showexit() {
        this.closepao();
        var item = cc.instantiate(this.exit);
        item.parent = cc.find("Canvas");
        let widget = item.getComponent(cc.Widget)
        widget.top = 0
        widget.letf = 0
        widget.right = 0
        widget.bottom = 0
    },
    showshare() {
        this.closepao();
        var item = cc.instantiate(this.share);
        this.node.addChild(item);
    },
    showkefu() {
        this.closepao();
        var item = cc.instantiate(this.kefu);
        this.node.addChild(item);
    },
    showair() {
        this.closepao();
        this.air.active = true;
    },
    closeair() {
        this.air.active = false;
    },
    showmoney() {
        this.closepao();
        this.money.active = true;
        this.money.getComponent('Money').init();
    },
    showrecharge() {
        this.closepao();
        // this.layered('点击排行，加入微信充值')
        // var item = cc.instantiate(this.waycharge);
        // item.setScale(0, 0)
        // var action = cc.scaleTo(0.2, 1, 1)
        // item.runAction(action)
        // this.node.addChild(item);
        console.log(1231231)
        this.showrechangbean()
    },
    showroomcard() {
        this.closepao();
        this.showcharge();
    },
    showset() {
        this.closepao();
        // var item = cc.instantiate(this.setting);
        // item.getChildByName('script').getChildByName('SettingClide').getComponent('SettingClide').init();
        this.showsetting()
    },
    ShowCDX() {
        if (cc.sys.isBrowser) {
            window.location = 'https://cdx.bingoooo.cn/cdx/index.php?token=' + cc.vv.http.authorization
        }
    },
    ShowDZP() {
        if (cc.sys.isBrowser) {
            if (cc.sys.isBrowser) {
                window.location = 'https://cdx.bingoooo.cn/dzp/index.php?token=' + cc.vv.http.authorization
            }
        }
    },
    showcards() {
        cc.vv.game.game_id = 6
        // var item = cc.instantiate(this.zjhchang);
        // this.node.getChildByName('3cards').getChildByName('content1').addChild(item);
        this.closepao();
        this.threecards.active = true;
        cc.find('gameitem', this.node).active = false;
        cc.find('header/header-left/exit', this.node).active = false;
        cc.find('header/header-left/back', this.node).active = true;
    },
    showniuniu() {
        cc.vv.game.game_id = 1
        this.closepao();
        this.niuniu.active = true;
        cc.find('gameitem', this.node).active = false;
        cc.find('header/header-left/exit', this.node).active = false;
        cc.find('header/header-left/back', this.node).active = true;
    },
    goback() {
        this.closepao();
        this.niuniu.active = false;
        this.threecards.active = false;
        cc.find('gameitem', this.node).active = true;
        cc.find('header/header-left/exit', this.node).active = true;
        cc.find('header/header-left/back', this.node).active = false;
    },
    showrule() {
        this.closepao();
        this.rule.active = true;
    },

    close(event) {
        event.target.parent.active = false;
    },
    showfeedback() {
        this.closepao();

        this.feedback.active = true;
    },
    showmessage() {
        this.closepao();
        this.message.active = true;
    },
    showinfo() {
        this.closepao();
        this.info.active = true;
    },
    showrecord() {
        this.record.active = true;
    },
    creatchang() {
        var item = cc.instantiate(this.chang);
        this.node.getChildByName('niuniu').getChildByName('content1').addChild(item);
        // var item = cc.instantiate(this.zjhchang);
        var item = cc.instantiate(this.zjhchang);
        this.node.getChildByName('3cards').getChildByName('content1').addChild(item);
        // this.node.getChildByName('3cards').getChildByName('content1').addChild(item);
        // var item = cc.instantiate(this.zjhchang);
        // this.node.getChildByName('3cards').getChildByName('content2').addChild(item);
        // var item = cc.instantiate(this.chang);
        // this.node.getChildByName('niuniu').getChildByName('content1').addChild(item);
        // var item = cc.instantiate(this.chang);
        // this.node.getChildByName('niuniu').getChildByName('content2').addChild(item);
        // var item = cc.instantiate(this.chang);
        // this.node.getChildByName('niuniu').getChildByName('content3').addChild(item);
    },
    showputong() {
        cc.find('header/header-left/gotoback', this.node).active = true;
        cc.find('3cards/title/types', this.node).active = true;
        this.types[0].getChildByName('bg').active = true;
        this.types[1].getChildByName('bg').active = false;
        this.node.getChildByName('3cards').getChildByName('content1').active = true;
        this.node.getChildByName('3cards').getChildByName('content1').children[0].getComponent('chang').init();
        this.node.getChildByName('3cards').getChildByName('content').active = false;
    },
    showhappy() {
        cc.find('header/header-left/gotoback', this.node).active = true;
        cc.find('3cards/title/types', this.node).active = true;
        this.types[1].getChildByName('bg').active = true;
        this.types[0].getChildByName('bg').active = false;

        this.node.getChildByName('3cards').getChildByName('content').active = false;
        this.node.getChildByName('3cards').getChildByName('content1').active = true;
        this.node.getChildByName('3cards').getChildByName('content1').children[0].getComponent('chang').init();
    },
    showming() {
        cc.vv.game.way = 'open'
        cc.find('header/header-left/gotoback2', this.node).active = true;
        cc.find('niuniu/title/types', this.node).active = true;
        this.types[2].getChildByName('bg').active = true;
        this.types[3].getChildByName('bg').active = false;
        this.types[4].getChildByName('bg').active = false;
        this.node.getChildByName('niuniu').getChildByName('content1').active = true;
        this.node.getChildByName('niuniu').getChildByName('content').active = false;
        this.node.getChildByName('niuniu').getChildByName('content1').children[0].getComponent('chang').init();
    },
    showfree() {
        cc.vv.game.way = 'free'
        cc.find('header/header-left/gotoback2', this.node).active = true;
        cc.find('niuniu/title/types', this.node).active = true;
        this.types[3].getChildByName('bg').active = true;
        this.types[2].getChildByName('bg').active = false;
        this.types[4].getChildByName('bg').active = false;
        this.node.getChildByName('niuniu').getChildByName('content1').active = true;
        this.node.getChildByName('niuniu').getChildByName('content').active = false;

        this.node.getChildByName('niuniu').getChildByName('content1').children[0].getComponent('chang').init();
    },
    showtongbi() {
        cc.vv.game.way = 'an'
        cc.find('header/header-left/gotoback2', this.node).active = true;
        cc.find('niuniu/title/types', this.node).active = true;
        this.types[4].getChildByName('bg').active = true;
        this.types[3].getChildByName('bg').active = false;
        this.types[2].getChildByName('bg').active = false;
        this.node.getChildByName('niuniu').getChildByName('content1').active = true;
        this.node.getChildByName('niuniu').getChildByName('content').active = false;
        this.node.getChildByName('niuniu').getChildByName('content1').children[0].getComponent('chang').init();
    },
    changback() {
        cc.find('3cards/title/types', this.node).active = false;
        cc.find('header/header-left/gotoback', this.node).active = false;
        cc.find('header/header-left/back', this.node).active = true;
        this.node.getChildByName('3cards').getChildByName('content1').active = false;
        this.node.getChildByName('3cards').getChildByName('content2').active = false;
        this.node.getChildByName('3cards').getChildByName('content').active = true;
    },
    changback2() {
        cc.find('niuniu/title/types', this.node).active = false;

        cc.find('header/header-left/gotoback2', this.node).active = false;
        cc.find('header/header-left/back', this.node).active = true;
        this.node.getChildByName('niuniu').getChildByName('content1').active = false;
        this.node.getChildByName('niuniu').getChildByName('content2').active = false;
        this.node.getChildByName('niuniu').getChildByName('content3').active = false;
        this.node.getChildByName('niuniu').getChildByName('content').active = true;
    },
    showcreatroom() {
        cc.find('gameitem/scrollview/view/content/mimi', this.node).getComponent(cc.Animation).play('turnaround');
        this.schedule(function () {
            cc.find('gameitem/scrollview/view/content/mimi', this.node).active = false;
            cc.find('gameitem/scrollview/view/content/creatroom', this.node).active = true;
            cc.find('gameitem/scrollview/view/content/mimi', this.node).getComponent(cc.Animation).play('goback');
        }, 0.32, 1);

    },
    show3rdDH() {
        this.partyDH.active = true;
    },
    showTTZ() {
        cc.vv.socket.send({
            method_name: "roomIndex",
            token: cc.vv.http.authorization,
            controller_name: "TtzWsController"
        });
    },
    showmimi() {
        cc.find('gameitem/scrollview/view/content/creatroom', this.node).getComponent(cc.Animation).play('turnaround');
        this.schedule(function () {
            cc.find('gameitem/scrollview/view/content/creatroom', this.node).active = false;
            cc.find('gameitem/scrollview/view/content/mimi', this.node).active = true;
            cc.find('gameitem/scrollview/view/content/creatroom', this.node).getComponent(cc.Animation).play('goback');
        }, 0.32, 1);
    },

    // onKeyDown(event){
    //     switch(event.keyCode) {
    //         case cc.KEY.back:
    //             this.showset()
    //             break;
    //     }
    // }
});