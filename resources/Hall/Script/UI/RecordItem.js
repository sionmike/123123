cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,        
        time: cc.Label,
        card:cc.Prefab,
       
        cardlist:{
        	default: [],
            type:cc.Node
        }
               
       
    },

    // use this for initialization
    init: function (playerInfo) {
    	 
    	var list = cc.find('center/list',this.node)
         this.title = "牛牛";
         this.time.string = '2017-09-11  10:12'
         
         list.children.forEach((item) => {
         	
         	 item.children.forEach((p,index) => {
          	  	  if(p.getComponent('cc.Label')){
          	  	  	
          	  	  	 p.getComponent('cc.Label').string = 'haha';
          	  	  }
          	  	  else{
          	  	  	for(var j = 0; j < 6; ++j){
		         		var item = cc.instantiate(this.card); 
		         		item.getComponent('Card').init({suit:4,isRedSuit:true,pointName:'J'});
		                this.cardlist[j].addChild(item);
		         	}
          	  	  }
          	  	  
          	  })
         	
         	
         })
          
    },

    // called every frame
    update: function (dt) {

    },
});
