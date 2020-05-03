const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

let REMOTE_HOST ='127.0.0.1';
const REMOTE_PORT = 22222;
const LOCAL_PORT = 22223;

const Cylon = require('cylon');
const safeStringify = require('fast-safe-stringify');

class App {
    init() {
        socket.on('message', (message, remote) => {
            console.log(remote.address + ':' + remote.port +' - ' + message);
        });

        console.log(process.argv);
        if (process.argv.length > 2) {
            REMOTE_HOST = process.argv[2];
        }
        console.log('REMOTE_HOST', REMOTE_HOST);

        socket.bind(LOCAL_PORT);
        // this.sendTest();
        this.leapInit();
    }

    // UDP データ送信
    send(data) {
        console.log('send data.length', data.length);
        socket.send(data, 0, data.length, REMOTE_PORT, REMOTE_HOST, (err, bytes) => {
            if (err) throw err;
        });
    }

    sendTest() {
        setInterval(() => {
            console.log('send');
            const data = Buffer.from('abcdefg');
            this.send(data);
        }, 500);
    }

    // leapmotion 初期化
    // https://medium.com/@MateMarschalko/leap-into-javascript-handsfree-gestures-eccfd08a6437
    leapInit() {
        console.log('leapInit');
        Cylon.robot({
            connections: {
                leapmotion: { adaptor: 'leapmotion' }
            },
           
            devices: {
                leapmotion: { driver: 'leapmotion' }
            },
           
            work: (my) => {
                // https://developer-archive.leapmotion.com/documentation/javascript/api/Leap.Hand.html
                my.leapmotion.on('hand', (payload) => {                    
                    const id = payload.id;
                    const type = payload.type;
                    // 握る,閉じる
                    const grabStrength = payload.grabStrength;
                    // 手のひらの中心位置
                    const palmPosition = payload.palmPosition;            
                    const fingers = {
                        thumb: this.fingerReplacer(payload.thumb.distal.basis), // 親指
                        index: this.fingerReplacer(payload.indexFinger.distal.basis), // 人差し指
                        middle: this.fingerReplacer(payload.middleFinger.distal.basis), // 中指
                        ring: this.fingerReplacer(payload.ringFinger.distal.basis), // 薬指
                        pinky: this.fingerReplacer(payload.pinky.distal.basis) // 小指
                    };
                    // ロール, ピッチ, ヨー
                    const roll = Math.round(payload.roll()*180/Math.PI);
                    const pitch = Math.round(payload.pitch()*180/Math.PI);
                    const yaw = Math.round(payload.yaw()*180/Math.PI);

                    // 腕の位置
                    // const arm = payload.arm;
                    const hand = safeStringify({
                        cmd: 'hand',
                        hand: {
                            id: id,
                            type: type,
                            palmPosition: palmPosition,
                            grabStrength: grabStrength,
                            fingers: fingers,
                            roll: roll,
                            pitch: pitch,
                            yaw: yaw,
                        }
                    });
                    this.send( Buffer.from(hand) );
                    // console.log(id, type, payload.stabilizedPalmPosition);
                });
            }
          }).start();
    }

    // 指データでJSONにできないパラメタを除去
    fingerReplacer(value) {
        if (typeof value === 'undefined') {
            return null;
        }
        return value;
    }
};

const app = new App();
app.init();