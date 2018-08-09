var config = {
    host: "ws://api.bingoooo.cn",
    port: 8083
};
var Global = cc.Class({
    extends: cc.Component,
    statics: {
        config: config,
        socket: {},
        notify: new cc.EventTarget(),
        isConnected: false,
        isPinging: false,
        // use this for initialization
        on(command, fn, self) {
            this.notify.on(command, fn, self)
        },
        emit(command, data) {
            this.notify.emit(command, data)
        },
        off(command, callback, target) {
            this.notify.off(command, callback, target)
        },
        connect(config) {
            if (this.socket.readyState !== 1) {
                this.reconnect(config)
            }
        },
        //重连
        reconnect(cof) {
            let host = cof != undefined ? cof.host : Global.config.host
            let port = cof != undefined ? cof.port : Global.config.port
            // this.socket = new WebSocket(host + ":" + port)
            this.socket = new WebSocket(host + ":" + port, null, cc.url.raw("resources/cacert.pem"))
            this.socket.onopen = function () {
                
                    Global.send({
                        controller_name: "YtxScoketService",
                        method_name: "userLogin"
                    }, {
                        token: cc.vv.http.authorization
                    })
                
                // if (port == 8083) {
                //     Global.send({
                //         command: "userVerify",
                //         token: cc.vv.http.authorization
                //     });
                // }
                Global.isConnected = true;
                Global.startHearbeat();
            }
            this.socket.onclose = this._onClose;
            this.socket.onmessage = this._onmessage;

        },
        newconnet(cof) {
            let host = cof != undefined ? cof.host : Global.config.host
            let port = cof != undefined ? cof.port : Global.config.port
            this.socket = new WebSocket(host + ":" + port)
            this.notify = new cc.EventTarget();
            this.socket.onopen = this._onOpen
            this.socket.onclose = this._onClose;
            this.socket.onmessage = this._onmessage;
        },

        startHearbeat() {
            this.on('GAME_PING', function (data) {

                self.lastRecieveTime = Date.now();
                self.delayMS = self.lastRecieveTime - self.lastSendTime;

            });
            this.lastRecieveTime = Date.now();
            var self = this;
            if (!self.isPinging) {
                self.isPinging = true;
                cc.game.on(cc.game.EVENT_HIDE, function () {
                    self.ping();
                });
                setInterval(function () {
                    if (self.socket.readyState == 1) {
                        self.ping();
                    } else {

                    }
                }.bind(this), 50000);
            }
        },

        send(protocol, data) {
            var msg;
            if (this.socket.readyState == 1) {
                if (data != null && (typeof data == "object")) {
                    // data.event_name = event_name; 

                    for (let key in data) {

                        protocol[key] = data[key]

                    }
                    msg = JSON.stringify(protocol);

                } else {
                    msg = JSON.stringify(protocol)
                }
                this.socket.send(msg);
            }
        },
        disconnect() {
            this.delayMS = null;
            if (this.socket.readyState == 1) {
                this.socket.connected = false;
                this.socket.close()
            }
            this.socket = {};
        },
        ping() {
            this.lastSendTime = Date.now();
            // let re =new RegExp(/8083/g)
            // let url=this.socket.url
            // if(re.test(url)){
            //     Global.send({
            //         command: "ping"
            //     })
            //     console.log(url)
            // }else{
            if (cc.vv.ENV == 'prd') {
                Global.send({
                    controller_name: "YtxScoketService",
                    method_name: "heartBeats"
                })
            } else {
                Global.send({
                    controller_name: "YhtZjhWsService",
                    method_name: "heartBeats"
                })
            }

            // }
        },
        _onOpen(ev) {

            Global.isConnected = true;
            Global.startHearbeat();
        },
        _onClose(ev) {
            Global.isConnected = false;
            Global.emit('disconnect', {})
        },
        _onmessage(ev) {
            // if (cc.vv.ENV == 'dev') console.log(ev.data);
            let data = JSON.parse(ev.data);
            if (typeof data == 'string') {
                data = JSON.parse(data);
            }
            if (data.command != 'GAME_PING') {
                // if (cc.vv.ENV == 'dev') console.log(data, data.command);
                console.log(data, data.command);
            }
            Global.notify.emit(data.command, data)
        }
    },
});