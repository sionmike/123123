cc.Class({
    extends: cc.Component,

    properties: {
       shadow:cc.Node,
        target:cc.Node
    },

    // use this for initialization
    onLoad: function () {

    },
    close(){
       this.target.destroy();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
