var vvCommon = require("vvCommon");
cc.Class({
    extends: vvCommon,

    properties: {
        chang: {
            default: [],
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function () {

    },
    init(){

        /* this.chang.forEach((nodes,index)=>{
         	
         	nodes.children[0].getComponent(cc.Label).string = play[index];
         })*/
    },
    loadingGame(event) {
        cc.vv.game.multiple = parseInt(event.target.name)
        console.log(cc.vv.game.game_id)
        if (cc.vv.game.game_id == 6) {
            cc.vv.socket.send({
                controller_name: "YhtZjhWsService",
                method_name: "makeWRoom"
            }, cc.vv.game)
        } else {
            cc.vv.socket.send({
                controller_name: "YtxScoketService",
                method_name: "hallRoom",
            }, cc.vv.game)
        }
    }
});