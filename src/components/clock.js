import React, { Component } from 'react';

class DigitalClock extends Component {
    constructor(props) {
        super(props);
        this.startTime = this.props.start instanceof Date ? this.props.start : new Date();
        this.off = isNaN(this.props.off) ? 0 : this.props.off * 1;
        this.startTime.setTime(this.startTime.getTime() + this.off);
        this.depths = [
            { clss: '-day', int: 86400000 },
            { clss: '-hr', int: 3600000, foo: (time, mil) => mil ? time.getHours().toString().padStart(2, '0') : time.getHours() % 12 || 12 },
            { clss: '-min', int: 60000, foo: (time) => time.getMinutes().toString().padStart(2, '0'), sep: ':' },
            { clss: '-sec', int: 1000, foo: (time) => time.getSeconds().toString().padStart(2, '0'), sep: ':' },
            { clss: '-mil', int: 10 ** (6 - this.props.acc), foo: (time) => Math.round(time.getMilliseconds() / 10 ** (6 - this.props.acc)).toString().padStart(2, '0'), sep: '.' },
        ];
        this.int = this.props
        this.state = this.timeObj(this.startTime, this.int);
    }

    timeObj = (time) => {
        return {
            time,
            int: (this.props.lev > -1 && this.props.lev < 7) ? this.depths[this.props.lev].int : 2,
            isMil: this.props.mil ? true : false,
            showMer: this.props.mer ? true : false,
            mer: this.props.mil ? 'hours' : time.getHours() > 11 ? 'am' : 'pm',
            acc: (this.props.acc > -1 && this.props.acc < 6) ? this.props.acc : 2,
            showDate: this.props.date ? true : false
        }
    }


    tic = () => {

    }

    render() {
        let parts = [];
        console.log(this.state.time)
        for (let i = this.state.showDate ? 0 : 1; i <= this.state.acc; i++) {
            let dobj = this.depths[i];
            parts.push(<span key={'clock' + dobj.class} className={'clock' + dobj.class}>{(dobj.sep || '') + dobj.foo(this.state.time, this.state.isMil)}</span>)
        }
        if (this.state.showMer) { parts.push((<span key='clock-mer' className='clock-mer'>{this.state.mer}</span>)) }
        return (<div {...this.props.attrs}>{parts}</div >)
    }
}

export default DigitalClock;
