var vvCommon = require("vvCommon");
var io = require("IOUtils")

cc.Class({
    extends: vvCommon,

    properties: {
        _money: {
            get() {
                if (io.get('userinfo')) {
                    let userinfo = JSON.parse(io.get('userinfo'))
                    cc.vv.user.money = userinfo.money
                    return userinfo.money
                }
            },
            set(value) {
                if (io.get('userinfo')) {
                    let userinfo = JSON.parse(io.get('userinfo'))
                    userinfo.money = value
                    io.put('userinfo', JSON.stringify(userinfo))
                }
            }
        },

        _roomcard: {
            get() {
                if (io.get('userinfo')) {
                    let userinfo = JSON.parse(io.get('userinfo'))
                    return userinfo.room_card_count
                }

            },
            set(value) {
                if (io.get('userinfo')) {
                    let userinfo = JSON.parse(io.get('userinfo'))
                    userinfo.room_card_count = value
                    io.put('userinfo', JSON.stringify(userinfo))
                }
            }
        },
        rechagetext: {
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Label, // optional, default is typeof default
        },
        wxqrcode: {
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Prefab, // optional, default is typeof default
        },

        aliqrcode: {
            default: null, // The default value will be used only when the component attaching
            // to a node for the first time
            type: cc.Prefab, // optional, default is typeof default
        },
    },

    // use this for initialization
    onLoad: function () {
        this.init()
    },
    init() {
        var row1 = cc.find("content/row1", this.node);
        var row2 = cc.find("content/row2", this.node);
        if (row2) {
            // row1.children.forEach((item) => {
            //     item.on('touchstart', this.charge, this)

            // })
            row2.children.forEach((item) => {
                item.on('touchend', this.chargeRoom, this)
            })
        }
    },
    charge(event) {
        var self = this
        var money = event.target.name;
        if (cc.vv.data.data.third_source == 0) {
            this.showmoney(money);
        }
        if (cc.vv.data.data.third_source == 1) {
            this.setSureMsg({
                params: {
                    money: money
                },
                callback: function (result) {
                    this.setBean(result)
                }.bind(this)
            })
        }

    },
    chargeRoom(event) {
        var self = this;
        let cardNum = Number(event.target.name) / 6

        this.makesure({
            message: '是否使用星豆购买房卡',
            ok: function () {
                //sendRegisterVerifyCode
                //userLogin     mobile_phone  code 

                cc.vv.http.httpPost('/purchaseRoomCard', {
                    num: cardNum
                }, function (e) {
                    //支付成功回调\
                    let data = JSON.parse(e)
                    if (data.errCode == 0) {
                        self.setCard(data.data.room_card_count)
                        self.setBean(data.data.money)
                    }
                    cc.vv.global.layered(data.errMsg)
                }, function (e) {

                }, this)
            }
        })
    },

    //opt  pay suremsg
    setSureMsg(opt) {
        var self = this;
        var $money = opt.money || 0;
        var $msg = opt.msg || '是否使用代币支付'
        var $payApi = opt.payApi || "/auth_pay"
        var $successInfo = opt.successInfo || "充值成功！"
        var $failInfo = opt.failInfo || "金额不足！"
        var $callback = opt.callback || function (e) {}
        var $params = opt.params || {}

        this.makesure({
            message: $msg,
            ok: function () {
                cc.vv.http.httpPost($payApi, $params, function (e) {
                    //支付成功回调
                    if (e == self._money) {
                        cc.vv.global.layered($failInfo)
                    }
                    if (e != self._money) {
                        cc.vv.global.layered($successInfo)
                        if (cc.director.getScene().name == 'hall') {
                            $callback(e)
                        } else {
                            cc.vv.Notifycation.emit('recharge', e)
                        }
                    }
                })
            }
        })
    },
    rechargeClose() {
        if (cc.vv.layers.size() == 0) return
        let recharge = cc.find('Canvas/recharge')
        if (recharge) {
            cc.vv.recharge.put(recharge);
        }
    },

    setBean(value) {

        if (value != null) {
            if (cc.director.getScene().name == "hall") {
                cc.find('Canvas/DataBind').getComponent('DefaultHallDataBind').changemoney(value);
                this._money = value
            }
        }

    },
    setCard(value) {

        if (value != null) {
            if (cc.director.getScene().name == "hall") {
                cc.find('Canvas/DataBind').getComponent('DefaultHallDataBind').cards.string = value;
                this._roomcard = value
            }
        }
    },

    showmoney(moneys) {
        var self = this
        cc.vv.http.httpPost("/pay", {
            money: moneys //your money
        }, function (e, obj) {
            //console.log(e);
            //console.log(e.appId);
            //alert(e);
            if (e) { //http://www.zjkhtqz.com/index.php?m=response&a=sypay
                var json = {
                    "appId": e.appId,
                    "timeStamp": e.timeStamp,
                    "nonceStr": e.nonceStr,
                    "package": e.package,
                    "signType": e.signType,
                    "paySign": e.paySign
                };
                var el = JSON.parse(e)

                function jsApiCall() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest',
                        el,

                        function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                // 使用以上方式判断前端返回,微信团队郑重提示：
                                // res.err_msg将在用户支付成功后返回
                                // ok，但并不保证它绝对可靠。
                                //alert('OK');
                                cc.vv.http.httpPost("/play/pay_order", {
                                    money: money
                                }, function (e) {
                                    if (e == cc.vv.user.money) {
                                        cc.vv.global.layered('充值失败')
                                    }
                                    if (Number(e) > Number(cc.vv.user.money)) {
                                        cc.vv.global.layered('充值成功！')
                                        if (cc.director.getScene().name == 'hall') {
                                            self.setBean(e)
                                        } else {
                                            cc.vv.Notifycation.emit('recharge', e)
                                        }
                                    }
                                })
                            }
                        }
                    );
                }

                function callpay() {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
                            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
                        }
                    } else {
                        jsApiCall();
                    }
                }
                callpay();

            } else {
                // fun(e.status_code);
                alert(e.msg, e.status_code);
            }
        }, function (e) {
            console.log(e)
        }, this);
    },
    onWxPayClick() {
        var ctx = this;
        if (this.rechagetext.string == 0) return this.layered("请选择充值金额")
        cc.vv.http.httpPost("/api/rechargeMoney", {
            type: 1,
            money: this.rechagetext.string
        }, function (data) {
            var msg = JSON.parse(data)
            
            if (msg.code==0){  
                if (msg.pay_type == 60) {
                    var item = cc.instantiate(ctx.wxqrcode);
                    item.setScale(0, 0)
                    var action = cc.scaleTo(0.2, 1, 1)
                    item.runAction(action)
                    item.getComponent(cc.Component).init(msg.data)
                    item.parent = cc.find("Canvas");
                    item.setLocalZOrder(cc.vv.global.locZorder.QRCODE)
                }
                if (msg.pay_type == 51) {
                    var item = cc.instantiate(ctx.wxqrcode);
                    item.setScale(0, 0)
                    var action = cc.scaleTo(0.2, 1, 1)
                    item.runAction(action)
                    item.getComponent(cc.Component).initqrcode(msg.data)
                    item.parent = cc.find("Canvas");
                    item.setLocalZOrder(cc.vv.global.locZorder.QRCODE)
                }
            }
            else {
                ctx.layered(msg.info)
            }
        }, function () {}, this, "https://hapi.200le.com");
    },
    onAliPayClick() {
        var ctx = this;
        if (this.rechagetext.string == 0) return this.layered("请选择充值金额")
        cc.vv.http.httpPost("/api/rechargeMoney", {
            money: this.rechagetext.string,
            type: 2
        }, function (data) {
            var msg = JSON.parse(data)
            if (msg.code == 0) {
                if (msg.pay_type == 1) {
                    if (cc.sys.platform == cc.sys.ANDROID) {
                        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ZfbPay", "(Ljava/lang/String;)V", msg.data.info);
                    }
                    if (cc.sys.os == cc.sys.OS_IOS) {
                        jsb.reflection.callStaticMethod("CXHY_Share",
                            "Open_AliPay:",
                            msg.data.info
                        );
                    }
                } else if (msg.pay_type == 10) {
                    var item = cc.instantiate(ctx.aliqrcode);
                    item.setScale(0, 0)
                    var action = cc.scaleTo(0.2, 1, 1)
                    item.runAction(action)
                    item.getComponent(cc.Component).init(msg.data)
                    item.parent = cc.find("Canvas");
                    item.setLocalZOrder(cc.vv.global.locZorder.QRCODE)
                }
            } else {
                ctx.layered(msg.info)
            }
            // var item = cc.instantiate(ctx.alipay);
            // item.setScale(0, 0)
            // var action = cc.scaleTo(0.2, 1, 1)
            // item.runAction(action)
            // item.getComponent(cc.Component).init(msg.data)
            // item.parent = cc.find("Canvas");
            // ctx.node.destroy();
        }, function () {}, this, "https://hapi.200le.com");
    },
    close() {

        let recharge = cc.find('Canvas/beanrecharge')
        if (recharge) {
            cc.vv.beanrecharge.put(recharge);
        }
    },
    onMoneyClick(event) {
        this.rechagetext.string = event.target.name
    }
});