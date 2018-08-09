cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        
        time: cc.Label 
               
       
    },

    // use this for initialization
    init: function (playerInfo) {
    	 
    	var list = cc.find('center/list',this.node)
         this.title = "牛牛";
         this.time.string = '2017-09-11  10:12'
         list.children.forEach((item) => {
         	  
          	  item.children.slice(0,2).forEach((p,index) => {
          	  	  
          	  	  p.getComponent('cc.Label').string = 'haha';
          	  })
          	  
         })
        
    },

    // called every frame
    update: function (dt) {

    },
});
