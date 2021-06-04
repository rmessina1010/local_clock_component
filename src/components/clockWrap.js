import React, { Component } from 'react';
import DigitalClock from './clock';


class ClockWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mer: true,
            mil: false,
            date: { weekday: 'long', day: '2-digit', month: 'long' }
        }

    }

    handleClick = (e) => {
        this.setState(oldState => {
            return { [e.target.name]: !oldState[e.target.name] }
        });
    }
    handleDate = () => {
        this.setState(oldState => {
            return { date: oldState.date ? false : { weekday: 'long', day: '2-digit', month: 'long', year: "numeric" } }
        });
    }

    render() {
        return (<div>
            <button name="mil" onClick={this.handleClick}>toggle mil</button>
            <button name="mer" onClick={this.handleClick}>toggle show</button>
            <button name="date" onClick={this.handleDate}>toggle day</button>
            <DigitalClock mer={this.state.mer} mil={this.state.mil} acc={3} date={this.state.date} />
        </div>)
    }

}

export default ClockWrap;