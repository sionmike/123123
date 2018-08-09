var vvCommon = require("vvCommon");
cc.Class({
    extends: vvCommon,

    // use this for initialization
    onLoad: function () {

        this.ifhavecookie();

    },
    ifhavecookie() {
        if (cc.sys.isBrowser) {
            if (this.getCookie('bingo') == null) {
                //发送游客注册请求
            } else {
                var re = this.getCookie('bingo');
                cc.vv.io.put("bingo", re);
                cc.vv.http.authorization = this.getCookie("bingo");
                var xhr = cc.vv.http.httpPost("/getUserMsg", {}, this.sucess, this.error, this);
            }
        }
    },
    login: function () {
        this.loadding();
        if (this.getCookie('bingo') == null) {
            //发送游客注册请求
        
            if (cc.sys.isBrowser) {
            
                var xhr = cc.vv.http.httpGet("/IndexController/wechat", this.getcookietologin, this.error, this);

            } else {
                //do 原生 获取 token
            
            }
        } else {
         
            //获取用户登录信息
            this.tologin();

        }


    },
    getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");　　
        return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null;
    },
    sets(result, object) {
        var re = object.getCookie('bingo');
        object.io = require("IOUtils");

        object.io.put("bingo", re);
    },
    getcookietologin(result, object) {

        var re = object.getCookie('bingo');
        object.io.put("bingo", re);
        object.tologin();
    },
    //获取用户登录信息
    tologin() {

        cc.vv.http.authorization = this.getCookie("bingo");
        var xhr = cc.vv.http.httpPost("/getUserMsg", {}, this.sucess, this.error, this);
    },
    sucess(result, object) {

        var data = JSON.parse(result);
   

        if (data != null && data.code == '0') {
            //放在全局变量
            object.resets(data, result);
            //预加载场景
            if (cc.vv.gametype != null && cc.vv.gametype != "") { //只定义了单一游戏类型 ，否则 进入游戏大厅
                object.scene(cc.vv.gametype, object);
            } else {

                object.scene('hall', object);
            }
        }

      
    },
    error: function (object) {
        object.closeloadding(object.loaddingDialog);
        object.alert("网络异常，服务访问失败");
    }



});