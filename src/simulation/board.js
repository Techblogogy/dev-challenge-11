// import './cell.js';

class Board {

    constructor(w, h) {

        self._w = w;
        self._h = h;

        self.zero_state = [
            [0, 1],
            [1, 2],
            [2, 0],
            [2, 1],
            [2, 2]
        ];

        self.run = false;

        self.zero = [];

        self.speed = 300;

        self.pixel = 5;

        self.sBuffer = [];
        self.tBuffer = [];

        self.start = null;

        self.cnv = document.getElementById("game");
            self.cnv.width = self._w * self.pixel;
            self.cnv.height = self._h * self.pixel;
        self.ctx = self.cnv.getContext('2d');

        self.cnv.onclick = this.click;
    }

    init() {

        for (var y = 0; y < self._h; y++) {
            var row = [];
            for (var x = 0; x < self._w; x++) {

                var f = false;
                for (var i = 0; i < self.zero_state.length; i++) {
                    if (self.zero_state[i][0] == x && self.zero_state[i][1] == y) {
                        row.push(1);
                        f = true;

                        break;
                    }
                }

                if (!f) {
                    row.push(0);
                }

            }

            self.zero.push(row);
        }

        for (var i = 0; i < self.zero.length; i++) {
            self.sBuffer = self.sBuffer.concat(self.zero[i]);
        }
    }

    randomize() {
        for (var i=0; i< self.sBuffer.length; i++) {
            self.sBuffer[i] = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
        }
    }

    getBuff() {
        return self.sBuffer;
    }

    play () {
        self.run = true;
    }

    setSpeed(speed) {
        self.speed = speed;
    }

    pause() {
        self.run = false;
    }

    stop () {
        this.pause();

        for (var i=0; i< self.sBuffer.length; i++) {
            self.sBuffer[i] = 0;
        }
    }

    tick() {

        // Copy temp buffer with screen buffer`
        self.tBuffer = self.sBuffer.slice();

        //Calculate
        for (var y = 0; y < self._h; y++) {
            for (var x = 0; x < self._w; x++) {
                var n = 0; //Neighbours
                var i = y * self._w + x; //Id Of Cell

                //Calculate Neigbours
                for (var y0 = y - 1; y0 <= y + 1; y0++) {
                    for (var x0 = x - 1; x0 <= x + 1; x0++) {
                        if ( (y != y0 || x != x0) && (x0 >= 0 && x0 < self._w && y0 >= 0 && y0 < self._h) ) {
                            if (self.tBuffer[y0 * self._w + x0]) n++;
                        }
                    }
                }

                //Apply Rules
                if (self.tBuffer[i]) {
                    if (n < 2)
                        self.sBuffer[i] = 0;
                    else if (n === 2 || n === 3)
                        self.sBuffer[i] = 1;
                    else if (n > 3)
                        self.sBuffer[i] = 0;
                } else {
                    if (n === 3)
                        self.sBuffer[i] = 1;
                }
            }
        }


    }

    renderGrid () {

        self.ctx.strokeStyle = "#EEEEEE";
        for (var y = 0; y < self._h; y++) {

            for (var x = 0; x < self._w; x++) {

                self.ctx.beginPath();
                self.ctx.moveTo(x*self.pixel, y*self.pixel);
                self.ctx.lineTo(x*self.pixel, self._h*self.pixel);
                self.ctx.stroke();
            }


            self.ctx.beginPath();
            self.ctx.moveTo(0, y*self.pixel);
            self.ctx.lineTo(self._w*self.pixel, y*self.pixel);
            self.ctx.stroke();
        }
    }

    render () {
        self.ctx.fillStyle = "green";
        for (var y = 0; y < self._h; y++) {
            for (var x = 0; x < self._w; x++) {
                var n = 0; //Neighbours
                var i = y * self._w + x; //Id Of Cell

                if (self.sBuffer[i] == 1) {
                    self.ctx.fillRect(x*self.pixel,y*self.pixel, self.pixel, self.pixel);
                }

            }
        }
    }

    calcTime (timestamp) {
        if (!self.start) self.start = timestamp;
        var prog = timestamp - self.start;

        if (prog >= self.speed) {
            self.start = null;
            return true;
        }

        return false;
    }

    simulate (timestamp) {

        if (this.calcTime(timestamp)) {
            self.ctx.clearRect(0,0,self.cnv.width,self.cnv.height);
            if (self.run) {
                this.tick();
            } else {
                this.renderGrid();
            }
            this.render();

        }

        window.requestAnimationFrame(this.simulate.bind(this));

    }

    run () {
        window.requestAnimationFrame(this.simulate.bind(this));
    }

    click (e) {
        var rect = self.cnv.getBoundingClientRect();

        var coord =  {
            x: parseInt((e.clientX - rect.left)/self.pixel),
            y: parseInt((e.clientY - rect.top)/self.pixel)
        }

        // console.log(coord);

        var i = coord.y * self._w + coord.x;

        if ( self.sBuffer[i] == 1 ) {
            self.sBuffer[i] = 0;
        } else {
            self.sBuffer[i] = 1;
        }


    }
}



window.onload = function() {

    // setInterval(sim, 300);

    // console.log(Board);
    var b = new Board(200, 200);
    console.log(b);
    b.init();

    var play = document.getElementById("play");
    var stop = document.getElementById("stop");
    var pause = document.getElementById("pause");

    var random = document.getElementById("random");

    var range = document.getElementById("speed");

    play.onclick = function () {
        console.log("PLAY");
        b.play();
    };
    pause.onclick = function () {
        console.log("Stop");
        b.pause();
    };
    stop.onclick = function () {
        b.stop();
    };

    random.onclick = function () {
        b.randomize();
    }

    range.onchange = function () {
        b.setSpeed(this.value);
    }

    b.run();
    // window.requestAnimationFrame(b.simulate);

    // function sim() {
    //     b.simulate();
    // }
}


module.exports = Board;
