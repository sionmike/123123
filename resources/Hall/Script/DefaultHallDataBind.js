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
        username: {
            default: null,
            type: cc.Label
        },
        goldcoins: {
            default: null,
            type: cc.Label
        },
        photo: {
            default: null,
            type: cc.Sprite
        },
        cards: {
            default: null,
            type: cc.Label
        },
        useid: {
            default: null,
            type: cc.Label
        },
        atlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        photoArray: {
            default: [],
            type: cc.Node
        },
        username2: {
            default: null,
            type: cc.Label
        },

        useid2: {
            default: null,
            type: cc.Label
        },
        photos2: {
            default: null,
            type: cc.Sprite
        },
        useredit: {
            default: null,
            type: cc.EditBox
        },
        savenamebtn: {
            default: null,
            type: cc.Button
        },
        resetnamebtn: {
            default: null,
            type: cc.Button
        }


    },

    // use this for initialization
    onLoad: function () {
        this.errorMsg;
        if (cc.vv.playerAtlas == null) {
            cc.vv.playerAtlas = this.atlas;
            var we;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init() {

        var self = this;
        self.header_id = cc.vv.user.header_id;
        self.editname = self.useredit.string = self.username.string = cc.vv.user.name

        self.photo.spriteFrame = self.atlas.getSpriteFrame(cc.vv.user.header_id);

        cc.vv.updateMoney = function () {
            var sucessCallback = function (result, object) {
                var data = JSON.parse(result);
                if (data != null && data.code == 0) {
                    //放在全局变量
                 
                    self.resets(data, result);
                    if (cc.director.getScene().name == 'hall') {
                        if (cc.vv.user.money > 9999) {
                            var num = cc.vv.user.money / 10000;
                            self.goldcoins.string = num.toFixed(2) + '万';
                        } else {
                            self.goldcoins.string = cc.vv.user.money;
                        }
                    } else {
                        cc.vv.Notifycation.emit('recharge', e)
                    }
                }
            }
            var xhr = cc.vv.http.httpPost("/getUserMsg", {}, sucessCallback, (obj)=>{
                // self.layered("未知错误");
            }, this);
        }

        if (cc.vv.user.money > 9999) {
            var num = cc.vv.user.money / 10000;
            self.goldcoins.string = num.toFixed(2) + '万';
        } else {
            self.goldcoins.string = cc.vv.user.money;
        }
        self.useid.string = cc.vv.user.id;
        self.username2.string = cc.vv.user.name;
        self.useid2.string = cc.vv.user.id;
        self.cards.string = cc.vv.user.room_card_count;
        self.photos2.spriteFrame = self.atlas.getSpriteFrame(cc.vv.user.header_id);


        this.photoArray.forEach((nodes, index) => {
            var self = this;
            nodes.on('touchend', (event) => {
                self.photos2.spriteFrame = self.atlas.getSpriteFrame(index + 1);
                self.header_id = index + 1;
            })
        })
    },
    changebtn() {
        console.log(this.header_id)
        var xhr = cc.vv.http.httpPost("/updateUserHeader", {
            header_id: this.header_id
        }, this.sucess, this.error, this);

    },

    resetNameBtn() {

        this.username2.node.active = false;
        this.useredit.node.active = true;
        this.savenamebtn.node.active = true;
        this.resetnamebtn.node.active = false;

    },
    saveNameBtn() {
        var editSucess = function (result) {
            var data = JSON.parse(result);
            console.log(data)
            if (data != null && data.errCode == 0) {
                this.username.string = this.useredit.string;
                this.username2.string = this.useredit.string;
            }
            this.layered(data.errMsg);
        }.bind(this)

        var xhr = cc.vv.http.httpPost("/api/updateName", {
            name: this.useredit.string
        }, editSucess, this.error, this, "https://hapi.200le.com");

        this.useredit.node.active = false;
        this.username2.node.active = true;

        this.savenamebtn.node.active = false;
        this.resetnamebtn.node.active = true;
    },



    sucess: function (result, object) {
        var data = JSON.parse(result);
        if (data != null && data.code == 0) {
            if (cc.vv.layers.size() > 0) {
                object.layered('修改成功');
            }
            cc.vv.user.header_id = object.header_id;
            object.photo.spriteFrame = object.atlas.getSpriteFrame(object.header_id);
        }
    },
    error: function (object) {
        object.closeloadding(object.loaddingDialog);
        object.alert("网络异常，服务访问失败");
    },
    changemoney(money) {
        if (money > 9999) {
            var num = money / 10000;
            this.goldcoins.string = num.toFixed(2) + '万';
        } else {
            this.goldcoins.string = money;
        }
    },
    setRoomCard() {


    }

});