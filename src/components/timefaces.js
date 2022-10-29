import { useRef , useEffect, useState} from "react";
const CLASS_KEY ={};

export const MiliSecs=({val,tol=0})=>{
        const r = useRef(0);
        useEffect(()=>r.current++)
        const acc = Math.abs(3-tol);
        const resval = Math.pow(10,acc);
        return <span className="miliSecs">{Math.floor(val.msecs/resval).toString().padStart(tol,'0')}({r.current})</span>
}

const TimeSeg=({time, k, setting, tol=0, lang='eng-US', nospan=false})=>{
        const r = useRef(0);
        useEffect(()=>r.current++);
        const res =(k === 'msecs' || tol < 3)  ? Math.floor(time/Math.pow(10,tol)).toString().padStart('0',3-tol) : time.toLocaleString(lang, { [k]: setting });
        return nospan ? res : <span className={CLASS_KEY[k]}>{res}({r.current})</span>  ;
}

export const MSecs=({tol=0, nospan=false, offset=0})=>{
        const wtol = tol>2 ? 2 : tol<0 ? 0 : tol ;
        const [time, setTime] = useState(new Date(new Date().getTime()+offset));
        useEffect(()=>{ window.requestAnimationFrame(()=>setTime(new Date(new Date().getTime()+offset)))});
        return <TimeSeg time={time} k ='msecs' tol={wtol} nospan={nospan}/>
}

export const Secs=({nospan=false, offset=0  ,setting='numeric'})=>{
        const [time, setTime] = useState(new Date(new Date().getTime()+offset));
        useEffect(()=>{ window.requestAnimationFrame(()=>setTime(new Date(new Date().getTime()+offset)))});
        return <TimeSeg time={time}  k ='second'  setting={setting} tol={3} nospan={nospan}/>
}

export const Mins=({nospan=false, offset=0, setting='numeric'})=>{
        const [time, setTime] = useState(new Date(new Date().getTime()+offset));
        useEffect(()=>{
                const leap = time%60000 || 60000;
                setTimeout(()=>setTime(new Date(new Date().getTime()+offset)), leap)
         },[time, offset]);
        return <TimeSeg time={time} k ='minute' setting={setting} tol={4} nospan={nospan}/>
}

export const NewClock=({ offset=0, depth=0, lang='eng-US', face})=>{
        const Face =  face || (({time})=>{ return <span>{time.getTime()}</span> });
        const theTime = useRef(new Date(new Date().getTime()+offset));
        const oldTime = useRef(0);
        const [rendTime, setRendTime ] = useState(theTime.current);
        const  tic = useRef(()=>{
                const reqID = window.requestAnimationFrame(()=>{
                        theTime.current = new Date(new Date().getTime()+offset);
                        if(checkThreshold(oldTime.current, theTime.current, depth)){
                                setRendTime(()=>theTime.current );
                                // console.log(theTime.current ,  rendTime);
                                oldTime.current  = theTime.current;
                         }
                        tic.current();
                });
                return reqID;
        }, [rendTime]);

        useEffect(()=>{
                const reqID= tic.current();
                return ()=> window.cancelAnimationFrame(reqID);
        }, [] );
        return <div className="clock"><Face time={rendTime} lang={lang}/></div>
}


function checkThreshold (t1,t2,tol){
        if (t2<t1) { return false;}
        const tics =  [1,10,100,'second','minute','hour','day','month','year'][tol];
        if  (tol<3){ return Math.floor(t2/tics) !== Math.floor(t1/tics);}
        return  t2.toLocaleString('eng-US',{[tics]:'2-digit'}) !== t1.toLocaleString('eng-US',{[tics]:'2-digit'});
}

export const ClockFace1 = ({time, lang='eng-US'})=>{
        return <span>{time.toLocaleString('eng-US')}:{(time%1000).toString().padStart(3,'0')}</span>

}
