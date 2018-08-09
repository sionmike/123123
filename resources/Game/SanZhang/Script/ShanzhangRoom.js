// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var vvCommon = require("vvCommon");
cc.Class({
    extends: vvCommon,

    properties: {
        _playerList: [],
        _myself: null,
        _myposition: 0,
        _gamestatus: 0,
        _currentRound: 0,
        _maxRound: 0,
        _currentTurnRound: 0,
        _maxTurnRound: 0,
        _currentPlayer: null,
        _turn: 0,
        _roomowner: 0,
        _isWan: 0
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.game;
    },

    start() {

    },
    isInRoom(id) {
        return this.getPlayer(id) ? true : false
    },
    getPlayerList() {
        return this._playerList
    },
    addPlayerList(render) {
        this._playerList.push(render)
    },
    removeAllPlayer(){
      return  this._playerList=[]
    },
    removeFromPlayerList(actor) {
        this._playerList.forEach((player, index) => {
            if (player == actor) {
                this._playerList.splice(index, 1)
            }
        })
    },
    getActvePlayerList() {
        let actvePlayerList = []
        this._playerList.forEach((player) => {
            if (player.getStatus() != 6) {
                actvePlayerList.push(player)
            }
        })

        for (let i = 0; i < actvePlayerList.length; i++) {
            for (let j = 0; j < actvePlayerList.length - 1 - i; j++) {
                if (actvePlayerList[j].getSeatIndex() > actvePlayerList[j + 1].getSeatIndex()) {
                    let temp = actvePlayerList[j + 1]
                    actvePlayerList[j + 1] = actvePlayerList[j]
                    actvePlayerList[j] = temp
                }
            }
        }
        return actvePlayerList
    },
    setRoomInfo(info) {
        if (info != null) {
            
            console.log(info.round, info.max_round, "房间")
            this.setCurrentRound(info.round);
            this.setMaxRound(info.max_round);
            this._roomowner = info.room_owner
            var room_num = `${info.number}`
            this._iswan = room_num.indexOf("W") != -1
            return info
        }
    },
    setGameInfo(info) {
        if (info != null) {
            console.log(info.game_round, info.max_round, "游戏")
            this.setCurrentTurnRound(info.game_round);
            this.setMaxTurnRound(info.max_round);
            return info
        }
    },
    RoomisWan() {
        return this._iswan
    },
    getRoomOwn() {
        return this._roomowner
    },
    getCurrentPlayer() {
        return _currentPlayer
    },
    setCurrentPlayer(player) {
        if (player != null) {
            return this._currentPlayer = player
        }
    },
    getCurrentRound() {
        return this._currentRound
    },

    setCurrentRound(round) {
        if (round != null) {
            return this._currentRound = round
        }
    },
    getMaxRound() {
        return this._maxRound
    },
    setMaxRound(round) {
        if (round != null) {
            return this._maxRound = round
        }
    },


    getCurrentTurnRound() {
        return this._currentTurnRound
    },

    setCurrentTurnRound(round) {
        if (round != null) {
            return this._currentTurnRound = round
        }
    },
    getMaxTurnRound() {
        return this._maxTurnRound
    },
    setMaxTurnRound(round) {
        if (round != null) {
            return this._maxTurnRound = round
        }
    },
    initSeates(seats) {
        if (seats instanceof Object) {
            for (let seat in seats) {
                this.initSingleSeat(seats[seat]);
            }
        }
    },
    initMyseat(data) {
        this._myposition = data.position
        this.node.emit("init_myself", data)
    },
    initSingleSeat(data) {
        //找空位
        this.node.emit("init_player", data)
    },
    getMyPositionIndex() {
        return this._myposition
    },
    setMyself(player) {
        return this._myself = player
    },
    getMyself() {
        return this._myself
    },
    getPlayer(userid) {
        var tempRender;
        for (var inx = 0; inx < this._playerList.length; inx++) {
            var render = this._playerList[inx];
            if (render.getUserId() && render.getUserId() == userid) {
                tempRender = render;
                break;
            }
        }
        return tempRender;
    },

    onReadyClick() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userReady"
        })
    },

    onAbandonClick() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userDisCard"
        })

    },

    //跟注
    onFollowClick() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userHeel"
        })
        this.node.emit("destoryAbleCoin")
    },
    //加注
    onAddBetClick() {
        this.node.emit("getuserbetcoin")
    },

    //跟到底
    onFollowAllClick() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userFollow"
        })
    },

    //看牌
    onWatchClick() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "userWatch"
        })

    },

    //比牌
    onPkClick() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "getCompareUser"
        })
        // UserCompare   uid
    },
    onStartGame() {
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "StartGame"
        })
    },
    onChangeRoom() {
        this.node.emit("disablechangebtn")
        cc.vv.socket.send({
            controller_name: "YhtZjhWsService",
            method_name: "changeRoom"
        })
        
    },
    onBackHall(){
        this.scene('hall', this)
    }
    // update (dt) {},
});