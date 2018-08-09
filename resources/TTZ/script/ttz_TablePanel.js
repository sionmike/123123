cc.Class({
    extends: cc.Component,

    properties: {
        buttons: {
            default: [],
            type: cc.Node,
            tooltip:"我的筹码组"
        },
        
        buttonDisableFrame:{
            default:[],
            type:cc.SpriteFrame,
            tooltip:"停止投注"
        },
        buttonEnableFrame:{
            default:[],
            type:cc.SpriteFrame,
            tooltip:"已经投注的筹码"
        },
        coin:{
            default:null,
            type:cc.Prefab,
            tooltip:"筹码"
        },
        myCoin:{
            default:[],
            type:cc.SpriteFrame,
            toolltip:"我的筹码"
        },
        speed: {
            default: 0,
            type: cc.Float,
            tooltip:"硬币移动速度"
        },
        tables:{
            default:[],
            type:cc.Node,
            tooltip:"天门,中门，地门"
        },
        tianmoney:{
            default:null,
            type: cc.Label,
            tooltip:"我的天门金额"
        },
        zhongmoney: {
            default: null,
            type: cc.Label,
            tooltip: "我的中门金额"
        },
        dimoney: {
            default: null,
            type: cc.Label,
            tooltip: "我的地门金额"
        },
        othertianmoney:{
            default:null,
            type: cc.Label,
            tooltip:"他人天门投注金额"
        },
        otherzhongmoney: {
            default: null,
            type: cc.Label,
            tooltip: "他人中门投注金额"
        },
        otherdimoney: {
            default: null,
            type: cc.Label,
            tooltip: "他人地门投注金额"
        },
        usercion:{
            default:null,
            type:cc.Node,
            tooltip:"投注起始位置"
        },
        makers:{
            default:null,
            type:cc.Node,
            tooltipo:"庄家位置"
        },
        palyerlist:{
            default: null,
            type: cc.Node,
            tooltipo: "玩家位置"
        },
        tianwin:{
            default:null,
            type:cc.Node,
            tooltip:"天赢animation"
        },
        zhongwin: {
            default: null,
            type: cc.Node,
            tooltip: "中赢animation"
        },
        diwin: {
            default: null,
            type: cc.Node,
            tooltip: "地赢animation"
        },
        layer: cc.Node,
        _myPoint: null,
    },
    // use this for initialization
    onLoad: function () {
        // 本回合我的投掷数组
        this.mytianmoney = 0;
        this.myzhongmoney = 0;
        this.mydimoney = 0;
        this.otherdimoneynum=0
        this.othertianmoneynum=0;
        this.otherzhongmoneynum=0;
        this.tianarr =new Array();
        this.zhongarr=new Array();
        this.diarr=new Array();
        this.betInfo = {};
        this.canvas = cc.find('Canvas');
        this.initStarPoint();
        this.areaPiont = this.initAreaPont();
        this.touchEventInit();
        var self=this;
        self.mycoinPool();
        self.selected = 0;
        self.initScale = 1;
        self.buttons.forEach(function(node,index){
            node.on('touchend',function(event){
                node.stopAllActions();
                self.selected = index;
                node.runAction(cc.moveTo(0.1, 20, 20))
                self.buttons.map(function(node){
                    if(event.target !=node){
                        node.runAction(cc.moveTo(0.1, 0, 0));
                    }
                })
            },node);
        });
    },
    // cion对象池
    mycoinPool(){
        // 生成筹码的对象池
        this.coinPool = new cc.NodePool();
        let initCoin = 50;
        for (let i = 0; i < initCoin; ++i) {
            let coin = cc.instantiate(this.coin); // 创建节点
            this.coinPool.put(coin); // 通过 putInPool 接口放入对象池
        }
    },
    // 游戏刚进入现实的投注
    gamestartCoin(model){
        var vec = this.creatPlayerBetPoint(model);
        var coin = null;
        if (this.coinPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            coin = this.coinPool.get();
        } else {
            coin = cc.instantiate(this.coin);
        };
        coin.active=true;
        let cointype;
        switch (model.betMoneyType) {
            case 1:
                cointype = 0;
                break
            case 2:
                cointype = 1;
                break
            case 3:
                cointype = 2;
                break
            case 4:
                cointype = 3;
                break
            case 5:
                cointype = 4;
                break
            default:
           
        }
        switch (model.betMoneyType) {
            case 1:
                model.betMoneyType = 10;
                break;
            case 2:
                model.betMoneyType = 50;
                break;
            case 3:
                model.betMoneyType = 100;
                break;
            case 4:
                model.betMoneyType = 500;
                break;
            case 5:
                model.betMoneyType = 1000;
                break;
            default:
                break;
        }
        switch (model.betOddsType) {
            case 1:
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin)
                coin.setLocalZOrder(99);
                coin.setPosition(vec.x,vec.y);
                this.tianarr.push(coin);
                break;
            case 2:
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin)
                coin.setLocalZOrder(99);
                coin.setPosition(vec.x,vec.y);
               
                this.zhongarr.push(coin);
                break;
            case 3:
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin);
                coin.setLocalZOrder(99);
                coin.setPosition(vec.x,vec.y);
                this.diarr.push(coin);
                break;
            default:
                break;
        }
        return coin
    },
    // 其他玩家投注事件
    otnerdrawCoin(model){
        var vec = this.creatPlayerBetPoint(model);
        var coin = null;
        if (this.coinPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            coin = this.coinPool.get();
        } else {
            coin = cc.instantiate(this.coin);
        }
        coin.active=true;
        let cointype;
        switch (model.betMoneyType) {
            case 1:
                cointype = 0;
                break
            case 2:
                cointype = 1;
                break
            case 3:
                cointype = 2;
                break
            case 4:
                cointype = 3;
                break
            case 5:
                cointype = 4;
                break
            default:
            
        }
        // 判断投到那个里
        switch (model.betMoneyType) {
            case 1:
                model.betMoneyType = 10;
                break;
            case 2:
                model.betMoneyType = 50;
                break;
            case 3:
                model.betMoneyType = 100;
                break;
            case 4:
                model.betMoneyType = 500;
                break;
            case 5:
                model.betMoneyType = 1000;
                break;
            default:
                break;
        }
        switch (model.betOddsType) {
            case 1:
                this.othertianmoneynum += model.betMoneyType;
                this.othertianmoney.string = this.othertianmoneynum;
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin)
                coin.setLocalZOrder(1);
                coin.setPosition(this._playerlist);
                this.drawCoinPath(coin, vec);
                this.tianarr.push(coin);
               
                break;
            case 2:
                this.otherzhongmoneynum += model.betMoneyType;
                this.otherzhongmoney.string = this.otherzhongmoneynum;
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin);
                coin.setLocalZOrder(99);
                coin.setPosition(this._playerlist);
                this.drawCoinPath(coin, vec);
                this.zhongarr.push(coin);
             
                break;
            case 3:
                this.otherdimoneynum += model.betMoneyType;
                this.otherdimoney.string = this.otherdimoneynum;
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin);
                coin.setLocalZOrder(99);
                coin.setPosition(this._playerlist);
                this.drawCoinPath(coin, vec);
                this.diarr.push(coin);
                
                break;
            default:
                break;
        }
        return coin

    },
    //我的投币事件
    touchEventInit() {
        var self = this;
        this.tables.map(node => {
            node.on("touchstart", (event) => {
                self.betInfo.betMoneyType = (self.selected == 0 && 10) || (self.selected == 1 && 50) || (self.selected == 2 && 100) || (self.selected == 3 && 500) || (self.selected == 4 && 1000);

                switch (self.betInfo.betMoneyType) {
                    case 10:
                        self.betInfo.betMoneyType=1
                        break;
                    case 50:
                        self.betInfo.betMoneyType=2;
                        break
                    case 100:
                        self.betInfo.betMoneyType = 3;
                        break;
                    case 500:
                        self.betInfo.betMoneyType = 4;
                        break;
                    case 1000:
                        self.betInfo.betMoneyType = 5;
                        break 
                    default:
                        break;
                }
                if (event.target.name === 'tiandiv' && !this.layer.active) {
                    self.betInfo.betOddsType = 1;
                    // 发送投注信息
                    cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "freeBet", data: self.betInfo});
                }
                if (event.target.name === 'zhongdiv' && !this.layer.active) {
                    self.betInfo.betOddsType = 2;
                    cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "freeBet", data: self.betInfo });
                }
                if (event.target.name === 'didiv' && !this.layer.active) {
                    self.betInfo.betOddsType = 3;
                    cc.vv.socket.send({ "controller_name": "TtzWsController", "method_name": "freeBet", data: self.betInfo });
                }

            })
        });
    },
    // 显示那个赢了的动画
    showwin(tian,zhong,di){
        if(tian==2){ 
            let time = 2;
            this.tianwin.active = true;
            let src = function () {
                let tianplay = this.tianwin.getComponent(cc.Animation);
                tianplay.play('ttz_bettian'); 
                time--;
                if (time < 0) {
                    this.unschedule(src, this)
                    this.tianwin.active=false;
                }
            }
            this.schedule(src, 1);
        }
        if(zhong==2){
            let time=2;
            this.zhongwin.active = true;
            let src2 = function () {
                let zhongplay = this.zhongwin.getComponent(cc.Animation);
                zhongplay.play("ttz_betzhong");
                time--;
                if (time < 0) {
                    this.unschedule(src2, this)
                    this.zhongwin.active = false;
                }
            }
            this.schedule(src2, 1);
        }
        if(di ==2){
            let time = 2
            this.diwin.active = true;
            let src3 = function () {
                let diplay = this.diwin.getComponent(cc.Animation);
                diplay.play("ttz_betdi");
                time--;
                if (time < 0) {
                    this.unschedule(src3, this);
                    this.diwin.active=false;
                }
            }
            this.schedule(src3, 1); 
        }
    },
    // 设置选择的Coin
    setButtonDisabled() {
        this.layer.active=true;
        this.buttons.forEach((button, index) => {
            button.getComponent(cc.Sprite).spriteFrame = this.buttonDisableFrame[index];
        })
    },
    layerClike() {
        this.layer.active=true
        this.buttons.forEach((button, index) => {
            button.getComponent(cc.Sprite).spriteFrame = this.buttonDisableFrame[index]
        })
    },
    setButtonEable() {
        this.layer.active=false;
        this.buttons.forEach((button, index) => {
            button.getComponent(cc.Sprite).spriteFrame = this.buttonEnableFrame[index]
        })
    },
        //游戏结束清场
    clearAll() {
        this.mydimoney=0;
        this.mytianmoney=0;
        this.myzhongmoney=0;
        this.tianmoney.string=0;
        this.zhongmoney.string=0;
        this.dimoney.string=0;
        this.otherdimoney.string=0;
        this.otherdimoneynum=0;
        this.othertianmoney.string=0;
        this.othertianmoneynum=0;
        this.otherzhongmoney.string=0;
        this.otherzhongmoneynum=0;
        // if (this.diarr.length>0){
            this.diarr.forEach((node) => {
              
                this.coinPool.put(node)
            })
        // }
        // if (this.tianarr.length>0){
            this.tianarr.forEach((node) => {
             
                this.coinPool.put(node)
            });
        // }
        // if (this.zhongarr.length>0){
            this.zhongarr.forEach((node) => {
      
                this.coinPool.put(node)
            });
        // }
        this.diarr=[];
        this.tianarr=[];
        this.zhongarr=[];
    },
    //生成我的硬币
    drawMyCoin(model) {
        var vec = this.creatPlayerBetPoint(model);
        var coin =null;
 
        if (this.coinPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            coin = this.coinPool.get();
        } else {
            coin = cc.instantiate(this.coin);
        }
        coin.active=true;
        let cointype;
        switch (model.betMoneyType) {
                case 1:
                    cointype = 0;
                    break
                case 2:
                    cointype = 1;
                    break
                case 3:
                    cointype = 2;
                    break
                case 4:
                    cointype = 3;
                    break
                case 5:
                    cointype = 4;
                    break
                default:
          
            }
        switch (model.betMoneyType) {
            case 1:
                model.betMoneyType=10;
               
                break;
            case 2:
                model.betMoneyType = 50;
               
                break;
            case 3:
                model.betMoneyType = 100;
               
                break;
            case 4:
                model.betMoneyType = 500;
                
                break;
            case 5:
                model.betMoneyType = 1000;
                break;
            default:
          
                break;
        }
        switch (model.betOddsType) {
            case 1:
                this.mytianmoney += model.betMoneyType;
                this.tianmoney.string = this.mytianmoney;
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin);
                coin.setLocalZOrder(1);
                coin.setPosition(this._myPoint);
                this.drawCoinPath(coin, vec);
                this.tianarr.push(coin)
               
                break;
            case 2:
                this.myzhongmoney += model.betMoneyType;
                this.zhongmoney.string = this.myzhongmoney;
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin);
                coin.setLocalZOrder(1);
                coin.setPosition(this._myPoint);
                this.drawCoinPath(coin, vec);
                this.zhongarr.push(coin);
                
                break;
            case 3:
                this.mydimoney += model.betMoneyType;
                this.dimoney.string = this.mydimoney;
                coin.getComponent(cc.Sprite).spriteFrame = this.myCoin[cointype];
                this.canvas.addChild(coin);
                coin.setLocalZOrder(1);
                coin.setPosition(this._myPoint);
                this.drawCoinPath(coin, vec);
                this.diarr.push(coin);
                
                break;
            default:
               
                break;
        }
        
       
        return coin
    },
    //生成玩家投币随机坐标
    creatPlayerBetPoint(model) {
      
        var x, y;
        var obj = this.areaPiont;
        let type = parseInt(model.betOddsType);
        switch (type) {
            case 1:
                x = (Math.random() * (obj.tianWidth - obj.coinHeight - 120)) + (obj.tian.x + 80); 
                y = (Math.random() * (obj.allHeight - obj.coinHeight-80)) + (obj.tian.y - obj.allHeight);
                break;        
            case 2:
                x = Math.random() * (obj.zhongWidth - obj.coinHeight-50) + obj.zhong.x+50;
                y = Math.random() * (obj.allHeight - obj.coinHeight-80) + (obj.zhong.y - obj.allHeight);
              
                break;
            case 3:
                x = (Math.random() * (obj.diWidth - obj.coinHeight -100)) + (obj.di.x +50); 
                y = (Math.random() * (obj.allHeight - obj.coinHeight-80)) + (obj.di.y - obj.allHeight);
                break;
        }
        return { x: x, y:y };
    },
    // 返回筹码的位置
    backPlayerBetPoint(){
        var obj = this.areaPiont;
        var seat=[];
        seat.tianx = (Math.random() * (obj.tianWidth - obj.coinHeight - 120)) + (obj.tian.x + 80);
        seat.tiany = (Math.random() * (obj.allHeight - obj.coinHeight - 80)) + (obj.tian.y - obj.allHeight);
        seat.zhongx = Math.random() * (obj.zhongWidth - obj.coinHeight - 50) + obj.zhong.x + 50;
        seat.zhongy = Math.random() * (obj.allHeight - obj.coinHeight - 80) + (obj.zhong.y - obj.allHeight);
        seat.dix = (Math.random() * (obj.diWidth - obj.coinHeight - 100)) + (obj.di.x + 50);
        seat.diy = (Math.random() * (obj.allHeight - obj.coinHeight - 80)) + (obj.di.y - obj.allHeight);
        return seat;
    },
    //硬币运动到坐标位置
    drawCoinPath(coin, vec2) {
        coin.runAction(cc.moveTo(this.speed, vec2.x, vec2.y));
    },
    //获取坐标
    initStarPoint() {
        this._myPoint = this.canvas.convertToNodeSpaceAR(this.usercion.parent.convertToWorldSpaceAR(this.usercion));
        this._playerlist = this.canvas.convertToNodeSpaceAR(this.palyerlist.parent.convertToWorldSpaceAR(this.palyerlist));
       
        this._makers = this.canvas.convertToNodeSpaceAR(this.makers.parent.convertToWorldSpaceAR(this.makers));
    },
    initAreaPont() {
        var Obj = [];
        Obj.coinHeight = this.coin.data.height;
        Obj.tian = this.tables[0].getPosition();
        Obj.zhong = this.tables[1].getPosition();
        Obj.di = this.tables[2].getPosition();
        Obj.allHeight = this.tables[0].height;
        Obj.tianWidth = this.tables[0].width;
        Obj.zhongWidth = this.tables[1].width;
        Obj.diWidth = this.tables[2].width;
        return Obj
    },

    backCoin(tian,zhong,di){
        // tian,di,zhong分别有两种结果1,2，1庄家赢，2，庄家输
        var self=this;
        var newtianarr= new Array();
        var newzhongarr = new Array();
        var newdiarr = new Array();
        if(tian == 1){
            for (let a = 0; a < this.tianarr.length; a++) {
                if (this.tianarr[a]==null){
                    break;
                }
                else{
                    let winaction = cc.sequence(
                        cc.moveTo(1, this._makers.x, this._makers.y),
                        cc.callFunc(() => {
                                self.coinPool.put(self.tianarr[a]);
                        })
                    )
                    this.tianarr[a].runAction(winaction);
                }
                
            };
        }
        if(tian==2){
            for (let b = 0; b < this.tianarr.length; b++) {
                if (this.tianarr[b] == null){
                    break;
                }
                else{
                    let x = cc.instantiate(this.tianarr[b]);
                    x.setLocalZOrder(999);
                    x.setPosition(this._makers);
                    this.canvas.addChild(x)
                    newtianarr.push(x);
                }
            }
            for (let c = 0; c < newtianarr.length; c++){
                if (newtianarr[c] == null) {
                    break;
                }else{
                    var vec = this.backPlayerBetPoint();
                    let loseaction = cc.sequence(
                        cc.moveTo(1, vec.tianx, vec.tiany),
                        cc.callFunc(() => {
                            if (c == newtianarr.length-1){
                                for (let x1 = 0; x1 < self.tianarr.length; x1++) {
                                    self.tianarr[x1].runAction(cc.moveTo(1, self._playerlist.x, self._playerlist.y));
                                }
                            }
                        }),
                        cc.moveTo(1, self._playerlist.x, self._playerlist.y),
                        cc.callFunc(() => {
                            self.coinPool.put(newtianarr[c]);
                            for (let x1 = 0; x1 < self.tianarr.length; x1++) {
                                self.tianarr[x1].active=false;
                            }
                        })
                    )
                    newtianarr[c].runAction(loseaction);
                }
               
            }; 
        }
        if(zhong ==1){
            for (let d = 0;  d< this.zhongarr.length; d++) {
                if (this.zhongarr[d] == null) {
                    break;
                }else{
                    let winaction2 = cc.sequence(
                        cc.moveTo(1, this._makers.x, this._makers.y),
                        cc.callFunc(() => {
                        
                                self.coinPool.put(self.zhongarr[d]);
                           
                        })
                    )
                    this.zhongarr[d].runAction(winaction2);
                }           
            }; 
        }
        if(zhong==2){
            for (let e = 0; e < this.zhongarr.length; e++) {
                if (this.zhongarr[e] == null) {
                    break;
                }else{
                    let y = cc.instantiate(this.zhongarr[i]);
                    y.setLocalZOrder(999);
                    y.setPosition(this._makers);
                    this.canvas.addChild(y)
                    newzhongarr.push(y);
                }
            }
            for (let f = 0; f < newzhongarr.length; f++) {
                if (newzhongarr[f] == "") {
                    break;
                }else{
                    var vec = this.backPlayerBetPoint();
                    let loseaction = cc.sequence(
                        cc.moveTo(1, vec.zhongx, vec.zhongy),
                        cc.callFunc(() => {
                            if (f == newzhongarr.length - 1) {
                                for (var j = 0; j < self.zhongarr.length; j++) {
                                    self.zhongarr[j].runAction(cc.moveTo(1, self._playerlist.x, self._playerlist.y));
                                }
                            }
                            
                        }),
                        cc.moveTo(1, self._playerlist.x, self._playerlist.y),
                        cc.callFunc(() => {
                            self.coinPool.put(newzhongarr[f]);
                            for(var j = 0; j < self.zhongarr.length; j++) {
                            self.zhongarr[j].active=false;
                            }
                        })
                    );
                    newzhongarr[f].runAction(loseaction);
                }
               
            }; 
        }
        if(di == 1){
            for (let k = 0; k < this.diarr.length; k++) {
                if (this.diarr[k] == "") {
                    break;
                }else{
                    let winaction = cc.sequence(
                        cc.moveTo(1, this._makers.x, this._makers.y),
                        cc.callFunc(() => {
                          
                                self.coinPool.put(self.diarr[k]);
                           
                        })
                    );
                    this.diarr[k].runAction(winaction);
                }
                
            }; 
        }
        if(di==2){
            for (let l = 0; l < this.diarr.length; l++) {
                if (this.diarr[l] == null) {
                    break;
                }else{
                    let z = cc.instantiate(this.diarr[l]);
                    z.setLocalZOrder(999);
                    z.setPosition(this._makers);
                    this.canvas.addChild(z)
                    newdiarr.push(z);
                }
               
            }
            for (let m = 0; m < newdiarr.length; m++) {
                if (newdiarr[m] == null) {
                    break;
                }else{
                    var vec = this.backPlayerBetPoint();
                    let loseaction = cc.sequence(
                        cc.moveTo(1, vec.dix, vec.diy),
                        cc.callFunc(() => {
                            if( m == newdiarr.length-1){
                                for (var n = 0; n < self.diarr.length; n++) {
                                    self.diarr[n].runAction(cc.moveTo(1, self._playerlist.x, self._playerlist.y));
                                }
                            }
                            
                        }),
                        cc.moveTo(1, self._playerlist.x, self._playerlist.y),
                        cc.callFunc(() => {
                            self.coinPool.put(newdiarr[m]);
                            for (var n = 0; n < self.diarr.length; n++) {
                                self.diarr[n].active=false;
                            }
                        })
                    )
                    newdiarr[m].runAction(loseaction);
                }
            }; 
        }  
    },
});
