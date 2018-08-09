var config = {
    host: "ws://api.bingoooo.cn",
    port: 8083
};
var Global = cc.Class({
    extends: cc.Component,
    statics: {
        config: config,
        user_token: 0,
        _index_href: "",
        socket: {},
        notify: new cc.EventTarget(),
        isPinging: false,
         
        on(commond, fn,self) {
            this.notify.on(commond, fn, self)
        },
        emit(commond, data) {
            this.notify.emit(commond, data)
        },
        connect() {
            if (this.socket.readyState !== 1) {
                this.reconnet()
            }
        },
        //重连
        reconnet() {
            var self = this;
            this.socket = new WebSocket(config.host + ":" + config.port);
            this.socket.onopen = this._onOpen;
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
                    if (self.socket) {
                        self.ping();
                    }
                }.bind(this), 50000);
            }
        },

        send(protocol, data) {
            if (this.socket.readyState == 1) {
                if (data != null && (typeof (data) == "object")) {
                    // data.event_name = event_name;
                    data.controller_name = protocol.controller_name
                    data.method_name = protocol.method_name
                    data = JSON.stringify(data);

                } else if (!data) {
                    data = JSON.stringify(protocol)

                }
                this.socket.send(data);
            }
        },
        close() {
           
            this.delayMS = null;
            if (this.socket && this.socket.readyState == 1) {
                this.socket.connected = false;
                this.socket.close()
            }
            this.socket = null;
            this.emit('disconnect', {})
        },
        ping() {
            if (this.socket) {
                this.lastSendTime = Date.now();
                Global.send({ "controller_name": "TtzWsController", "method_name": "ping"});
    
            }
        },
        _onOpen(ev) {
            // Global.send({
            //     controller_name: "",
            //     method_name: "userVerify"
            // }, {
            //         token: cc.vv.http.authorization
            //     })e7f9a1796994931f2f7a4bd57c7a13a7       4e6c8cc338768eab6e70361677e2e9d3

            Global.startHearbeat();
        },
        _onClose(ev) {
            

        },
        _onmessage(ev) {
       
            
            let data = JSON.parse(ev.data);
            if (typeof data == 'string') {
                data = JSON.parse((data));
            }

            if (data.command != 'GAME_PING') {
                console.log(data, data.command)
            }
            Global.notify.emit(data.command, data)
        }
    },
});