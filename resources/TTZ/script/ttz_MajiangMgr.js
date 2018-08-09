var MajiangInfos = require("ttz_MajiangInfo");
cc.Class({
    extends: cc.Component,
    properties: {
        majiang: {
            default: null,
            type: cc.Prefab,
            tooltip: "麻将资源"
        },
        majiangInfo: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: "麻将"
        },
        qishimajiang: {
            default: null,
            type: cc.Prefab,
            tooltip: "起始麻将"
        },
        zhengmajiang:{
            default:null,
            type:cc.Prefab,
            tooltip:"起始正面麻将"
        },
        tianmjnum: {
            default: null,
            type: cc.Label,
            tooltip: "天门点数"
        },
        zhongmjnum: {
            default: null,
            type: cc.Label,
            tooltip: "中门点数"
        },
        dimjnum: {
            default: null,
            type: cc.Label,
            tooltip: "地门点数"
        },
        zhuangmjnum: {
            default: null,
            type: cc.Label,
            tooltip: "庄家点数"
        }
    },
    onLoad: function () {
        this.canvas = cc.find("Canvas");
        this.temporarypos = cc.find("Canvas/temporary");
        this.tianmajiang = cc.find("Canvas/content/center/tiandizhong/tiandiv/tianmajiang");
        this.dimajiang = cc.find("Canvas/content/center/tiandizhong/didiv/dimajiang");
        this.zhongmajiang = cc.find("Canvas/content/center/tiandizhong/zhongdiv/zhongmajiang")
        this.zhuangmajiang = cc.find("Canvas/content/center/tiandizhong/zhuangdiv/zhuangmajiang")
        this.shengyu = cc.find("Canvas/content/center/shengyu");
        this.kaishi = cc.find("Canvas/kaishi");
        this.majiangArray = this.createMaJiangArray();//创建初始数组
        this.tianmajiangArr = [];//天门数组
        this.dimajiangArr = [];//地门数组
        this.zhongmajiangArr = [];//中门数组
        this.zhuangmajiangArr = [];//庄家数组
        this.shengyuarr = [];
        this.kaishiarr = [];
        this.temporaryArrs = [];
        /* 生成麻將对象池  */
        this.createmjpra();
    },
    // 麻将点数
    mjdiannum(data){
        
        if (data.free.top.points<50){
            if ( data.free.top.points%1 ==0.5){
                this.tianmjnum.string = Math.floor(data.free.top.points) + "点半";
            }else{
                this.tianmjnum.string = data.free.top.points + "点";
            }
        }else{
            this.tianmjnum.string = "豹子";
        }
        if (data.free.middle.points < 50) {
            if (data.free.middle.points % 1 == 0.5) {
                this.zhongmjnum.string = Math.floor(data.free.middle.points) + "点半";
            } else {
                this.zhongmjnum.string = data.free.middle.points + "点";
            }
        } else {
            this.zhongmjnum.string = "豹子";
        }
        if (data.free.lower.points < 50) {
            if (data.free.lower.points % 1 == 0.5) {
                this.dimjnum.string = Math.floor(data.free.lower.points) + "点半";
            } else {
                this.dimjnum.string = data.free.lower.points + "点";
            }
        } else {
            this.dimjnum.string = "豹子";
        }
        if (data.banker.points < 50) {
            if (data.banker.points % 1 == 0.5) {
                this.zhuangmjnum.string = Math.floor(data.banker.points) + "点半";
            } else {
                this.zhuangmjnum.string = data.banker.points + "点";
            }
        } else {
            this.zhuangmjnum.string = "豹子";
        }
    },
    // 生成麻将对象池
    createmjpra() {
        this.majiangPool = new cc.NodePool();
        this.qsmajiangPool = new cc.NodePool();
        this.wmajiangPool =new cc.NodePool();
        for (let i = 0; i < 40; i++) {
            let majiang = cc.instantiate(this.majiang);
            this.majiangPool.put(majiang);

            let oneqsmajiang = cc.instantiate(this.qishimajiang);
            this.qsmajiangPool.put(oneqsmajiang);

            let wmajiang = cc.instantiate(this.zhengmajiang);
            this.wmajiangPool.put(wmajiang);
        }
    },
    //生成带背面的麻将，用于状态等于20的情况下使用
    getmajiangs(data) {
        var self = this;
        this._shengyu = this.shengyu.convertToNodeSpaceAR(this.canvas.convertToWorldSpaceAR(this.shengyu));
        this._kaishi = this.shengyu.convertToNodeSpaceAR(this.canvas.convertToWorldSpaceAR(this.kaishi));
        this._temporarypos = this.shengyu.convertToNodeSpaceAR(this.canvas.convertToWorldSpaceAR(this.temporarypos));
        this._tianmajiang = this.shengyu.convertToNodeSpaceAR(this.tianmajiang.parent.convertToWorldSpaceAR(this.tianmajiang));
        this._zhongmajiang = this.shengyu.convertToNodeSpaceAR(this.zhongmajiang.parent.convertToWorldSpaceAR(this.zhongmajiang));
        this._dimajiang = this.shengyu.convertToNodeSpaceAR(this.dimajiang.parent.convertToWorldSpaceAR(this.dimajiang));
        this._zhuangmajiang = this.shengyu.convertToNodeSpaceAR(this.zhuangmajiang.parent.convertToWorldSpaceAR(this.zhuangmajiang));
        var num = 0;
        var kaishinum = 0;
        for (let i = 0; i < 20; i++) {
            num = num +16;
            let onemajiang = null;
            if (this.qsmajiangPool.size() > 0) {
                onemajiang = this.qsmajiangPool.get();
            } else {
                onemajiang = cc.instantiate(this.qishimajiang);
            }
            onemajiang.setPosition(this._shengyu.x + num, this._shengyu.y)
            this.shengyu.addChild(onemajiang);
            this.shengyuarr.push(onemajiang);
        }
        for (let i = this.shengyuarr.length - 1; i > this.shengyuarr.length - 5; i--) {
            kaishinum += 100;
            var movekaishi = cc.sequence(
                cc.moveTo(1, this._kaishi.x, this._kaishi.y),
                cc.moveTo(1, this._temporarypos.x + kaishinum, this._temporarypos.y),
               
                cc.callFunc(()=>{
                    self.shengyuarr[i].setScale(1);
                    // self.shengyuarr.splice(i, 1);
                    
                    if(i == self.shengyuarr.length-4){
                        self.kaishiarr[0].runAction(
                            cc.sequence(cc.moveTo(1, self._tianmajiang.x, self._tianmajiang.y),
                            cc.callFunc(()=>{
                                self.kaishiarr[0].setScale(0.3,0.3);
                                self.qsmajiangPool.put(self.kaishiarr[0]);
                                for (let i = 0; i < data.free.top.cards.length;i++){
                                    self.tianmajiangArr.push(self.majiangArray[data.free.top.cards[i]-1]);
                                }
                                self.gettianmajiang(data.free.top.cards.length);
                            })
                        ));
                        self.kaishiarr[1].runAction(
                            cc.sequence(
                                cc.moveTo(1, self._zhongmajiang.x, self._zhongmajiang.y),
                                cc.callFunc(()=>{
                                    self.kaishiarr[1].setScale(0.3, 0.3);
                                    self.qsmajiangPool.put(self.kaishiarr[1]);
                                    for (let i = 0; i < data.free.middle.cards.length;i++){
                                        self.zhongmajiangArr.push(self.majiangArray[data.free.middle.cards[i]-1]);
                                    }
                                    self.getzhongmajiang(data.free.middle.cards.length);
                                    
                                })
                            ));
                        self.kaishiarr[2].runAction(
                            cc.sequence(
                                cc.moveTo(1, self._dimajiang.x, self._dimajiang.y),
                                cc.callFunc(()=>{
                                    self.kaishiarr[2].setScale(0.3, 0.3);
                                    self.qsmajiangPool.put(self.kaishiarr[2]);
                                    for (let i = 0; i < data.free.lower.cards.length;i++){
                                        self.dimajiangArr.push(self.majiangArray[data.free.lower.cards[i]-1])
                                    }
                                    self.getdimajiang(data.free.lower.cards.length);
                                    
                                })
                            ));
                        self.kaishiarr[3].runAction(
                            cc.sequence(
                                cc.moveTo(1, self._zhuangmajiang.x, self._zhuangmajiang.y),
                                cc.callFunc(()=>{
                                    self.kaishiarr[3].setScale(0.3, 0.3);
                                    self.qsmajiangPool.put(self.kaishiarr[3]);
                                    for (let i = 0; i < data.banker.cards.length;i++){
                                        self.zhuangmajiangArr.push(self.majiangArray[data.banker.cards[i]-1])
                                    }
                                    self.getzhuangmajiang(data.banker.cards.length);
                                }) 
                            ));
                    }
                }),
            );
            this.shengyuarr[i].runAction(movekaishi);
            this.kaishiarr.push(this.shengyuarr[i]);
        }
    },
    // 创建不带背面的麻将
    wtianmj(data){
        for (let i = 0; i < data.game_info.points.banker.length;i++){
            this.createwmj(this.zhuangmajiang, data.game_info.points.banker, this.majiangInfo, i);
        }
        for (let i = 0; i < data.game_info.points.free.top.length; i++) {
            this.createwmj(this.tianmajiang, data.game_info.points.free.top, this.majiangInfo, i);
        }
        for (let i = 0; i < data.game_info.points.free.middle.length; i++) {
            this.createwmj(this.zhongmajiang, data.game_info.points.free.middle, this.majiangInfo, i);
        }
        for (let i = 0; i < data.game_info.points.free.lower.length; i++) {
            this.createwmj(this.dimajiang, data.game_info.points.free.lower, this.majiangInfo,i);
        }
      
    },
    createwmj(parent, content,atlas, i){
            let j = content[i]-1;
            let wmajiang = null;
            if (this.wmajiangPool.size() > 0) {
                wmajiang = this.wmajiangPool.get();
            } else {
                wmajiang = cc.instantiate(this.zhengmajiang);
            };
            var frame = atlas.getSpriteFrame(j);
            wmajiang.getComponent(cc.Sprite).spriteFrame = frame;
            parent.addChild(wmajiang);
    },
    //创建初始牌组
    createMaJiangArray() {
        var array = [
             "1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "7筒", "8筒", "9筒", "白"
        ];
        return array;
    },
    gettianmajiang: function (num) {
        
        var self = this;
        for (var i = 0; i < num; i++) {
            var str = MajiangInfos.majiang[self.tianmajiangArr[i]];
            self.addOneMajiang(str, self.tianmajiang, self.majiangInfo, i);
        }
    },
    getzhongmajiang: function (num) {
        var self = this;
        for (var i = 0; i < num; i++) {
            var str = MajiangInfos.majiang[self.zhongmajiangArr[i]];
            self.addOneMajiang(str, self.zhongmajiang, self.majiangInfo, i);
        }
    },
    getdimajiang: function (num) {
        var self = this;
        for (var i = 0; i < num; i++) {
            var str = MajiangInfos.majiang[self.dimajiangArr[i]];
            self.addOneMajiang(str, self.dimajiang, self.majiangInfo, i);
        }
    },
    getzhuangmajiang: function (num) {
        var self = this;
        for (var i = 0; i < num; i++) {
            var str = MajiangInfos.majiang[self.zhuangmajiangArr[i]];
            self.addOneMajiang(str, self.zhuangmajiang, self.majiangInfo, i);
        }
    },

    //根据麻将的tag，将麻将排序
    // sortMajiangs(array) {
    //     console.log(array)
    //     var self = this;
    //     array.sort(self.sortByTag);
    // },
    // //排序方法tag升序
    // sortByTag(a, b) {
      
    //     var aa = MajiangInfos.majiangTag[a];
    //     var bb = MajiangInfos.majiangTag[b];
    //     console.log(aa,bb)
    //     return bb - aa;
    // },
    // 生成具体的麻将
    addOneMajiang(str, layout, atlas, tag) {
        var self = this;
        var quanmajiang = null;
        if (this.majiangPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            quanmajiang = this.majiangPool.get();
        } else {
            quanmajiang = cc.instantiate(self.majiang);
        }
        var frame = atlas.getSpriteFrame(str);
        quanmajiang.children[0].getComponent(cc.Sprite).spriteFrame = frame;

        if (tag != undefined) {
            quanmajiang.children[0].tag = tag;
            quanmajiang.children[0].name = str;
        }
        layout.addChild(quanmajiang);
    },
    clearAll(){
        // this.majiang.children[0].active = false;
        // this.majiang.children[0].scaleX = 1;
        // this.majiang.children[1].active = true;
        // this.majiangPool.put(this.majiang);
        this.kaishi.removeAllChildren(true);
        this.shengyu.removeAllChildren(true);
        this.tianmajiang.removeAllChildren(true);
        this.zhongmajiang.removeAllChildren(true);
        this.dimajiang.removeAllChildren(true);
        this.zhuangmajiang.removeAllChildren(true);
        this.dimjnum.string="";
        this.tianmjnum.string="";
        this.zhongmjnum.string="";
        this.zhuangmjnum.string ="";
        this.tianmajiangArr = [];
        this.dimajiangArr = [];
        this.zhongmajiangArr = [];
        this.zhuangmajiangArr = [];
        this.shengyuarr = [];
        this.kaishiarr = [];
        this.temporaryArrs = [];
    }
});
