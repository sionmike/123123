var HandCard = require('HandCard')


cc.Class({
    extends: HandCard,

    properties: {

        //头像
        _avadar: null,
        //名字文字
        _userName: "",
        //准备
        _ready: null,
        //winner
        _dayingjia: false,

        //庄家框
        _zhuang: null,

        //庄家
        _iszhuang: false,

        //加倍
        _double: null,
        //金币
        _gold: null,

        //聊天窗口
        _chatBubble: null,

        //钱
        _bean: 0,
        //准备
        _isReady: false,

        //名字
        _lblName: null,

        //豆
        _lblBean: null,
        //结果，牛牛*3
        _result: null,

        //抢庄
        _qiangzhuang: null,
        //userid
        _userId: 0,

        //声音
        _voicemsg: null,

        //表情
        _emoji: null,

        _lastChatTime: -1,

        //大赢家
        _isDayingjia: 0,

        //倍数组件对象
        _beishu: null,

        //下注倍数
        _betbeishu: 0,


        _status: 1,

        _isOffline: 0,
        //性别
        _gender: 1,

        //本回合是否操作过
        handled: {
            default: null,
            visible: false
        },

        isBanker: {
            get() {
                return this._iszhuang
            },
            visible: false,
        },


    },



    onLoad: function () {

        //初始化玩家类，玩家数据
        var self = this;
        // //头像
        this._avadar = this.node.getChildByName('image').getChildByName('avadar');

        //名字文字
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);

        //无牛
        this._noniu = this.node.getChildByName("noniu")

        //庄头衔
        this.zhuang_tip = this.node.getChildByName("bankertip");

        //分数文字，冰豆
        this._lblBean = this.node.getChildByName("score").getComponent(cc.Label);
        //文字抢不抢
        this._qiangzhuang = this.node.getChildByName("qiangzhuang").getComponent(cc.Label);

        //倍数动画组件
        this._beishu = new Object();
        this._beishu.node = self.node.getChildByName('coinbg').getChildByName('beishu');
        this._beishu.bg = self.node.getChildByName('coinbg');
        this._beishu.bgAnimation = this._beishu.bg.getComponent(cc.Animation);
        this._beishu.bgPosition = this._beishu.bg.position;
        Object.defineProperty(this._beishu, "string", {
            get: function () {
                return this.node.getComponent(cc.Label).string
            },
            set: function (value) {
                this.node.getComponent(cc.Label).string = value
            }
        });



        //头顶输赢文字1000
        this._getscore = this.node.getChildByName("getscore");
        //结果  牛牛*2
        this._result = this.node.getChildByName("result");
        //准备文字
        this._ready = this.node.getChildByName("ready");
        //庄家头框
        this._zhuang = this.node.getChildByName("zhuang");
        //婊情
        this._emoji = this.node.getChildByName("emoji");
        //聊天
        this._chatBubble = this.node.getChildByName("chatbubble");
        //jiabei
        this._double = this.node.getChildByName("niu_beishu").getComponent(cc.Label);
        //手牌
        this._hold = this.node.getChildByName("hold");

        this._obeserver = this.node.getChildByName("observer");
        this._offline = this.node.getChildByName("offline");

        this._niuColor = {
            highTextColor: new cc.Color(237, 30, 27),
            highOutlineColor: new cc.Color(235, 197, 79),
            lowTextColor: new cc.Color(242, 213, 81),
            lowOutlineColor: new cc.Color(134, 43, 6),
        }
        //庄序列
        this._flashZhuang = this.node.getChildByName("flash_zhuang");
        //聊天
        if (this._chatBubble) {
            this._chatBubble.active = false;
        }

        // this.canvas = cc.vv.global.getCanvas();
        // this._coinstartVec2 = this.canvas.convertToNodeSpaceAR(this.canvas.convertToWorldSpaceAR(this.node))
        // this._setGoldVec2 = this._beishu.bg.position;

        
        //会飞的硬币~~~~~
        this.coinCollection = [];
        cc.loader.loadRes("Cow/Prefab/niucoin", function (err, prefab) {
            self._gold = cc.instantiate(prefab);
            for (var i = 0; i < 5; i++) {
                let gold = cc.instantiate(self._gold);
                // gold.parent = self.canvas;
                gold.active = false;
                gold.parent = self.node;
                // gold.setPosition(self._coinstartVec2);
                gold.setPosition(0, 0);
                self.coinCollection.push(gold);
            }
        });
        this._isBetting = false;
        //重置信息数据
        this.reset(true);
    },


    onIconClicked: function () {

        // var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
        // if(this._userId != null && this._userId > 0){
        //    var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
        //     var sex = 0;
        //     if(cc.vv.baseInfoMap){
        //         var info = cc.vv.baseInfoMap[this._userId];
        //         if(info){
        //             sex = info.sex;
        //         }
        //     }
        //     cc.vv.userinfoShow.show(seat.name,seat.userid,iconSprite,sex,seat.ip);
        // }
    },
    setAvader(headerid) {
        this._avadar.getComponent(cc.Sprite).spriteFrame = cc.vv.playerAtlas.getSpriteFrame(headerid)

    },
    //每个玩家投注的硬币  初始不显示
    cloneCoin() {
        // this.coinCollection.forEach((node,index)=>{
        //     var action=cc.moveTo((index+1)*0.1,this.node.convertToNodeSpaceAR(cc.vv.global.getNodePositon(cc.p(0,0))))
        //     node.runAction(action)
        // })
    },



    /**
     * 
     * 飞到指定玩家头顶，需要传玩家节点
     * @param {node} othernode 
     */
    flyGold(othernode, callback) {
        if (othernode === this.node) {
            return
        }
        var self = this
        // cc.vv.global.getShadow().active = true;
        for (let i = 0; i < this.coinCollection.length; i++) {
            // this.coinCollection[i].setPosition(Math.random()*300,Math.random()*300)
            this.coinCollection[i].active = true;
            var action = cc.sequence(cc.moveTo((i + 1) * 0.2, cc.vv.global.getNodePositon(this.node, othernode)), cc.callFunc(function () {
                self.coinCollection[i].active = false
            }))
            if (i == this.coinCollection.length - 1) {
                action = cc.sequence(cc.moveTo((i + 1) * 0.2, cc.vv.global.getNodePositon(this.node, othernode)), cc.callFunc(function () {
                    self.coinCollection[i].active = false
                    if (callback) {
                        callback()
                    }
                    // if (cc.vv.global.getShadow().active) {
                    //     cc.vv.global.getShadow().active = false
                    // }
                }))
            }
            this.coinCollection[i].runAction(action);
        }
        cc.vv.audio.playSFX('niuniu/flygold.wav');
    },



    direcitonFly(othernode, callback) {
        if (othernode === this.node) {
            return
        }
        var self = this;
        let max = 5;

        // cc.vv.global.getShadow().active = true;
        for (let i = 0; i < max; i++) {
            let gold = cc.instantiate(this._gold);

            gold.parent = this.node;
            // gold.setPosition(Math.random()*300,Math.random()*300)
            // gold.setPosition(self._coinstartVec2);
            gold.setPosition(0, 0);
            gold.active = true;
            // gold.parent = this.canvas;
            // this.canvas.convertToNodeSpace(othernode)
            var action = cc.sequence(cc.moveTo((i + 1) * 0.15, cc.vv.global.getNodePositon(this.node, othernode)), cc.callFunc(function (node) {
                node.parent = null

            }))
            if (i == max - 1) {
                var action = cc.sequence(cc.moveTo((i + 1) * 0.15, cc.vv.global.getNodePositon(this.node, othernode)), cc.callFunc(function (node) {
                    node.parent = null
                    if (callback) {
                        callback()
                    }
                    // if (cc.vv.global.getShadow().active) {
                    //     self.scheduleOnce(() => {
                    //         cc.vv.global.getShadow().active = false
                    //     }, 1)
                    // }
                }))
            }
            gold.runAction(action)
        }
        cc.vv.audio.playSFX('niuniu/flygold.wav')
    },


    //下注金币
    setGold(value) {
        if (this._isBetting == false) {
            var self = this;
            this._gold.active = true;
            var action = cc.sequence(cc.moveTo(0.5, this._beishu.bgPosition.x + 20, this._beishu.bgPosition.y - 2), cc.callFunc(function () {
                self._beishu.bg.active = true;
                self._beishu.bgAnimation.play();
                self._beishu.bgAnimation.on('stop', function () {
                    self._beishu.string = '×' + value;
                    cc.vv.audio.playSFX('niuniu/bet.wav')
                })
            }))
            this._gold.parent = this.node;
            this._gold.runAction(action);
        }



        // let action = cc.moveTo((i + 0.5) * 0.1, this._beishu.bgPosition.x + 20, this._beishu.bgPosition.y - 2)
        // if (i == this.coinCollection.length - 1) {
        //     action = cc.sequence(cc.moveTo((i + 1) * 0.1, this._beishu.bgPosition.x + 20, this._beishu.bgPosition.y - 2), cc.callFunc(function () {
        //         self._beishu.bg.active = true;
        //         self._beishu.bgAnimation.play();
        //         self._beishu.bgAnimation.on('stop', function () {
        //             self._beishu.string = '×' + value;
        //             cc.vv.audio.playSFX('niuniu/bet.wav')
        //         })
        //     }))
        // }
        // this.coinCollection[i].active = true;
        // this.coinCollection[i].runAction(action);

    },



    //初始化到啥都没有 
    reset(boolean) {
        var self = this
        if (this._result) {
            this._result.active = false;
        }
        if (this._gold) {
            this._gold.active = false;
        }
        if (this._getscore) {
            this._getscore.active = false;
        }
        if (this._ready) {
            this._ready.active = false;
        }

        if (this._emoji) {
            this._emoji.active = false;
        }

        if (this._zhuang) {
            this._zhuang.active = false;
        }
        if (this._double) {
            this._double.node.active = false;
        }
        if (this._result) {
            this._result.active = false;
        }
        if (this._result) {
            this._result.active = false;
        }
        if (this._qiangzhuang) {
            this._qiangzhuang.node.active = false;
        }
        if (this._beishu.bg) {
            this._beishu.bg.active = false;
        }
        if (this.zhuang_tip) {
            this.zhuang_tip.active = false;
        }
        if (this._flashZhuang) {
            this._flashZhuang.active = false;
        }
        if (this._obeserver) {
            this._obeserver.active = false;
        }
        if (this._offline && boolean) {
            this._offline.active = false
        }
        if (this._noniu) {
            this._noniu.active = false
        }
        //深度清除用户信息
        if (boolean) {
            this._userId = null,
                this._userName = null,
                this._bean = null,
                this._status = null,
                this._isOffline = 0;
        }
        this._betbeishu = null;
        this._isReady = null;
        this._niutype = null;
        this._niulist = null;
        this._iszhuang = false;
        //金币初始化位置
        this.resetGold()
        this.setHandcardFree();
        this.refresh();
    },


    //设置头像
    setHeader() {

    },
    //网络数据刷新  //此次方法必须初始化后才可以使用
    refresh() {
        //刷新姓名，dou，网络状态，庄家  节点显示
        if (this._lblName != null) {
            this._lblName.string = this._userName;
        }

        if (this._lblBean != null) {
            this._lblBean.string = this._bean;
        }
        if (this._userId == 0 || this._userId == null) {
            this.node.active = false;
        } else {
            this.node.active = true
        }
        if (this._zhuang) {
            this._zhuang.active = this._iszhuang;
        }
        if (this.zhuang_tip) {
            this.zhuang_tip.active = this._iszhuang;
        }
        //旁观
        if (this._status == 6) {
            this._obeserver.active = true
        }
        //离线
        if (this._status == 0) {
            this._offline.active = true
        }

        //准备
        if (this._status == 8) {
            this._isReady = 1;
            this._ready.active = true
        }
    },
    /**
     * 
     * @param {name:xxx,bean:111,header:222} user 
     */
    setInfo(user) {
        this._userName = user.name;
        this._bean = parseInt(user.money);
        this._gender = Number(user.gender);
        this._status = user.user_status
        this._handled = Number(user.handled);
        this._niutype = user.niuType
        this._three = user.three
        //set
        // if (user.handCard) {
        //     if (user.handled) {
        //         this.recorveyCard(user.handCard, true);
        //         this.result(user.niuType)

        //     } else(
        //         this.recorveyCard(user.handCard, false)
        //     )
        // }
        this._iszhuang = Number(user.is_banker);
        this.setID(user.id);

        this.setAvader(user.header);
        this.refresh();
    },

    resetGold() {
        var self = this
        if (this._beishu.bg.active) {
            this._beishu.bg.active = false
        }
        this.coinCollection.forEach((gold, index) => {
            gold.active = false;

            gold.setPosition(0, 0);
        })
        if (this._gold) {
            this._gold.active = false;
            this._gold.setPosition(0, 0);
        }

    },
    //可以设置是否,无动画抢庄
    setBanker(value, cb) {
        this._iszhuang = value;
        if (this.zhuang_tip) {
            this.zhuang_tip.active = this._iszhuang
        }
        if (this._zhuang) {
            this._zhuang.active = this._iszhuang;
        }
        if (cb) {
            cb();
        }
    },
    countBean(value) {
        this._bean = Number(this._bean) + Number(value)
        this._lblBean.string = this._bean
    },
    setBean(value) {
        this._bean = value
        this._lblBean.string = this._bean
    },
    /**
     *
     * @param {function} cb 
     */
    setZhuang(cb) {
        var self = this;
        this._iszhuang = true;
        if (this._zhuang) {
            this._zhuang.active = true;
            //变大变小动画结束
            this._zhuang.getComponent(cc.Animation).once('stop', function () {
                self._flashZhuang.active = true;
                let animation = self._flashZhuang.getComponent(cc.Animation)
                animation.play('qzsucess')
                self.scheduleOnce(function () {
                    animation.stop('qzsucess');
                    animation.node.active = false;
                    if (cb) {
                        cb()
                    }
                    if (self.zhuang_tip) {
                        self.zhuang_tip.active = true
                    }
                }, 1)

            })
            this._zhuang.getComponent(cc.Animation).play()
        }
    },
    /**
     * @param {int} isReady  0不准备  1准备
     */
    ready(isReady) {
        this._isReady = isReady;
        if (this._obeserver) {
            this._obeserver.active = false;
        }
        if (this._ready) {
            if (isReady) this._ready.getComponent(cc.Animation).play()
            this._ready.active = this._isReady;
        }
        if (!isReady && this._status == 8) {
            this._status = 1;
        }
    },

    /**
     * @param {string} id 
     */
    setID(id) {
        this._userId = id;
    },
    /**
     * 1是在线  0 离线
     * @param {boolean} isOffline 
     */
    setOnline(isonline) {
        this._status = isonline;
        this._isOffline = !isonline;
        if (this._offline) {
            this._offline.active = this._isOffline;
        }
        if (this._ready.active) {
            this._ready.active = false;
        }
        if (this._obeserver.active) {
            this._obeserver.active = false;
        }
    },
    /**
     * @param {int} value 
     */
    qiangzhuang(value) {
        if (this._qiangzhuang) {
            if (value) {
                this._double.string = '抢';
                this._double.node.active = true;
            } else {
                this._qiangzhuang.string = '不抢'
                this._qiangzhuang.node.active = true;
            }
        }
    },
    qiangzhuangDouble(value) {
        if (this._double) {
            this._double.string = '2倍';
            this._double.node.active = true;
        }
    },

    hideZhuangCatch() {
        if (this._qiangzhuang) {
            this._qiangzhuang.node.active = false;
        }
        if (this.double) {
            this._double.node.active = false;
        }
    },

    /**
     * @param {int} value 
     */

    /**
     * 
     * 正负分
     * @param {int} value 
     */
    score(value,newbean) {
        //坑，美术资源 +- 没打包一起
        if(newbean!=undefined){
            this.setBean(newbean)
        }
        // this.countBean(value)
        if (this._getscore) {
            var win;
            this._getscore.children.forEach((node) => {
                node.active = false
            });
            value >= 0 ? win = this._getscore.getChildByName('winresult') : win = this._getscore.getChildByName('loseresult');
            value = Math.abs(value);
            win.getChildByName('score').getComponent(cc.Label).string = value + '';
            win.active = 1 && (win.parent.active = 1);
            if (win.parent.getComponent(cc.Animation)) {
                win.parent.getComponent(cc.Animation).play()
                // this.scheduleOnce(() => {
                //     win.parent.active = false
                // }, 2)
            }
        }
    },

    //玩家加倍
    double(num) {
        this._betbeishu = num;
        this.setGold(num)
    },

    getUserId() {
        return this._userId
    },
    getUserStatus() {
        return this._status
    },
    setStatus(status) {
        this._status = status;
    },

    restart() {

    },
    /**
     * @param {int} result 
     */
    result(result) {
        var string;
        var json = {
            '无牛': 0,
            '牛一': 1,
            '牛二': 1,
            '牛三': 1,
            '牛四': 1,
            '牛五': 1,
            '牛六': 1,
            '牛七': 2,
            '牛八': 2,
            '牛九': 3,
            '牛牛': 4,
            '顺子牛': 5,
            '同花牛': 5,
            '五花牛': 5,
            '葫芦牛': 6,
            '炸弹牛': 6,
            '五小牛': 8,
        };
        var re = parseInt(result)
        switch (re) {
            case 0:
                string = '无牛';
                this._noniu.active = 1;
                this._noniu.getComponent(cc.Animation).play();
                this._gender ? cc.vv.audio.playSFX('niuniu/niu_0_boy.wav') : cc.vv.audio.playSFX('niuniu/niu_0_girl.wav')

                return;
            case 1:
                string = '牛一';
                break;
            case 2:
                string = '牛二';
                break;
            case 3:
                string = '牛三';
                break;
            case 4:
                string = '牛四';
                break;
            case 5:
                string = '牛五';
                break;
            case 6:
                string = '牛六';
                break;
            case 7:
                string = '牛七';
                break;
            case 8:
                string = '牛八';
                break;
            case 9:
                string = '牛九';
                break;
            case 10:
                string = '牛牛';
                break;
            case 11:
                string = '顺子牛';
                break;
            case 12:
                string = '同花牛';
                break;
            case 13:
                string = '五花牛';
                break;
            case 14:
                string = '葫芦牛';
                break;
            case 15:
                string = '炸弹牛';
                break;
            case 16:
                string = '五小牛';
                break;
        }
        if (re > 9) {
            this._result.color = this._niuColor.highTextColor;
            this._result.getComponent(cc.LabelOutline).color = this._niuColor.highOutlineColor;
        } else {
            this._result.color = this._niuColor.lowTextColor;
            this._result.getComponent(cc.LabelOutline).color = this._niuColor.lowOutlineColor;
        }


        json[string] <= 1 ? this._result.getComponent(cc.Label).string = string : this._result.getComponent(cc.Label).string = string + '×' + json[string];
        this._result.active = 1;
        this._result.getComponent(cc.Animation).play();
        this._gender ? cc.vv.audio.playSFX('niuniu/niu_' + re + '_boy.wav') : cc.vv.audio.playSFX('niuniu/niu_' + re + '_girl.wav')
    },


    /**
     * @param {string} content 
     */
    chat(content) {
        if (this._chatBubble == null) {
            return;
        }
        this._chatBubble.active = true;
        this._chatBubble.getChildByName("msg").getComponent(cc.Label).string = content;
        this._lastChatTime = 2;
    },

    //亮牌
    showCard(data) {

        this.handcard.forEach((card, index) => {
            card.openCard(data.handCard[index])
        })
        this.result(data.niuType)
    },


    emoji(emoji) {
        //emoji = JSON.parse(emoji);
        if (this._emoji == null || this._emoji == null) {
            return;
        }

        this._chatBubble.active = false;
        this._emoji.active = true;
        this._emoji.getComponent(cc.Animation).play(emoji);
        this._lastChatTime = 2;
    },

    voiceMsg(show) {
        if (this._voicemsg) {
            this._voicemsg.active = show;
        }
    },


    update: function (dt) {
        if (this._lastChatTime > 0) {
            this._lastChatTime -= dt;
            if (this._lastChatTime < 0) {
                this._chatBubble.active = false;
                // this._emoji.active = false;
                // this._emoji.getComponent(cc.Animation).stop();
            }
        }
    },
});