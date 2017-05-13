// import './cell.js';

class Board {

    constructor(canvas, w, h) {

        this._w = w;
        this._h = h;

        this.zero_state = [
            [0, 1],
            [1, 2],
            [2, 0],
            [2, 1],
            [2, 2]
        ];

        this.runState = false;

        this.zero = [];

        this.speed =  10; //300;

        this.pixel = 5;

        this.sBuffer = [];
        this.tBuffer = [];

        this.grid = this.renderGrid();

        this.start = null;

        this.cnv = canvas; //document.getElementById("game");
            this.cnv.width = this._w * this.pixel;
            this.cnv.height = this._h * this.pixel;
        this.ctx = this.cnv.getContext('2d');

        this.cnv.onclick = this.click.bind(this);
    }

    init() {

        for (var y = 0; y < this._h; y++) {
            var row = [];
            for (var x = 0; x < this._w; x++) {

                var f = false;
                for (var i = 0; i < this.zero_state.length; i++) {
                    if (this.zero_state[i][0] == x && this.zero_state[i][1] == y) {
                        row.push(1);
                        f = true;

                        break;
                    }
                }

                if (!f) {
                    row.push(0);
                }

            }

            this.zero.push(row);
        }

        for (var i = 0; i < this.zero.length; i++) {
            this.sBuffer = this.sBuffer.concat(this.zero[i]);
        }
    }

    randomize() {
        for (var i=0; i< this.sBuffer.length; i++) {
            this.sBuffer[i] = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        }
    }

    getBuff() {
        return this.sBuffer;
    }

    play () {
        this.runState = true;
    }

    toggle() {
        this.runState = !this.runState;
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    pause() {
        this.runState = false;
    }

    stop () {
        this.pause();

        for (var i=0; i< this.sBuffer.length; i++) {
            this.sBuffer[i] = 0;
        }
    }

    tick() {

        // Copy temp buffer with screen buffer`
        this.tBuffer = this.sBuffer.slice();

        //Calculate
        for (var y = 0; y < this._h; y++) {
            for (var x = 0; x < this._w; x++) {
                var n = 0; //Neighbours
                var i = y * this._w + x; //Id Of Cell

                //Calculate Neigbours
                for (var y0 = y - 1; y0 <= y + 1; y0++) {
                    for (var x0 = x - 1; x0 <= x + 1; x0++) {
                        if ( (y != y0 || x != x0) && (x0 >= 0 && x0 < this._w && y0 >= 0 && y0 < this._h) ) {
                            if (this.tBuffer[y0 * this._w + x0]) n++;
                        }
                    }
                }

                //Apply Rules
                if (this.tBuffer[i]) {
                    if (n < 2)
                        this.sBuffer[i] = 0;
                    else if (n === 2 || n === 3)
                        this.sBuffer[i] = 1;
                    else if (n > 3)
                        this.sBuffer[i] = 0;
                } else {
                    if (n === 3)
                        this.sBuffer[i] = 1;
                }
            }
        }


    }

    renderGrid () {

        var virtual = document.createElement("canvas");
            virtual.width = this._w * this.pixel;
            virtual.height = this._h * this.pixel;
        var ctx = virtual.getContext('2d');

        ctx.strokeStyle = "#EEEEEE";
        for (var y = 0; y < this._h; y++) {

            for (var x = 0; x < this._w; x++) {

                ctx.beginPath();
                ctx.moveTo(x*this.pixel, y*this.pixel);
                ctx.lineTo(x*this.pixel, this._h*this.pixel);
                ctx.stroke();
            }


            ctx.beginPath();
            ctx.moveTo(0, y*this.pixel);
            ctx.lineTo(this._w*this.pixel, y*this.pixel);
            ctx.stroke();
        }

        return virtual;
    }

    render () {
        this.ctx.fillStyle = "green";
        for (var y = 0; y < this._h; y++) {
            for (var x = 0; x < this._w; x++) {
                var n = 0; //Neighbours
                var i = y * this._w + x; //Id Of Cell

                if (this.sBuffer[i] == 1) {
                    this.ctx.fillRect(x*this.pixel,y*this.pixel, this.pixel, this.pixel);
                }

            }
        }
    }

    calcTime (timestamp) {
        if (!this.start) this.start = timestamp;
        var prog = timestamp - this.start;


        if (prog >= this.speed) {
            this.start = null;
            return true;
        }

        return false;
    }

    simulate (timestamp) {

        // console.log("TICK");

        if (this.calcTime(timestamp)) {
            this.ctx.clearRect(0,0,this.cnv.width,this.cnv.height);
            if (this.runState) {
                this.tick();
            } else {
                // this.renderGrid();
                this.ctx.drawImage(this.grid, 0, 0);
            }
            this.render();

        }

        window.requestAnimationFrame(this.simulate.bind(this));

    }

    run () {
        window.requestAnimationFrame(this.simulate.bind(this));
    }

    click (e) {
        var rect = this.cnv.getBoundingClientRect();

        var coord =  {
            x: parseInt((e.clientX - rect.left)/this.pixel),
            y: parseInt((e.clientY - rect.top)/this.pixel)
        }

        var i = coord.y * this._w + coord.x;

        if ( this.sBuffer[i] == 1 ) {
            this.sBuffer[i] = 0;
        } else {
            this.sBuffer[i] = 1;
        }


    }
}



// window.onload = function() {
//
//     // setInterval(sim, 300);
//
//     // console.log(Board);
//     var b = new Board(200, 200);
//     console.log(b);
//     b.init();
//
//     var play = document.getElementById("play");
//     var stop = document.getElementById("stop");
//     var pause = document.getElementById("pause");
//
//     var random = document.getElementById("random");
//
//     var range = document.getElementById("speed");
//
//     play.onclick = function () {
//         console.log("PLAY");
//         b.play();
//     };
//     pause.onclick = function () {
//         console.log("Stop");
//         b.pause();
//     };
//     stop.onclick = function () {
//         b.stop();
//     };
//
//     random.onclick = function () {
//         b.randomize();
//     }
//
//     range.onchange = function () {
//         b.setSpeed(this.value);
//     }
//
//     b.run();
// }


export default Board;
