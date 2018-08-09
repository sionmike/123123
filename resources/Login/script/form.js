var vvCommon = require("vvCommon");

cc.Class({
	extends: vvCommon,
	properties: {
		username: cc.EditBox,
		password: cc.EditBox,
		checkbox: cc.Toggle,
		clock: cc.Label,
		clocknode: cc.Node,
		userform: cc.Node,
		_remeber: cc.Boolean,
	},
	onLoad: function () {
		this._remeber = cc.vv.io.get('isRemeber')
		if (cc.sys.isBrowser) {
			this.quickLogin()
		}
	},
	quickLogin() {
		var loctoken = cc.vv.io.get('bingo')
		var token;
		var isLogin;
		if (cc.sys.isBrowser) {
			let getCookie = function (name) {
				var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");　　
				return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
			}
			var cookies = getCookie('bingo');
			if (cookies == null && loctoken == null) {
				isLogin = 0;
				//未登录
			}
			if (loctoken != null && cookies == null) {
				isLogin = 2
				//非第三方登陆，本地有数据
			}
			if (cookies != null) {
				isLogin = 3
				//第三方登陆  cookies
			}

			if (isLogin == 0) {
				this.userform.active = true;
				//显示登陆界面
				return
			}
			if (isLogin == 2) {
				token = loctoken
			}
			if (isLogin == 3) {
				token = cookies
			}
		}

		if (cc.sys.isNative) {
			if (loctoken == null) {
				isLogin = 0;
				//未登录
			}
			if (loctoken != null) {
				isLogin = 2
				//本地有token
			}

			if (isLogin == 0) {
				this.userform.active = true;
				//显示登陆界面
				return
			}
			if (isLogin == 2) {
				token = loctoken
			}
		}

		cc.vv.http.authorization = token
		var xhr = cc.vv.http.httpPost("/getUserMsg", {}, this.sucess, this.error, this);
	},

	getcode() {
		if (!this.username.string == "" && (/^1[123457890]\d{9}$/.test(this.username.string))) {
			let self = this;
			var gameTimer = require("GameTimer");
			this.vvtimer = new gameTimer();
			this.clocknode.getComponent(cc.Button).interactable = 0;
			this.timesrc = this.vvtimer.runtimer(this, this.clocknode, this.clock, 60);
			cc.vv.http.httpPost('/sendRegisterVerifyCode', {
				tel: this.username.string
			}, function (e) {
				//支付成功回调\
				let data
				try {
					data = JSON.parse(e)
				} catch (e) {
					self.layered(data)
				}
				if (data.errCode == 0) {
					// self.setCard(data.data.room_card_count)
					// self.setBean(data.data.money)
				}
				self.layered(data.errMsg)
			}, function (e) {
				self.layered('未知错误')
			}, this)
		} else {
			if (cc.vv.layers.size() > 0) {

				this.layered('请填写正确号码');
			}
		}

	},
	submit() {
		if (!this.username.string == "" && !this.password.string == "" && this.checkbox.isChecked == true && (/^1[123457890]\d{9}$/.test(this.username.string))) {
			//this._prefab.destroy();
			// var xhr = cc.vv.http.httpPost("/IndexController/wechat",{mobile:this.username.string , password:this.password.string},this.sucess , this.error , this);
			var xhr = cc.vv.http.httpPost("/userLogin", {
				tel: this.username.string,
				msg: this.password.string
			}, this.getUserInfo.bind(this), this.error.bind(this), this);
		} else {
			this.layered('请填写正确信息');
		}
	},
	getUserInfo(result, object) {
		let data
		try {
			data = JSON.parse(result);
		} catch (e) {
			this.layered(data);
			object.userform.active = true;
			return
		}
		if (data.errCode == 0) {
			cc.vv.io.put('bingo', data.data);
			cc.vv.http.authorization = data.data;
			cc.vv.http.httpPost("/getUserMsg", {}, this.sucess.bind(this), this.error.bind(this), this);
		}
		if (data.errCode == 1) {
			this.layered(data.errMsg);
		}
	},
	guest(result, object) {

	},
	sucess(result, object) {
		let data
		try {
			data = JSON.parse(result)
		} catch (e) {
			object.userform.active = true;
		}
		console.log(result)
		if (data != null && data.code == 0) {
			//放在全局变量
			object.resets(data, result);
			cc.vv.gamestatus = data.data.gamestatus;

			/**
			 * 登录成功后即创建Socket链接
			 */
			object.connect();
			//预加载场景
			if (cc.vv.gametype != null && cc.vv.gametype != "") { //只定义了单一游戏类型 ，否则 进入游戏大厅
				object.scene(cc.vv.gametype, object);
			} else {
				/**
				 * 大厅
				 */
				if (cc.vv) {
					object.loadding();
				}
				cc.director.preloadScene("hall", function () {
					if (cc.vv) {
						object.closeloadding()
					}
					if (cc.vv.status != "playing") {

						cc.director.loadScene("hall");
					}
				});
			}
		}
		if (data.code == 1) {
			object.layered(data.info)
			object.userform.active = true;
		}
	},

	error(object) {
		object.layered("未知错误");
		object.userform.acitve = true;
	},

	checkUpdate() {
		var context = this;
		var android_version;
		var ios_version;

		var androidUpdateCallback = (e) => {
			let data = JSON.parse(e);
			if (data.type==1) {
				context.makesure({
					message: "请下载最新版本",
					ok: () => {
						jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downloadFromUrl", "(Ljava/lang/String;)V", "https://app.200le.com");
					},
					cancel: () => {
						cc.game.end()
					}
				}, context)
			}

			if (data.type==0) {
				context.quickLogin();
			}

		}
		var iosUpdateCallback = (e) => {
			let data = JSON.parse(e);
			if (data.type==1) {

				jsb.reflection.callStaticMethod("CXHY_Share",
					"Prompt_update_Text:andUrl:andType:",
					data.info+"",
					data.url+"",
					data.is_force+""
				);


			}
			if (data.type==0) {
				context.quickLogin();
			}

		}

		if (cc.sys.os == cc.sys.OS_IOS) {
			ios_version =jsb.reflection.callStaticMethod("CXHY_Share",
				"Obtain_version:",
				"123"
			);
			if(ios_version==null){
				context.makesure({
					message: "请下载最新版本",
					ok: () => {
						
					},
					cancel: () => {
						cc.game.end()
					}
				}, context)
				return
			}
			cc.vv.http.httpPost("/api/versionUpdate", {
				version: ios_version,
				os:"IOS"
			}, iosUpdateCallback, () => {}, this, "https://hapi.200le.com")
		}
		if (cc.sys.platform == cc.sys.ANDROID) {
			android_version = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getVersionName", "()Ljava/lang/String;");
			if(android_version==null){
				context.makesure({
					message: "请下载最新版本",
					ok: () => {
						jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downloadFromUrl", "(Ljava/lang/String;)V", "https://app.200le.com");
					},
					cancel: () => {
						cc.game.end()
					}
				}, context)
			};
			cc.vv.http.httpPost("/api/versionUpdate", {
				version: android_version,
				os:"Android"
			}, androidUpdateCallback, () => {}, this, "https://hapi.200le.com")
		}
	}

});