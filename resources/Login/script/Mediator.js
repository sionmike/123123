// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var registerScript=require("register")
cc.Class({
    extends: cc.Component,

    properties: {
        form: cc.Node,
        register: cc.Node,
        registerscript:registerScript
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
    onRegisterClick(event) {
        var self=this;
        this.register.active=true;
        this.form.getComponent(cc.Animation).play("login_out");
        this.register.getComponent(cc.Animation).once("stop",function(){
            self.form.active=false
        })
        this.register.getComponent(cc.Animation).play("register_in");

    },
    onLoginBackClick(event) {
        var self=this;
        this.form.active=true;
        this.form.getComponent(cc.Animation).play("login_in");
        this.register.getComponent(cc.Animation).once("stop",function(){
            self.register.active=false
        })
        this.register.getComponent(cc.Animation).play("register_out");
        this.registerscript.reset();
    },
    onRemeberClick(event) {
        cc.vv.io.put('isRemeber', this.checkbox.isChecked)
    },
}); 