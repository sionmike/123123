cc.Class({
    extends: cc.Component,

    properties: {
        target:cc.Node,
        roominfo:{
        	type:cc.Label,
        	default:[]
        },
        recharge:cc.Prefab,
        exit:cc.Node,
        qipai:cc.Node,
        playerAnchors:{
        	type:cc.Node,
        	default:[]
        },
        playerPrefab:cc.Prefab,
        betcoin:cc.Prefab,
        bettable:cc.Node,
        player:cc.Node,
        de:cc.Button,
        _playerall:[],
        pukes:cc.Prefab,
        pukeanimation:cc.Node,
        _selectedEvent:null,
        pkperson:cc.Prefab,
        qipais:cc.Node
    },

    // use this for initialization
    onLoad: function () {
           this.createdtable();
           
    },
    initroominfo(infos){   	
    	this.roominfo.forEach((item) => {
    		item.string = infos 
    	})
    },
    close(event){
         event.target.parent.active = false;
    },
    exitshow(){
    	this.exit.active = true;
    },
    qipaishow(){
    	this.qipai.active = true;
    },
    chargeshow(){   	 
        var item = cc.instantiate(this.recharge);
        this.node.addChild(item);
    },
    //初始化5张桌子
    createdtable(){
    	 var that = this;
    	 this.playerAnchors.forEach(function (anchor, i) {
            var playerNode = cc.instantiate(that.playerPrefab);
            anchor.addChild(playerNode);
            playerNode.setPosition(-10,-39);
             
            var actorRenderer = playerNode.getComponent('Playerprefab');
            that._playerall.push(actorRenderer);
            
        });
        
    },
    //下注  图片需要换
    bet(){
        var item = cc.instantiate(this.betcoin);
        this.bettable.addChild(item);
        var po = this.getFatherPosition(3);
        item.setPosition(po.x,po.y);
        var vec = this.creatPlayerBetPoint();
        item.runAction(cc.moveTo(0.18, vec.x, vec.y))
    },
    //随机产生码落地位置
    creatPlayerBetPoint(){
        var x, y;        
        x = Math.random() * (380)-190;
        y = Math.random() * (180);       
        return {x: x, y: y};    
     },
     //获取5个人的位置
     getFatherPosition(index){
     	var po = this.playerAnchors[index].getPosition();
     	if(index == 0){    		 
     		po.y += 90;
     	}
     	if(index <=2 && index >0){
     		po.x += 130;
     		po.y -= 45;
     	}
     	if(index >2){
     		po.x -= 130;
     		 
     	} 
     	
     	return po;
     },
     getfatPosition(index){
     	var po = this.playerAnchors[index].getPosition();
     	 po.x +=30;
     	 po.y -=55;
     	
     	return po;
     },
     //清除投注码
     deleted(event){
     	 this.de.interactable = !this.de.interactable;
         
     	 this.bettable.removeAllChildren();
     },
     ready(event){   	
     	event.target.active = false;
     },
     //发牌动画
     run(){
       	for(let i= 0;i<5;i++){
     	  if(i>1){
     	  	 return;
     	  }else{
     	  	 this.schedule(function(){
		     		  for(var j= 0;j<3;j++){
		     		  	 this.schedule(function(){
		     		  	    var item = cc.instantiate.get();
					        this.pukeanimation.addChild(item);
					        var po = this.getfatPosition(i);
					      
					        item.runAction(cc.moveTo(0.6,po.x, po.y))
					        item.runAction(cc.scaleTo(0.7,1,1))
					       
		     		  	  },0.2,1); 
		     		  }
		         },0.1,1);
		    	}         
     	  }
     		 
     },
     //清除发牌的动画与图形
     dett(){
     	this.pukeanimation.removeAllChildren();
     	 
     },
     lookpuke(){
     	
     	 this._playerall[0].lookcard({suit:4,isRedSuit:true,pointName:'10'});
     },
     //比牌
     playerClick(event){
     	  if(this._selectedEvent == null){
     	  	
     	  	 return false;
     	  	 
     	  }else if(this._selectedEvent.name === 'bipai'){
     	  	  for(var index = 0;index<this.playerAnchors.length;index++){
     	  	  	  if(event.target == this.playerAnchors[index]){
     	  	  	  	   this.pkshow();
     	  	  	  	   this._selectedEvent = null;
     	  	  	  }
     	  	  }
     	  	   
     	  }
     	 
     },
      // 比牌按钮
     pk(event){     	
     	     
     	this._selectedEvent = event.target;
      
     },
     //比牌结果展示
     pkshow(){
     	 var item = cc.instantiate(this.pkperson);
     	 item.getComponent('vsPerson').init(1,2);
     	 this.node.addChild(item);
     },
      //弃牌
     qipaiSure(index){    	
          this._playerall[2].paomove('弃牌');
          //向后台传弃牌
          cc.vv.net.send("guo");
     },      
     //开始
     gameStart(){
     	
     }
     
     
});
