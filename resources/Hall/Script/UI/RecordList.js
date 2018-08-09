const players = require('playdata').players;


cc.Class({
    extends: cc.Component,

    properties: {
        
        recordItems:cc.Prefab,
        recordNiuItem:cc.Prefab,
        recordScrollView:cc.ScrollView,
        rankCount: 0
    },

    // use this for initialization
    onLoad: function () { 
     
        this.content  = this.recordScrollView.content;      
      
        // this.recordList();
        
        
    },

    
    recordList(){
    	 
    	 for (var i = 0; i < this.rankCount; ++i) {
             var playerInfo = players[i]; 
             
             //var item = cc.instantiate(this.recordItems); 
             
             //item.getComponent('RecordcardsItem').init(playerInfo);
             //this.content.addChild(item);
             var item = cc.instantiate(this.recordNiuItem); 
             
             item.getComponent('RecordItem').init(playerInfo);
             this.content.addChild(item);
        }
    },
    // called every frame
    update: function (dt) {

    },
});
