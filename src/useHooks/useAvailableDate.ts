import {useSelector} from 'react-redux';
import {selectorsOther} from '../redux/other/otherReducer';
import {useCallback, useMemo} from 'react';
import {useFormattingContext} from '../context/FormattingContext';
import {DEFAULT_NAME_SETTING} from '../constants/constantsId';

export interface IOption<T> {
  label: string;
  value: T;
  extra?: any;
}

const formatter = new Intl.DateTimeFormat('uk', {
  hour: 'numeric',
  minute: 'numeric',
});
const formatterDate = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});
const compareTimes = (d1: Date, d2: Date) => {
  return d1.getTime() < d2.getTime();
};

const getOptionsTime = (d1: Date, d2: Date, offset = 60, isCourier = false) => {
  let optionsTime: IOption<string>[] = [];
  if (isCourier) {
    for (let d = new Date(d1); compareTimes(d, d2); ) {
      const second = new Date(d);
      second.setMinutes(second.getMinutes() + offset);
      const value = `${formatter.format(d)} - ${formatter.format(second)}`;
      optionsTime.push({
        value,
        label: value,
      });

      d.setMinutes(d.getMinutes() + offset);
    }

    if (d1.getMinutes() >= 40) {
      optionsTime.pop();
    }
  } else {
    for (let d = new Date(d1); compareTimes(d, d2); ) {
      const value = `${formatter.format(d)} - ${formatter.format(d)}`;
      optionsTime.push({
        value,
        label: `${formatter.format(d)}`,
      });

      d.setMinutes(d.getMinutes() + offset);
    }
  }
  return optionsTime;
};

const useAvailableDate = (keySetting: string) => {
  const {formatDate} = useFormattingContext();
  const settings = useSelector(selectorsOther.getSetting(keySetting));
  const constantTimes = useMemo(() => {
    const [fromH, fromM] = settings.from.split(':').map(parseFloat);
    const [toH, toM] = settings.to.split(':').map(parseFloat);
    const displayText = formatter.format(
      new Date(
        2000,
        0,
        1,
        toH,
        toM - settings.offset - (settings.step || 0),
        0,
        0,
      ),
    );
    if (keySetting === DEFAULT_NAME_SETTING) {
      return {
        min: new Date(2000, 0, 1, fromH, fromM, 0, 0),
        max: new Date(2000, 0, 1, toH, toM - settings.step!, 0, 0),
        MAX: new Date(2000, 0, 1, toH, toM, 0, 0),
        displayText,
      };
    }
    return {
      min: new Date(2000, 0, 1, fromH, fromM, 0, 0),
      max: new Date(2000, 0, 1, toH, toM, 0, 0),
      MAX: new Date(2000, 0, 1, toH, toM, 0, 0),
      displayText,
    };
  }, []);

  let startDate = new Date();
  let optionsDate: IOption<string>[] = [];
  startDate.setMinutes(
    startDate.getMinutes() + settings.offset + (settings.step || 0),
  );
  if (
    startDate.getHours() > constantTimes.MAX.getHours() ||
    (startDate.getHours() === constantTimes.MAX.getHours() &&
      startDate.getMinutes() > constantTimes.MAX.getMinutes())
  ) {
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
  } else {
    optionsDate.push({
      label: 'сьогоднi',
      value: formatterDate.format(startDate),
    });
    startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
  }

  for (let i = 1; i < 31; i += 1) {
    optionsDate.push({
      label: formatDate(startDate),
      value: formatterDate.format(startDate),
    });
    startDate.setDate(startDate.getDate() + 1);
  }
  const getTimeRanges = useCallback((date: string | Date) => {
    date = new Date(date);
    const currentDate = new Date();
    const isSameDate =
      currentDate.toLocaleDateString() === date.toLocaleDateString();

    currentDate.setMinutes(currentDate.getMinutes() + settings.offset);

    if (isSameDate && currentDate.getHours() >= constantTimes.min.getHours()) {
      let minutes = currentDate.getMinutes();
      minutes = Math.round(minutes / 15) * 15;

      return getOptionsTime(
        new Date(2000, 0, 1, currentDate.getHours(), minutes, 0, 0),
        constantTimes.MAX,
        settings.step,
        keySetting === DEFAULT_NAME_SETTING,
      );
    }
    return getOptionsTime(
      constantTimes.min,
      constantTimes.MAX,
      settings.step,
      keySetting === DEFAULT_NAME_SETTING,
    );
  }, []);
  return {
    optionsDate,
    getTimeRanges,
    displayText: constantTimes.displayText,
  };
};

export default useAvailableDate;
