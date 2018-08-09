cc.Class({
    extends: cc.Component,

    properties: {



    },

    // use this for initialization
    onLoad: function () {
        cc.vv.room_callback = null; //加入房间回调函数
    },
    ready: function () {
        var check = false;
        if (cc.vv) {
            check = true;
        } else {
            this.scene("login", this);
        }
        return check;
    },
    connect: function (config) {
        let self = this;
        /**
         * 登录成功后，创建 Socket链接，
         */

        cc.vv.socket = window.io;
        cc.vv.socket.connect(config);
        var param = {
            token: cc.vv.authorization,
            orgi: cc.vv.user.orgi
        };

        let isBackGround = false;
        let HIDE_CTIME;
        let SHOW_CTIME;

        cc.game.on(cc.game.EVENT_HIDE, function (event) {
            if (!isBackGround) {
                isBackGround = true;
                HIDE_CTIME = new Date().getTime()
                cc.log("切换后台")
            }
        });
        cc.game.on(cc.game.EVENT_SHOW, function (event) {
            if (isBackGround) {
                cc.log("切换前台");
                let ctime = new Date().getTime() - HIDE_CTIME
                if (ctime > 10000 && cc.sys.isNative) {
                    if (cc.vv.audio) cc.vv.audio.stopAll()
                    cc.game.restart()
                }
                isBackGround = false;
                // if (cc.director.getScene().name == 'niugame') {
                //     cc.vv.socket.send({
                //         controller_name: "YtxScoketService",
                //         method_name: "getGameData"
                //     })
                // }
            }
        });



        cc.vv.socket.on('connect', function (data) {

            //self.alert("connected to server");
        });

        cc.vv.socket.on('disconnect', function (data) {
            self.alertmsg("网络连接断开", function (context) {
                cc.vv.audio.stopAll()
                if (cc.sys.isBrowser) self.scene("login", self);
                if (cc.sys.isNative) cc.game.restart();
            })
        });

        cc.vv.socket.on('GAME_RECOVERY', function (msg) {
            let data = msg.detail;
            cc.vv.status = 'playing';

            if (data.data.game_data.game_id == 4) {
                if (cc.director.getScene().name != 'niugame') {
                    self.scene("niugame", self, function () {
                        if (cc.vv.gameNotify) {
                            cc.vv.gameNotify.emit('NIU_GAME', data);
                        }
                    });
                }
            }
            if (data.data.game_data.game_id == 5) {
                if (cc.director.getScene().name != 'ttzpvp') {
                    self.scene("ttzpvp", self, function () {
                        if (cc.vv.gameNotify) {
                            cc.vv.gameNotify.emit('NIU_GAME', data);
                        }
                    });
                }

            }
            if (data.data.game_data.game_id == 6) {
                if (cc.director.getScene().name != 'table') {
                    self.scene("table", self, function () {
                        if (cc.vv.gameNotify) {
                            cc.vv.gameNotify.emit('GAMING', data);
                            console.log(123)
                        }
                    });
                }

            }



            // if (cc.director.getScene().name == 'niugame') {
            //     if (cc.vv.gameNotify) {
            //         cc.vv.gameNotify.emit('CLEAN');
            //         cc.vv.gameNotify.emit('NIU_GAME', data);
            //     }
            // }
        })


        cc.vv.socket.on('roomIndex', function (msg) {
            let data = msg.detail;
            if (data.data == 2) {
                self.alertmsg("金额须大于10")
            }
            if (data.data == 1) {
                cc.vv.status = 'playing';
                self.scene('ttzgame', self, function () {
                    if (cc.vv.gameNotify) {
                        cc.vv.gameNotify.emit("userVerify", {
                            id: cc.vv.user.id,
                            header_id: cc.vv.user.header_id,
                            money: cc.vv.user.money * 10,
                            name: cc.vv.user.name
                        })
                        cc.vv.gameNotify.emit('roomIndex', data);
                    }
                })
            }
            if (data.data == 0) {
                self.alertmsg("参数错误")
            }
        })





        cc.vv.socket.on("GAME_ERROR", function (msg) {
            let data = msg.detail;
            self.alertmsg(
                data.info)
        });
        cc.vv.socket.on("OPERATE_ERROR", function (msg) {
            let data = msg.detail;
            self.layered(
                data.info)
        });

        cc.vv.socket.on('GAME_WAITING', function (msg) {
            let data = msg.detail;
            if (data.data.game_data.game_id == 4) {
                self.scene("niugame", self, function () {
                    if (cc.vv.gameNotify) {
                        cc.vv.gameNotify.emit('NIU_GAME', data);
                    }
                });
            }
            if (data.data.game_data.game_id == 5) {
                self.scene("ttzpvp", self, function () {
                    if (cc.vv.gameNotify) {
                        cc.vv.gameNotify.emit('NIU_GAME', data);
                    }
                });
            }
            if (data.data.game_data.game_id == 6) {
                self.scene("table", self, function () {
                    if (cc.vv.gameNotify) {
                        cc.vv.gameNotify.emit('GAMING', data);
                    }
                });
            }

        });
        /**
         * 加入房卡模式的游戏类型 ， 需要校验是否是服务端发送的消息
         */
        cc.vv.socket.on("searchroom", function (result) {
            //result 是 GamePlayway数据，如果找到了 房间数据，则进入房间，如果未找到房间数据，则提示房间不存在
            if (result != null && cc.vv.room_callback != null) {
                cc.vv.room_callback(result, self);
            }
        });
        return cc.vv.socket;
    },
    disconnect: function () {
        if (cc.vv.socket != null) {
            cc.vv.socket.disconnect();
        }
    },
    registercallback: function (callback) {
        cc.vv.room_callback = callback;
    },
    cleancallback: function () {
        cc.vv.room_callback = null;
    },
    getCommon: function (common) {
        var object = cc.find("Canvas/script/" + common);
        return object.getComponent(common);
    },
    loadding() {
        if (cc.vv.loadding.size() > 0) {
            this.loaddingDialog = cc.vv.loadding.get();
            this.loaddingDialog.parent = cc.find("Canvas");
            this.loaddingDialog.setLocalZOrder(cc.vv.global.locZorder.LOADING);
            this._animCtrl = this.loaddingDialog.getComponent(cc.Animation);
            var animState = this._animCtrl.play("loadding");
            animState.wrapMode = cc.WrapMode.Loop;
        }
    },
    // alert: function (message) {
    //     if (cc.vv.dialog.size() > 0) {
    //         this.alertdialog = cc.vv.dialog.get();
    //         this.alertdialog.parent = cc.find("Canvas");
    //         let node = this.alertdialog.getChildByName("message");
    //         if (node != null && node.getComponent(cc.Label)) {
    //             node.getComponent(cc.Label).string = message;
    //         }
    //     }
    //     this.closeloadding();
    // },
    /**
     * opt
     * @param {string} opt.message 
     * @param {callback} opt.ok
     */
    alertmsg(message, callback, context) {
        var self = this
        if (cc.vv.dialog.size() > 0) {
            let ok_callback = callback || function () {};
            this.alertdialog = cc.vv.dialog.get();
            this.alertdialog.setScale(0, 0)
            this.alertdialog.parent = cc.find("Canvas");
            this.alertdialog.setLocalZOrder(cc.vv.global.locZorder.ALETPANNEL);
            this.alertdialog.getComponent(cc.Animation).play();
            let node = this.alertdialog.getChildByName("label");
            let btn = this.alertdialog.getChildByName('ok')
            if (node != null && node.getComponent(cc.Label)) {
                node.getComponent(cc.Label).string = message;
            }

            btn.once('touchend', function () {
                cc.vv.dialog.put(self.alertdialog);
                ok_callback(context);
            }, this)
        }
    },


    makesure(opt, context) {
        if (cc.vv.makesure.size() > 0) {
            let message = opt.message || '弹出信息'
            let ok_callback = opt.ok || function () {}
            let cancel_callback = opt.cancel || function () {}

            this.surePannel = cc.vv.makesure.get();
            this.surePannel.setScale(0, 0)
            this.surePannel.parent = cc.find("Canvas");
            this.surePannel.setLocalZOrder(cc.vv.global.locZorder.ALETPANNEL);
            this.surePannel.getComponent(cc.Animation).play();
            let node = this.surePannel.getChildByName("label");
            let okBtn = this.surePannel.getChildByName('ok')
            let cancelBtn = this.surePannel.getChildByName('cancel')


            if (node != null && node.getComponent(cc.Label)) {
                node.getComponent(cc.Label).string = message;
            }

            okBtn.off('touchend')
            cancelBtn.off('touchend')

            this.okBtnEvent = function () {

                cc.vv.makesure.put(this.surePannel);
                ok_callback(context)
            };
            this.cancelBtnEvent = function () {
                cc.vv.makesure.put(this.surePannel);
                cancel_callback(context)
            };

            okBtn.once('touchend', this.okBtnEvent, this)
            cancelBtn.once('touchend', this.cancelBtnEvent, this)
        }
    },
    

    //
    showcharge() {
        if (cc.vv.recharge.size() > 0) {
            this.recharge = cc.vv.recharge.get();
            this.recharge.parent = cc.find("Canvas");
            this.recharge.setLocalZOrder(cc.vv.global.locZorder.RECHARGE)
        }
    },


    showrechangbean(){
        if (cc.vv.beanrecharge.size() > 0) {
            this.beanrecharge = cc.vv.beanrecharge.get();
            this.beanrecharge.parent = cc.find("Canvas");
            this.beanrecharge.setLocalZOrder(cc.vv.global.locZorder.RECHARGE)
        }
    },
    showsetting() {
        if (cc.vv.gamesetting.size() > 0) {
            this.gamesetting = cc.vv.gamesetting.get();
            this.gamesetting.parent = cc.find("Canvas");
            this.gamesetting.setLocalZOrder(cc.vv.global.locZorder.EXITPANEL);
        }
    },
    closesetting() {
        let setting = cc.find('Canvas/gamesetting')
        if (setting) {
            cc.vv.gamesetting.put(setting);
        }
    },

    layered: function (message) {
        if (cc.vv.layers.size() > 0) {
            this.alertlayers = cc.vv.layers.get();
            this.alertlayers.parent = cc.find("Canvas");
            this.alertlayers.setLocalZOrder(cc.vv.global.locZorder.LAYERMSG);
            let node = this.alertlayers.getChildByName("message");

            if (node != null && node.getComponent(cc.Label)) {
                node.getComponent(cc.Label).string = message;
            }
        }
        this.closelayer();
    },
    closelayer: function () {
        this.scheduleOnce(function () {
            if (cc.find("Canvas/layers")) {
                cc.vv.layers.put(cc.find("Canvas/layers"));
            }
        }, 1)
    },
    closeloadding: function () {
        if (cc.find("Canvas/loadding")) {
            cc.vv.loadding.put(cc.find("Canvas/loadding"));
        }
    },
    closeOpenWin: function () {
        if (cc.vv.openwin != null) {
            cc.vv.openwin.destroy();
            cc.vv.openwin = null;
        }
    },
    gameSetting: function () {

    },
    resize: function () {
        let win = cc.director.getWinSize();
        cc.view.setDesignResolutionSize(win.width, win.height, cc.ResolutionPolicy.EXACT_FIT);
    },
    closealert: function () {
        if (cc.find("Canvas/alert")) {
            cc.vv.dialog.put(cc.find("Canvas/alert"));
        }
    },
    scene(name, self, callback) {
        if (cc.vv) {
            self.loadding();
        }
        cc.director.preloadScene(name, function () {
            if (cc.vv) {
                self.closeloadding()
            }
            cc.director.loadScene(name, callback);
        });

    },
    root: function () {
        return cc.find("Canvas");
    },
    decode: function (data) {
        var cards = new Array();

        if (!cc.sys.isNative) {
            var dataView = new DataView(data);
            for (var i = 0; i < data.byteLength; i++) {
                cards[i] = dataView.getInt8(i);
            }
        } else {
            var Base64 = require("Base64");
            var strArray = Base64.decode(data);

            if (strArray && strArray.length > 0) {
                for (var i = 0; i < strArray.length; i++) {
                    cards[i] = strArray[i];
                }
            }
        }
        return cards;
    },
    parse: function (result) {
        var data;
        if (!cc.sys.isNative) {
            data = result;
        } else {
            data = JSON.parse(result);
        }
        return data;
    },
    resets: function (data, result) {
        //放在全局变量
        //cc.vv.authorization = data.token.id ;
        cc.vv.user = data.data;

        /*cc.vv.games = data.games ;
        cc.vv.gametype = data.gametype ;*/

        cc.vv.data = data;

        /*cc.vv.playway = null ;*/

        cc.vv.io.put("userinfo", JSON.stringify(data.data));


    },
    logout() {

        cc.vv.authorization = null;
        cc.vv.user = null;
        cc.vv.io.remove('bingo');
        cc.vv.audio.stopAll()
        if (cc.sys.isBrowser) {
            function setCookie(cname, cvalue, exdays) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            }

            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
            }
            setCookie('bingo', "", -1);
        }
        this.disconnect();
    },
    socket: function () {
        let socket = cc.vv.socket;
        if (socket == null) {
            socket = this.connect();
        }
        return socket;
    },
    map: function (command, callback) {
        if (cc.routes[command] == null) {
            cc.routes[command] = callback || function () {};
        }
    },
    route: function (command) {
        return cc.routes[command] || function () {};
    },
    /**
     * 解决Layout的渲染顺序和显示顺序不一致的问题
     * @param target
     * @param func
     */
    layout: function (target, func) {
        if (target != null) {
            let temp = new Array();
            let children = target.children;
            for (var inx = 0; inx < children.length; inx++) {
                temp.push(children[inx]);
            }
            for (var inx = 0; inx < temp.length; inx++) {
                target.removeChild(temp[inx]);
            }

            temp.sort(func);
            for (var inx = 0; inx < temp.length; inx++) {
                temp[inx].parent = target;
            }
            temp.splice(0, temp.length);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


});