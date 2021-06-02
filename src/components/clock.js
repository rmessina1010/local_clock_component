import React, { Component } from 'react';

class DigitalClock extends Component {
    constructor(props) {
        super(props);
        this.startTime = this.props.start instanceof Date ? this.props.start : new Date();
        this.startTimeOffset = this.props.start instanceof Date ? new Date().getTime() - this.startTime.getTime() : 0;

        this.depths = [
            { clss: '-day', int: 86400000 },
            { clss: '-hr', int: 3600000, foo: (time, mil) => mil ? time.getHours().toString().padStart(2, '0') : time.getHours() % 12 || 12 },
            { clss: '-min', int: 60000, foo: (time) => time.getMinutes().toString().padStart(2, '0'), sep: ':' },
            { clss: '-sec', int: 1000, foo: (time) => time.getSeconds().toString().padStart(2, '0'), sep: ':' },
            {
                clss: '-mil', int: 10 ** (6 - this.props.acc), foo: (time) => {
                    let tens = 10 ** (6 - this.props.acc);
                    let places = this.props.acc - 3;
                    return Math.round(time.getMilliseconds() / tens).toString().padStart(places, '0').substr(0, tens + 1)
                },
                sep: '.'
            },
        ];

        this.state = this.timeObj(this.startTime, this.startTimeOffset);
    }

    componentDidMount() {
        setInterval(this.tic, this.state.int)
    }

    timeObj = (time, start) => {
        let acc = (this.props.acc > -1 && this.props.acc < 7) ? this.props.acc : 2;
        let rng = acc > 4 ? 4 : acc;
        return {
            start,
            time,
            int: this.depths[rng].int,
            isMil: this.props.mil ? true : false,
            showMer: this.props.mer ? true : false,
            mer: this.props.mil ? 'hours' : time.getHours() > 11 ? 'am' : 'pm',
            acc,
            showDate: this.props.date ? true : false,
            off: isNaN(this.props.off) ? 0 : this.props.off * 1,
        }
    }


    tic = () => {
        this.setState(state => ({ time: new Date(new Date().getTime() + this.state.off + this.state.start) }));
    }

    render() {
        let parts = [];
        console.log(this.state.time)
        for (let i = this.state.showDate ? 0 : 1, rng = this.state.acc < 4 ? this.state.acc : 4; i <= rng; i++) {
            let dobj = this.depths[i];
            parts.push(<span key={'clock' + dobj.class} className={'clock' + dobj.class}>{(dobj.sep || '') + dobj.foo(this.state.time, this.state.isMil)}</span>)
        }
        if (this.state.showMer) { parts.push((<span key='clock-mer' className='clock-mer'>{this.state.mer}</span>)) }
        return (<div {...this.props.attrs}>{parts}</div >)
    }
}

export default DigitalClock;
