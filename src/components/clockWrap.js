import React, { Component } from 'react';
import DigitalClock from './clock';

const dateOpts = { weekday: 'short', wdsep: '. ,' };
class ClockWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mer: true,
            mil: false,
            date: dateOpts
        }

    }

    handleClick = (e) => {
        this.setState(oldState => {
            return { [e.target.name]: !oldState[e.target.name] }
        });
    }
    handleDate = () => {
        this.setState(oldState => {
            return { date: oldState.date ? false : dateOpts }
        });
    }

    render() {
        return (<div>
            <button name="mil" onClick={this.handleClick}>toggle 24H</button>
            <button name="mer" onClick={this.handleClick}>toggle show meridian</button>
            <button name="date" onClick={this.handleDate}>toggle date info</button>
            <DigitalClock mer={this.state.mer} mil={this.state.mil} acc={3} date={this.state.date} />
        </div>)
    }

}

export default ClockWrap;