import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';


class PlayBtn extends Component {

    constructor(props) {
        super(props);

        this.state = {active: false};
        this.toggleAnim = this.toggleAnim.bind(this);
    }

    toggleAnim () {
        this.props.act();

        this.setState(prevState => ({
            active: !prevState.active
        }))
    }

    render() {
        return (
            <RaisedButton label={this.state.active? "Pause" : "Start"} onClick={this.toggleAnim} />
        );
    }
}

export default PlayBtn;
