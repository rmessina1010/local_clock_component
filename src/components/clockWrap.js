import React, { Component } from 'react';
import DigitalClock from './clock';


class ClockWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mer: true,
            mil: false,
        }

    }

    handleClick = (e) => {
        this.setState(oldState => {
            return { [e.target.name]: !oldState[e.target.name] }
        });
    }

    render() {
        return (<div>
            <button name="mil" onClick={this.handleClick}>toggle mil</button>
            <button name="mer" onClick={this.handleClick}>toggle show</button>
            <DigitalClock mer={this.state.mer} mil={this.state.mil} acc={3} />
        </div>)
    }

}

export default ClockWrap;