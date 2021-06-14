import React, { Component } from 'react';

class Clock extends Component {
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
            { class: '-min', int: 60000, foo: (time) => time.getMinutes().toString().padStart(2, '0'), sep: this.props.minsep !== undefined ? this.props.minsep : ':' },
            { class: '-sec', int: 1000, foo: (time) => time.getSeconds().toString().padStart(2, '0'), sep: this.props.secsep !== undefined ? this.props.secsep : ':' },
            {
                class: '-mil', int: 10 ** (6 - this.props.acc), foo: (time) => {
                    return time.getMilliseconds().toString().padStart(3, '0').substr(0, this.props.acc - 3);
                },
                sep: this.props.milsep !== undefined ? this.props.milsep : '.'
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

export class StopWatch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            start: true
        }
        this.ints = [604800000, 86400000, 3600000, 60000, 1000, 100, 10];
        this.segs = ['week', 'day', 'hr', 'min', 'sec', 'mil'];
        this.theTic = null;
    }

    reset = () => {
        if (this.theTic) {
            clearInterval(this.theTic);
            this.theTic = null;
        }
        this.setState({
            time: 0,
            start: true
        });
    }

    getAcc = () => { return this.props.acc >= 0 && this.props.acc < this.ints.length ? this.props.acc : 4; }

    startTicking = () => {
        let acc = this.getAcc();
        this.theTic = setInterval(this.tic, this.ints[acc] - 1);
    }

    toggleStart = () => {
        if (this.theTic) {
            clearInterval(this.theTic);
            this.theTic = null;
        } else { this.startTicking(); }
        this.setState((prevState) => ({ start: !prevState.start }));
    }

    tic = () => {
        let acc = this.getAcc();
        this.setState(prevState => ({ time: prevState.time + this.ints[acc] }));
    }

    render() {
        let seggedTime = [];
        let bef, aft = null;
        let sep = "";
        let decPoint = this.ints.length - 2;// where 2 is the amount of digits before the decimal pt.
        let minim = this.props.top || 0;
        let prevInt = this.ints[this.ints.length - (minim + 1)];
        let acc = this.getAcc();
        for (let i = minim, max = acc >= decPoint ? decPoint + 1 : acc + 1; i < max; i++) {
            let padding = this.ints[i] < 86400000 ? 2 : 0;
            let timeValue = this.ints[i] < 1000 ? (this.state.time % 1000) : (Math.floor(this.state.time % prevInt / this.ints[i]));
            timeValue = timeValue.toString().padStart(padding, "0");
            if (this.ints[i] < 1000) { timeValue = timeValue.substr(0, acc - decPoint + 1); }
            seggedTime.push(
                <span className={"clock-" + this.segs[i]}>{sep}{timeValue}</span>
            )
            sep = this.ints[i] > 1000 ? (this.props.sep !== undefined ? this.props.sep : ":") : (this.props.msep !== undefined ? this.props.msep : ".");
            prevInt = this.ints[i];
        }
        let controls = this.props.noctrl ? null :
            (<div className="timer-controls">
                <button type="button" className="start-toggle" onClick={this.toggleStart}>{this.state.start ? (this.state.time > 0 ? "Continue" : "Start") : "Pause"} </button>
                <button type="button" className="reset" onClick={this.reset}>Reset</button>
            </div>)

        let runningClass = "stopwatch-ready";
        if (this.state.time > 0) { runningClass = this.state.start ? "stopwatch-paused" : "stopwatch-running"; }

        if (this.props.preCont) {
            bef = React.cloneElement(this.props.preCont, { parState: this.state })
        }
        if (this.props.postCont) {
            aft = React.cloneElement(this.props.postCont, { parState: this.state })
        }


        return (
            <div className={"stopwatch-outer-wrap" + runningClass} {...this.props.outAttrs}>
                {bef}
                <div className="stopwatch-mid-wrap" {...this.props.midAttrs}>
                    <div className="stopwatch-inner-wrap" {...this.props.inAttrs}>{seggedTime}</div>
                    {controls}
                </div>
                {aft}
            </div>
        );
    }
}



export class Timer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            time: this.decodeTime(),
            start: true,
            done: true
        }
        this.ints = [604800000, 86400000, 3600000, 60000, 1000, 100, 10];
        this.segs = ['week', 'day', 'hr', 'min', 'sec', 'mil'];
        this.theTic = null;
    }

    decodeTime() {
        let time = parseInt(this.props.time);
        if (!isNaN(time)) { return time; }
        time = this.props.time.ms || 0;
        time += (this.props.time.s || 0) * 1000;
        time += (this.props.time.m || 0) * 60000;
        time += (this.props.time.h || 0) * 3600000;
        time += (this.props.time.d || 0) * 86400000;
        time += (this.props.time.w || 0) * 604800000;
        return time;
    }

    reset = () => {
        if (this.theTic) {
            clearInterval(this.theTic);
            this.theTic = null;
        }
        this.setState({
            time: this.decodeTime(),
            start: true,
            done: true
        });
    }

    getAcc = () => { return this.props.acc >= 0 && this.props.acc < this.ints.length ? this.props.acc : 4; }

    startTicking = () => {
        let acc = this.getAcc();
        this.theTic = setInterval(this.tic, this.ints[acc] - 1);
    }

    toggleStart = () => {
        if (this.state.done) { this.reset(); }
        if (this.theTic) {
            clearInterval(this.theTic);
            this.theTic = null;
        } else { this.startTicking(); }
        this.setState((prevState) => ({ start: !prevState.start }));
    }

    tic = () => {
        let acc = this.getAcc();
        if (this.state.time - this.ints[acc] <= 0) {
            clearInterval(this.theTic);
            this.setState({ time: 0, start: true, done: true });
            return;
        }
        this.setState(prevState => ({ time: prevState.time - this.ints[acc], done: false }));
    }

    render() {
        let seggedTime = [];
        let bef, aft = null;
        let sep = "";
        let decPoint = this.ints.length - 2;// where 2 is the amount of digits before the decimal pt.
        let minim = this.props.top || 0;
        let prevInt = this.ints[this.ints.length - (minim + 1)];
        let acc = this.getAcc();

        let runningClass = "timer-ready";
        if (!this.state.done) { runningClass = this.state.start ? "timer-paused" : "timer-running"; }
        else if (this.state.time <= 0) { runningClass = "timer-done"; }

        if (this.props.preCont) {
            bef = React.cloneElement(this.props.preCont, { parState: this.state })
        }
        if (this.props.postCont) {
            aft = React.cloneElement(this.props.postCont, { parState: this.state })
        }

        for (let i = minim, max = acc >= decPoint ? decPoint + 1 : acc + 1; i < max; i++) {
            let padding = this.ints[i] < 86400000 ? 2 : 0;
            let timeValue = this.ints[i] < 1000 ? (this.state.time % 1000) : (Math.floor(this.state.time % prevInt / this.ints[i]));
            timeValue = timeValue.toString().padStart(padding, "0");
            if (this.ints[i] < 1000) { timeValue = timeValue.substr(0, acc - decPoint + 1); }
            seggedTime.push(
                <span className={"clock-" + this.segs[i]}>{sep}{timeValue}</span>
            )
            sep = this.ints[i] > 1000 ? (this.props.sep !== undefined ? this.props.sep : ":") : (this.props.msep !== undefined ? this.props.msep : ".");
            prevInt = this.ints[i];
        }
        let controls = this.props.noctrl ? null :
            (<div className={"timer-controls " + runningClass}>
                <button type="button" className="start-toggle" onClick={this.toggleStart}>{this.state.start ? (!this.state.done ? "Continue" : "Start") : "Pause"} </button>
                <button type="button" className="reset" onClick={this.reset}>Reset</button>
            </div>
            );
        return (
            <div className={"timer-outer-wrap" + runningClass} {...this.props.outAttrs}>
                {bef}
                <div className="timer-mid-wrap" {...this.props.midAttrs}>
                    <div className="timer-inner-wrap" {...this.props.inAttrs}>{seggedTime}</div>
                    {controls}
                </div>
                {aft}
            </div>
        );
    }
}

export default Clock;
