 
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab,
        rank:cc.Node,
        rankCount: 0
    },

    // use this for initialization
    onLoad: function () { 
    	 
    	 this.content = this.scrollView.content;
          
    },
    showrank(){
     
        this.rank.active = true;
        var xhr = cc.vv.http.httpPost("/getMoneyRank",{},this.success,this.error, this); 
    },  
    success(result, object){
    	  var players = [];
    	  var data =JSON.parse(result);
         if (data != null && data.code == '0'){
             players = data.data;
             object.content.removeAllChildren(); 
            for (var i = 0; i <players.length; ++i) {
                var playerInfo = players[i]; 
            	 
            	var item = cc.instantiate(object.prefabRankItem);
                item.getComponent('RankListItem').init(i, playerInfo);
                object.content.addChild(item);
             }
              object.scrollView.scrollToTop(0.01);  
          }
       
    },
    error: function (object) {
        object.closeloadding(object.loaddingDialog);
        object.alert("网络异常，服务访问失败");
    },
    populateList(object) {
        for (var i = 0; i <object.players.length; ++i) {
             var playerInfo =  object.players[i];
             var item = cc.instantiate(object.prefabRankItem);
             item.getComponent('RankListItem').init(i, playerInfo);
            object.content.addChild(item);
        }
    },
    
    // called every frame
    update: function (dt) {

    },
});
