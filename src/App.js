import React, {Component} from 'react';
import './App.css';

// import {Board} from './simulation/board.js';
import Board from './simulation/board.js';

import PlayBtn from './sidebar/playBtn.js';

import myTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RaisedButton from 'material-ui/RaisedButton';
// import {fullWhite} from 'material-ui/styles/colors';
// import ActionAndroid from 'material-ui/svg-icons/action/android';
// import FontIcon from 'material-ui/FontIcon';


// import {Group}, {Text}, {Image} from 'react-canvas';

class App extends Component {

    constructor(props) {
        super(props);

        this.toggleSim = this.toggleSim.bind(this);
        this.toggleStop = this.toggleStop.bind(this);
        this.randomize = this.randomize.bind(this);

        this.randomize = this.randomize.bind(this);

        this.changeSpeed = this.changeSpeed.bind(this);
    }

    componentDidMount() {
        this.b = new Board(this.refs.canvas, 200, 200);
        // console.log(b);
        this.b.init();
        this.b.run();
        // this.b.randomize();

        // b.play();
    }

    toggleSim() {
        this.b.toggle();
    }

    toggleStop() {
        this.b.stop();
    }

    randomize() {
        this.b.randomize();
    }

    changeSpeed(e) {
        this.b.setSpeed(e.target.value);
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(myTheme)}>
                <div className="App">

                    <div className="control">
                        <PlayBtn act={this.toggleSim}/>

                        <RaisedButton label={"Stop"} onClick={this.toggleStop} />
                        <RaisedButton label={"Randomize"} onClick={this.randomize} />

                        <br />

                        <input type="range" min="10" max="1000" step="10"  onChange={this.changeSpeed} />

                    </div>

                    <div className="canvas">
                        <canvas ref="canvas" />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
