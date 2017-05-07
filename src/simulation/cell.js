

exports class Cell {

    constructor(x, y, state) {
        this.x = x;
        this.y = y;

        this._state = state;
    }

    setState(state) {
        this._state = state;
    }

    die() {
        this._state = false;
    }

    live() {
        this._state = true;
    }


}
