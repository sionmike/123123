// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Common = require("vvCommon");

cc.Class({
    extends: Common,

    properties: {

        playerPanel: {
            default: null,
            type: cc.Node,
            tooltip: '用户节点'
        },
        roomnum: {
            default: null,
            type: cc.Label,
            tooltip: '房号label'
        },
        roomround: {
            default: null,
            type: cc.Label,
            tooltip: '回合label'
        },
        roomdifen: {
            default: null,
            type: cc.Label,
            tooltip: '底分label'
        },
        roomwanfa: {
            default: null,
            type: cc.Label,
            tooltip: '玩法label'
        },
        roomtime: {
            default: null,
            type: cc.Label,
            tooltip: '时间label'
        },
        backbtn: {
            default: null,
            type: cc.Node,
            tooltip: '返回大厅'
        },
        sharebtn: {
            default: null,
            type: cc.Node,
            tooltip: '分享'
        },



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

    onLoad() {

    },

    setRoomInfo(roominfo) {
        this.roomtime.string = roominfo.time;
        this.roomround.string = roominfo.round;
        this.roomdifen.string = roominfo.multiple;
        this.roomnum.string = roominfo.room_number;
        let wanfa = roominfo.way
        this.roomwanfa.string = wanfa == 'open' && '明牌抢庄' || wanfa == 'free' && '自由抢庄' || wanfa == 'an' && '通比牛牛'
    },

    getDyjAndHao(list) {
        // let roomown = roomdata.roomown;
        let dayingjia;
        let millionaire;
        let winnermoney = 0;
        let losermoney = 0;
        list.forEach(element => {
            if (element.settle_money >= winnermoney) {
                dayingjia = element.user_id
                winnermoney = Number(element.settle_money)
            }
            if (element.settle_money <= losermoney) {
                millionaire = element.user_id
                losermoney =  Number(element.settle_money)
            }
        });
        return {
            dayingjia,
            millionaire
        }
    },


    historyRenderer(data, roomown) {
        this.setRoomInfo({
            time: data.time,
            round: data.round,
            multiple: data.multiple,
            room_number: data.room_number,
            way: data.way,
            header:data.header
        });
        let DyjAndHao = this.getDyjAndHao(data.settle_data);

        this.setPlayerIterm(data.settle_data, {
            dayingjia: DyjAndHao.dayingjia,
            millionaire: DyjAndHao.millionaire,
            roomown: roomown
        })

    },

    setPlayerIterm(list, opt) {
        var self = this;
        list.forEach((element, index) => {
            cc.loader.loadRes("Cow/Prefab/player-record", function (err, prefab) {
                let player = cc.instantiate(prefab).getComponent('PlayerRecord');
                player.setInfo(element);
                if (element.user_id == opt.dayingjia) {
                    player.setDyj();
                }
                if (element.user_id == opt.millionaire) {
                    player.setMillionaire();
                }
                if (element.user_id == opt.roomown) {
                    player.setRoomOwn();
                }
                player.node.parent = self.playerPanel;

            });
        });
        if (list.length < 6) {
            cc.instantiate("Cow/Prefab/no-one", function (err, perfab) {
                let player = cc.instantiate(prefab);
                player.node.parent = self.playerPanel;
            })
        }
    },

    backToHall() {
        this.scene('hall', this)
    },

    formatDate() {
        var now = new Date()
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
    },

    // update (dt) {},
});