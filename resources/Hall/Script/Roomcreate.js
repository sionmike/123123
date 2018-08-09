cc.Class({
	extends: cc.Component,

	properties: {
		target: cc.Node,
		create: cc.Node,
		join: cc.Node,
		numbers: cc.Node,
		num: cc.Prefab,
		buttons: cc.Node,
		resetss: cc.Node,
		deletes: cc.Node,
		allradios: {
			type: cc.Node,
			default: []
		},
		niufang: cc.Node,
		zjhfang: cc.Node,
		roomwarn: cc.Label,
		creat: cc.Node,
		_sifang: 1,
		_wanfa: 'open',
		_difen: 50
	},

	// use this for initialization
	onLoad: function () {
		this.chess = [];
		this.currentinfo = {
			6: "open",
			4: "open",
			5: "free",
		}
		cc.view.enableAutoFullScreen()
		this.buttons.children.forEach((item) => {
			this.initButtonHandler(item);
		})
		this.initButtonHandler(this.deletes);
		this.initButtonHandler(this.resetss);
		this.initButtonHandler(this.creat);

		this.allradios.forEach((node, index) => {
			this.allradios[index].children.forEach((obeject) => {
				this.initradioHandle(obeject);
			});
		})
		this._sifang = 4;
		this._wanfa = 'open';
		this._sanwanfa = '';
		this._difen = 50;
		this._zjhdifen = 10;

		/* this.allradios.forEach((item) => {
    		
    		 item.children.forEach((index) => {
    		
    		  this.initradioHandle(index);
    	   });
    		 
    		 
    	})*/
	},
	//打开创建房间dialog
	showcreate() {
		this.create.active = true;
	},
	//打开加入房间dialog
	showjoin() {
		this.join.active = true;
	},
	initButtonHandler(btn) {
		cc.vv.utils.addClickEvent(btn, this.node, "Roomcreate", "onBtnClicked");
	},
	initradioHandle(btn) {
		cc.vv.utils.addToggleEvent(btn, this.node, "Roomcreate", "oncheckClicked");
	},
	//键盘显示数字
	roomnumber(index) {
		if (this.numbers.childrenCount >= 6) {
			return false
		} else {
			var item = cc.instantiate(this.num);
			item.getComponent(cc.Label).string = index;
			this.numbers.addChild(item);
			if (this.numbers.childrenCount == 6) {
				let num = ''
				for (let i = 0; i < this.numbers.childrenCount; i++) {
					num += this.numbers.children[i].getComponent(cc.Label).string
				}
				cc.vv.socket.send({
					controller_name: "YtxScoketService",
					method_name: "joinCardRoom"
				}, {
					number: num,
				})

				return false
			}
		}
	},
	//数字重置
	resets() {
		this.numbers.removeAllChildren();
	},
	//数字删除
	deleted() {
		var index = this.numbers.childrenCount - 1
		if (index >= 0) {
			this.numbers.children[index].removeFromParent()
		}
	},
	stringadd() {
		this.chess = [];
		this.allradios.forEach((item) => {
			if (item.active === true) {


				item.children.forEach((index) => {

					if (index.getComponent(cc.Toggle).isChecked == true) {

						if (index.getChildByName('text').getComponent(cc.Label)) {

							this.chess.push(index.getChildByName('text').getComponent(cc.Label).string);
						} else {
							var s = index.getChildByName('text').getChildByName('edit').getComponent(cc.EditBox).string;
							if (s == '') {
								return false;
							} else {
								this.chess.push(s)
							}
						}

					}
				});

			}
		})
	},
	//创建房间
	created() {
		this.stringadd();
		if (this.chess.length == 2) {

		} else {

		}


	},
	//展示牛牛 拼三张选项
	showmethod(index) {
		if (index == 1) {
			cc.find('content/method2', this.target).active = false;
			cc.find('content/method', this.target).active = false;
			cc.find('content/method3', this.target).active = true;
		} else if (index == 2) {
			cc.find('content/method2', this.target).active = false;
			cc.find('content/method', this.target).active = true;
			cc.find('content/method3', this.target).active = false;
		} else if (index == 3) {
			cc.find('content/method2', this.target).active = true;
			cc.find('content/method', this.target).active = false;
			cc.find('content/method3', this.target).active = false;
		}
	},
	setsifang(event) {
		let string = event.target.getChildByName('text').getComponent(cc.Label).string
		this._sifang = string == '拼三张' && 6 || string == '牛牛' && 4 || string == '推筒子' && 5;
		if (this._sifang == 4 || this._sifang == 5) {
			this.niufang.active = true
			this.zjhfang.active = false
		}
		if (this._sifang == 6) {
			this.niufang.active = false
			this.zjhfang.active = true
		}
	},
	setwanfa(event) {
		let string = event.target.getChildByName('text').getComponent(cc.Label).string
		if (this._sifang == 5) {
			this.currentinfo[this._sifang] = string == '抢庄玩法' && 'free' || string == '通比玩法' && 'an'
		}
		if (this._sifang == 4) {
			this.currentinfo[this._sifang] = string == '明牌抢庄' && 'open' || string == '自由抢庄' && 'free' || string == '通比牛牛' && 'an'
		}
		if (this._sifang == 6) {
			this.currentinfo[this._sifang] = string == '普通玩法' && 'open' || string == '欢乐玩法' && 'an'
		}
	},
	setdifen(event) {
		// console.log(event.target)
		
		if (this._sifang == 6) {
			this._zjhdifen = event.target.getChildByName('text').getComponent(cc.Label).string;
		}else{
			this._difen = event.target.getChildByName('text').getComponent(cc.Label).string;
		}
		console.log(this._difen,this._zjhdifen )
		this.roomwarn.string = '注：星豆数量须大于' + this._difen + '0'
	},
	getRoomInfo() {
		return {
			way: this.currentinfo[this._sifang],
			multiple: this._sifang == 6 ?this._zjhdifen : this._difen,
			game_id: this._sifang
		}
	},
	//toggle 
	oncheckClicked(event) {
		switch (event.target.name) {
			case 'niu':
				this.setsifang(event);
				this.showmethod(1);
				break;
			case 'three':
				this.showmethod(2);
				this.setsifang(event);
				break;
			case 'ttz':
				this.showmethod(3);
				this.setsifang(event);
				break;
			case '1':
				this.setwanfa(event);
				break;
			case '2':
				this.setwanfa(event);
				break;
			case '3':
				this.setwanfa(event);
				break;
			case '4':
				this.setwanfa(event);
				break;
			case '5':
				this.setwanfa(event);
				break;
		}
		if (parseInt(event.target.name) >= 10) {
			this.setdifen(event)
		}
	},
	//点击
	onBtnClicked(event) {
		switch (event.target.name) {
			case '1':
				this.roomnumber(1);
				break;
			case '2':
				this.roomnumber(2);
				break;
			case '3':
				this.roomnumber(3);
				break;
			case '4':
				this.roomnumber(4);
				break;
			case '5':
				this.roomnumber(5);
				break;
			case '6':
				this.roomnumber(6);
				break;
			case '7':
				this.roomnumber(7);
				break;
			case '8':
				this.roomnumber(8);
				break;
			case '9':
				this.roomnumber(9);
				break;
			case '0':
				this.roomnumber(0);
				break;
			case 'reset':
				this.resets();
				break;
			case 'delete':
				this.deleted();
				break;
			case 'createbutton':
				this.created();
				break;
		}
	},
	onCreatRoomBtnClick() {
		let roominfo = this.getRoomInfo();

		if (roominfo.game_id != 6) {
			cc.vv.socket.send({
				controller_name: "YtxScoketService",
				method_name: "makeCardRoom"
			}, roominfo)
		}
		if (roominfo.game_id == 6) {
			cc.vv.socket.send({
				controller_name: "YhtZjhWsService",
				method_name: "makeCardRoom"
			}, roominfo)
		}
	}
});