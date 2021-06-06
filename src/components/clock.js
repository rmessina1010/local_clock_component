import React, { Component } from 'react';

class DigitalClock extends Component {
    constructor(props) {
        super(props);
        this.startTime = this.props.start instanceof Date ? this.props.start : new Date();
        this.startTimeOffset = this.props.start instanceof Date ? new Date().getTime() - this.startTime.getTime() : 0;
        this.theTic = null;

        this.depths = [
            {
                class: '-day', int: 86400000, foo: (time, opts) => {
                    let mode = opts.mode || 'en-US';
                    let dayParts = []
                    if (opts.weekday) { dayParts.push(<span className='clock-weekday'>{time.toLocaleDateString(mode, { weekday: opts.weekday }) + (opts.wdsep || '')}</span>) }
                    if (opts.month || opts.day) { dayParts.push(<span className='clock-date'>{time.toLocaleDateString(mode, { month: opts.month || null, day: opts.day || null }) + (opts.mdsep || '')}</span>) }
                    if (opts.year) { dayParts.push(<span className='clock-year'>{time.toLocaleDateString(mode, { year: opts.year })}</span>) }
                    if (dayParts.length) { dayParts.push(' '); }
                    return dayParts;
                }
            },
            { class: '-hr', int: 3600000, foo: (time, mil) => mil ? time.getHours().toString().padStart(2, '0') : time.getHours() % 12 || 12 },
            { class: '-min', int: 60000, foo: (time) => time.getMinutes().toString().padStart(2, '0'), sep: this.props.minsep || ':' },
            { class: '-sec', int: 1000, foo: (time) => time.getSeconds().toString().padStart(2, '0'), sep: this.props.secsep || ':' },
            {
                class: '-mil', int: 10 ** (6 - this.props.acc), foo: (time) => {
                    return time.getMilliseconds().toString().padStart(3, '0').substr(0, this.props.acc - 3);
                },
                sep: this.props.milsep || '.'
            },
        ];

        this.state = this.timeObj(this.startTime, this.startTimeOffset);
    }

    componentDidMount() {
        this.intialTic();
    }


    intialTic() {
        let acc = (this.props.acc > -1 && this.props.acc < 7) ? this.props.acc : 2;
        let rng = acc > 4 ? 4 : acc;
        let rem = this.depths[rng].int - ((new Date().getTime()) % this.depths[rng].int);
        this.theTic = setTimeout(this.tic, rem);
    }


    tic = () => {
        this.setState(state => ({ time: new Date(new Date().getTime() + this.state.off + this.state.start) }));
        this.theTic = setTimeout(this.tic, this.state.int);
    }

    timeObj = (time, start) => {
        let acc = (this.props.acc > -1 && this.props.acc < 7) ? this.props.acc : 2;
        let rng = acc > 4 ? 4 : acc;
        return {
            start,
            time,
            int: this.depths[rng].int,
            acc,
            off: isNaN(this.props.off) ? 0 : this.props.off * 1,
        }
    }

    render() {
        let parts = [];
        let bef, aft = null;
        if (this.props.preCont) {
            bef = React.cloneElement(this.props.preCont, { parState: this.state })
        }
        if (this.props.postCont) {
            aft = React.cloneElement(this.props.postCont, { parState: this.state })
        }

        let pmClass = this.state.time.getHours() > 11 ? 'is-pm' : 'is-am';
        let hourClass = 'hour-' + this.state.time.getHours();
        let dayClass = 'day-' + this.state.time.getDay();
        let monthClass = 'month-' + this.state.time.getMonth();
        let timeZone = 'tz-' + this.state.time.toTimeString();////

        for (let i = this.props.date ? 0 : 1, rng = this.state.acc < 4 ? this.state.acc : 4; i <= rng; i++) {
            let dobj = this.depths[i];
            let aux = null;
            if (dobj.class === '-hr') { aux = this.props.mil || null; }
            if (dobj.class === '-day') { aux = this.props.date; }
            parts.push(<span key={'clock' + dobj.class} className={'clock' + dobj.class}>{(dobj.sep || '')}{dobj.foo(this.state.time, aux)}</span>)
        }
        if (this.props.mer) {
            parts.push((<span key='clock-mer' className='clock-mer'> {this.props.mil ? 'hours' : (pmClass === 'is-pm' ? 'pm' : 'am')}</span>))
        }
        return (
            <div className={`clock-outer-wrap ${pmClass} ${hourClass} ${dayClass} ${monthClass}`} {...this.props.outerAttrs}>
                {bef}
                <div className='clock-inner-wrap'{...this.props.innerAttrs}>{parts}</div>
                {aft}
            </div>
        )
    }
}

export default DigitalClock;
