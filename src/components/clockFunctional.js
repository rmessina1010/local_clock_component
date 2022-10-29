import { useState, useRef, useEffect } from "react";

const CLOCK_CLASS ='clock';

function getTimeInfo(opts={},lang='eng-US'){
    const time = new Date(new Date().getTime() + (opts.s || 0) );
    return {
        msecs: time%1000,
        hmt: time.getHours(),
        hours: time.getHours() % 12 || 12,
        merid: time.getHours()>11  ? 'am': 'pm',
        mins: time.getMinutes().toString().padStart(2, '0'),
        secs: time.getSeconds().toString().padStart(2, '0'),
        wd: time.toLocaleString(lang, { weekday: opts.wd || "long" }),
        day: time.toLocaleString(lang, { day: opts.wd || "numeric" }),
        month: time.toLocaleString(lang, { month: opts.wd || "long" }),
        year: time.toLocaleString(lang, { year: opts.wd || "numeric" }),
        tz: time.toLocaleString(lang, { timeZoneName: opts.wd || "long" })
    }
}

export const Clock = ({opts={}, lang='eng-US', tol=0, face=()=><div>NO FACE</div>, controls})=>{
        let rends = useRef(0);
        let clockf = useRef(face);
        const [time,setTime] = useState({});
        const  intervals = [60000, 3600000, 86400000]

        const tic = useRef(()=>{
            if  (tol < 5){
                window.requestAnimationFrame( ()=>{
                    setTime(getTimeInfo(opts,lang));
                    tic.current();
                });
                return;
            }
            const interv = (tol-5)< intervals.length-1 ? tol-5 : intervals.length-1 ;
            const intervTic = setInterval(
                ()=>{
                    setTime(getTimeInfo(opts,lang));
                    tic.current();
                }
            ,intervals[interv]);
            return ()=>clearInterval(intervTic);
        });

        useEffect(() => { tic.current();},[]);


        return(
            <div className={CLOCK_CLASS}>
                <div>renders: {rends.current}/{tol}</div>
                {clockf.current(time, tol)}
            </div>
        );
}