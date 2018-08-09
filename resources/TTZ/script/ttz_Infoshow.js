
cc.Class({
    extends: cc.Component,

    properties: {
        makerlist: {
            default: null,
            type: cc.Node,
            tooltip: "庒家列表信息"
        },
        trendlist: {
            default: null,
            type: cc.Node,
            tooltip: "走势列表"
        },
        playerlist: {
            default: null,
            type: cc.Node,
            tooltip: "在线玩家列表"
        },
        makeritem: {
            default: null,
            type: cc.Prefab,
            tooltip: "庄家预制"
        },
        trenditem: {
            default: null,
            type: cc.Prefab,
            tooltip: "走势预制"
        },
        playeritem: {
            default: null,
            type: cc.Prefab,
            tooltip: "玩家预制"
        },
        

    },

    // use this for initialization
    onLoad: function () {
        this.makerPool = new cc.NodePool();
        this.trendPool =new cc.NodePool();
        this.playerPool = new cc.NodePool();
        for (let i = 0; i < 40; i++) {
            let makerNode = cc.instantiate(this.makeritem);
            this.makerPool.put(makerNode);

            let trendNode = cc.instantiate(this.trenditem);
            this.trendPool.put(trendNode);

            let playerNode = cc.instantiate(this.playeritem);
            this.playerPool.put(playerNode);
        }
        // for(let i=0;i<20;i++){
        //     this.addmakerlist(i)
        // }
    },
    addmakerlist(list,i){
        if (this.makerPool.size() > 0) {
            var makerNode = this.makerPool.get();
        } else {
            var makerNode = cc.instantiate(this.makeritem);
        };
        this.makerlist.addChild(makerNode);
        this.makerlist.getComponent(cc.Widget).top=0;
        makerNode.getComponent(cc.Component).refresh(list,i);
       
    },
    addtrendlist(list) {
        if (this.trendPool.size() > 0) {
            var trendNode = this.trendPool.get();
        } else {
            var trendNode = cc.instantiate(this.trenditem);
        };
        this.trendlist.addChild(trendNode);
        trendNode.getComponent(cc.Component).refresh(list);
    },
    addplayerlist(list) {
        if (this.playerPool.size() > 0) {
            var playerNode = this.playerPool.get();
        } else {
            var playerNode = cc.instantiate(this.playeritem);
        };
        this.playerlist.addChild(playerNode);
        this.playerlist.getComponent(cc.Widget).top=0;
        playerNode.getComponent(cc.Component).playerrefresh(list);
    }
});
