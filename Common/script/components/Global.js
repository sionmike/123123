var shadow;
var canvas;

const locZorder = new cc.Enum({
    CION: -1,
    PLAYBTN: -1,
    PLAYER: -1,
    VISITORPLAYER: -1,
    SETUI: -1,
    ROOMBTN: -1,
    PLUSPANNEL: -1,
    PKLAYER: -1,
    PKPLAYER: -1,
    EMOJIPANEL: -1,
    EXITPANEL: -1,
    LAYERMSG: -1,
    PKANIMATE: -1,
    GAMEEND: -1, //结束面板
    SCROLLMSG: -1,
    RECHARGE: -1,
    QRCODE:-1,
    ALETPANNEL: -1,
    LOADING: -1,
})



const zjhPlayerVec2 = [{
    coinVec: new cc.Vec2(143, 65),
    holdVec: new cc.Vec2(114, -41),
    player: new cc.Vec2(19, -156)
}, {
    coinVec: new cc.Vec2(143, 65),
    holdVec: new cc.Vec2(114, -41),
    player: new cc.Vec2(-337, -156)
}, {
    coinVec: new cc.Vec2(143, 65),
    holdVec: new cc.Vec2(114, -41),
    player: new cc.Vec2(-437, -30)
}, {
    coinVec: new cc.Vec2(143, 65),
    holdVec: new cc.Vec2(114, -41),
    player: new cc.Vec2(-365, 232)
}, {
    coinVec: new cc.Vec2(143, 65),
    holdVec: new cc.Vec2(114, -41),
    player: new cc.Vec2(35, 232)
}, {
    coinVec: new cc.Vec2(-145, 65),
    holdVec: new cc.Vec2(-164, -41),
    player: new cc.Vec2(466, 232)
}, {
    coinVec: new cc.Vec2(-145, 65),
    holdVec: new cc.Vec2(-164, -41),
    player: new cc.Vec2(505, 30)
}, {
    coinVec: new cc.Vec2(-145, 65),
    holdVec: new cc.Vec2(-164, -41),
    player: new cc.Vec2(466, -156)
}]


const zjhChatMsg = {
    0: "不跟了！",
    1: "安全第一！先撤了！",
    2: "回家吃饭去~",
    3: "休息一下~",
    4: "我放弃！",
}

//设置为常驻节点
var getShadow = function () {
    if (!shadow || !canvas.isValid) {
        shadow = cc.find('Canvas/shadow');
    }
    return shadow
};
var getCanvas = function () {
    if (!canvas || !canvas.isValid) {
        canvas = cc.find('Canvas');
    }
    return canvas
}
/**获取在canvas 运动的坐标
 * @param {any} Vec2 
 * @returns 
 */
var getCanvasPos = function (Vec2) {
    var po = getCanvas().convertToNodeSpaceAR(Vec2);
    return po
}


var layered = function (message) {
    if (cc.vv.layers.size() > 0) {
        var alertlayers = cc.vv.layers.get();
        alertlayers.parent = cc.find("Canvas");
        let node = alertlayers.getChildByName("message");
        if (node != null && node.getComponent(cc.Label)) {
            node.getComponent(cc.Label).string = message;
        }
    }
    closelayer();
}
var closelayer = function () {
    setTimeout(function () {
        if (cc.find("Canvas/layers")) {
            cc.vv.layers.put(cc.find("Canvas/layers"));
        }
    }, 1000)
}
/**
 *获取other相对于node 的位置
 * @param {any} node 
 * @param {node} other 
 * @returns 
 */

var getNodePositon = function (node, other) {
    var Vec2 = getCanvas().convertToWorldSpaceAR(other);
    var po = node.convertToNodeSpaceAR(Vec2);
    return po
};

var getPositon = function (node, other) {
    var Vec2 = other.convertToWorldSpaceAR(other);
    var po = node.convertToNodeSpaceAR(Vec2);
    return po
};
var getTextByGameStatus = function () {
    if (cc.vv) {
        switch (cc.vv.playstatus) {
            case cc.vv.STATUS_ENUM.CATCH:
                return '开始抢庄';
                break;
            case cc.vv.STATUS_ENUM.READY:
                return '请准备';
                break;
            case cc.vv.STATUS_ENUM.DOUBLE:
                return '请选择下注倍数';
                break;
            case cc.vv.STATUS_ENUM.SHOW:
                return '查看手牌';
                break;
            case cc.vv.STATUS_ENUM.SHUFF:
                return '查看手牌';
                break;
            case cc.vv.STATUS_ENUM.HANDLED:
                return '等待其他玩家操作';
                break;
            case cc.vv.STATUS_ENUM.BANKERANIMATION:
                return '多人抢庄，随机庄家';
                break;
            case cc.vv.STATUS_ENUM.NOCATCH:
                return '无人抢庄，正在随机庄家';
                break;
            case cc.vv.STATUS_ENUM.WAITTINGDOUBLE:
                return '等待闲家下注';
                break;
            default:
                return '等待其他玩家操作';
                break;
        }
    }
};

module.exports = {
    getNodePositon: getNodePositon,
    getTextByGameStatus: getTextByGameStatus,
    getShadow: getShadow,
    getCanvasPos: getCanvasPos,
    getCanvas: getCanvas,
    layered: layered,
    closelayer: closelayer,
    getPositon: getPositon,
    zjhPlayerVec2: zjhPlayerVec2,
    zjhChatMsg: zjhChatMsg,
    locZorder: locZorder
};