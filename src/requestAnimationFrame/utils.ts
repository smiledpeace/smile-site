import { padZero } from '../utils/format/string';
import { type } from 'os';

export type TimeData = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function parseTimeData(time: number): TimeData {
    const days = Math.floor(time / DAY);
    const hours = Math.floor((time % DAY) / HOUR);
    const minutes = Math.floor((time % HOUR) / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);
    const milliseconds = Math.floor(time % SECOND);

    return {
        days,
        hours,
        minutes,
        seconds,
        milliseconds
    };
}

export function parseFormat(format: string, timeData: TimeData): string {
    const { days } = timeData;
    let { hours, minutes, seconds, milliseconds } = timeData;

    if (format.indexOf('DD') === -1) {
        hours += days * 24;
    } else {
        format = format.replace('DD', padZero(days));
    }

    if (format.indexOf('HH') === -1) {
        minutes += hours * 60;
    } else {
        format = format.replace('HH', padZero(hours));
    }

    if (format.indexOf('mm') === -1) {
        seconds += minutes * 60;
    } else {
        format = format.replace('mm', padZero(minutes));
    }

    if (format.indexOf('ss') === -1) {
        milliseconds += seconds * 1000;
    } else {
        format = format.replace('ss', padZero(seconds));
    }

    return format.replace('SSS', padZero(milliseconds, 3));
}

export function isSameSecond(time1: number, time2: number): boolean {
    return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}
type cofig = {
    "yyyy": number;
    "yy": string;
    "M": number;
    "MM": string;
    "d": number;
    "dd": string;
    "h": number;
    "hh": string;
    "mm": string;
    "ss": string
}
export function formatDate(arg:(string), format='yyyy-MM-dd hh:mm:ss'):string {
    let date:Date = new Date();
    if (Object.prototype.toString.call(arg) != '[object Date]') {
        date = new Date(arg.replace(/-/g, "/"));
    }
    var paddNum = function (num:number):string {
        var tempstr:string = num + "";
        
        return tempstr.replace(/^(\d)$/, "0$1");
    }
    //指定格式字符
    var cfg:Record<string, any> = {
        "yyyy": date.getFullYear() //年 : 4位
        ,
        "yy": date.getFullYear().toString().substring(2) //年 : 2位
        ,
        "M": date.getMonth() + 1 //月 : 如果1位的时候不补0
        ,
        "MM": paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
        ,
        "d": date.getDate() //日 : 如果1位的时候不补0
        ,
        "dd": paddNum(date.getDate()) //日 : 如果1位的时候补0
        ,
        "h": date.getHours() //时
        , 
        "hh": paddNum(date.getHours()) //时
        ,
        "mm": paddNum(date.getMinutes()) //分
        ,
        "ss": paddNum(date.getSeconds()) //秒
    }
    return format.replace(/([a-z])(\1)*/ig, function (m:string) {
        return cfg[m];
    });
}
