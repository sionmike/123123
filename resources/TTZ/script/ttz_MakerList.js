cc.Class({
    extends: cc.Component,

    properties: {
        makerone:{
            default:null,
            type:cc.Node,
            tooltip:"上庄1000"
        },
        makertwo: {
            default: null,
            type: cc.Node,
            tooltip: "上庄2000"
        },
        makerthree: {
            default: null,
            type: cc.Node,
            tooltip: "上庄3000"
        }
    },
    onLoad: function () {

    },
    addmakerone(){
        cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "addBankerList", money: 1000});
    },
   addmakertwo() {
       cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "addBankerList", money: 2000 });
    },
    addmakerthree() {
        cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "addBankerList", money: 3000 });
    }
});
