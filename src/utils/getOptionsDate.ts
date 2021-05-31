import {IOptionDate} from '../components/screens/Order.navigator/Date.screen';

interface ISetting {
  step: number;
  offset: number;
  from: string;
  to: string;
}

const getOptions = (
  {from, offset, step, to}: ISetting,
  currentDate: Date,
  isRange = false,
) => {
  let res: IOptionDate[] = [];
  const [fromH, fromM] = from.split(':').map(parseFloat);
  const [toH, toM] = to.split(':').map(parseFloat);

  let now = currentDate;

  let nowH = now.getHours();
  let nowM = now.getMinutes();

  const a = nowM % step;
  nowM = nowM + (a === 0 ? 0 : step - a);
  const minFrom = numberTime(fromH, fromM);
  const maxTo = numberTime(toH, toM);
  const timeNow = numberTime(nowH, nowM);

  if (timeNow < maxTo - offset) {
    const startTime = Math.max(timeNow + offset, minFrom);
    res = getPartOptions(now, startTime, maxTo, step, isRange);
  }
  for (let i = 1; i <= 2; i += 1) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    res.push(...getPartOptions(d, minFrom, maxTo, step, isRange));
  }
  res.forEach((_, i) => {
    _.value = i;
  });
  return res;
};

export const strTime = (n: number) => {
  const h = Math.floor(n / 60)
    .toString()
    .padStart(2, '0');
  const m = (n % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const numberTime = (h: number, m: number) => {
  return h * 60 + m;
};

const getPartOptions = (
  date: Date,
  start: number,
  end: number,
  step: number,
  isRange,
) => {
  const res: IOptionDate[] = [];
  for (let i = start; i < end; i += step) {
    const time = isRange ? `${strTime(i)} - ${strTime(i + step)}` : strTime(i);

    res.push({
      value: 0,
      date,
      time,
    });
  }
  return res;
};

export default getOptions;
