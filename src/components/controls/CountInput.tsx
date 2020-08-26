import React, {useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {sizes, useTheme} from '../../context/ThemeContext';
import {GhostButton} from './MyButton';
import {
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import IconButton from './IconButton';
import DesignIcon from '../common/DesignIcon';
import {useFormattingContext} from '../../context/FormattingContext';
import {FRACTION_DIGIT} from '../../constants/constantsId';
import useDidUpdateEffect from '../../useHooks/useDidUpdateEffect';
import MyText from './MyText';

interface ICountInputProps {
  isWeightUnit: boolean;
  onChange: (o: number) => any;
  value: number;
  isEditable?: boolean;
  style?: StyleProp<ViewStyle>;
}

const compateFloat = (a: number, b: number, c: number) => {
  return a - b <= c;
};

const iconSize = sizes[7];

const CountInput = React.memo(
  ({
    isEditable = true,
    isWeightUnit,
    onChange,
    value,
    style,
  }: ICountInputProps) => {
    const {primary, lightBackground} = useTheme();
    const {formatUnit} = useFormattingContext();
    const min = isWeightUnit ? 0.01 : 1;
    const step = isWeightUnit ? 0.1 : 1;
    const max = 100;

    const [count, setCount] = useState(value);
    const [isEdit, setIsEdit] = useState(false);

    const handleChange = (value: any) => {
      if (!isWeightUnit && value.search(/\./) !== -1) {
        return;
      }
      const n = +value;
      if (isNaN(n)) return;
      let res = value.match(/\.\d+/g);
      if (res && res[0].length > FRACTION_DIGIT + 1) return;
      setCount(value);
    };

    const handleBlur = () => {
      setIsEdit(false);
      let newValue = +count;
      if (newValue < min) {
        onChange(min);
        newValue = min;
      } else if (newValue > max) {
        onChange(max);
        newValue = max;
      } else {
        onChange(newValue);
      }
      setCount(newValue);
    };

    const incr = (e) => {
      if (Math.fround(count) < 0.1) {
        setCount((c) => {
          const res = c + 0.01;
          onChange(res);
          return res;
        });
      } else {
        if (count + step > max) return;

        setCount((c) => {
          const res = c + step;
          onChange(res);
          return res;
        });
      }
    };

    const decr = (e) => {
      if (compateFloat(count, 0.1, 0.01)) {
        if (compateFloat(count, 0.01, 0.001)) return;
        setCount((c) => {
          const res = c - 0.01;
          onChange(res);
          return res;
        });
      } else {
        if (count - step <= 0) return;

        setCount((c) => {
          const res = c - step;
          onChange(res);
          return res;
        });
      }
    };

    const handleEdit = () => {
      if (isEditable) {
        setCount((c) => {
          return +c.toFixed(FRACTION_DIGIT);
        });
        setIsEdit(true);
      }
    };

    useDidUpdateEffect(() => {
      setCount(value);
    }, [value]);

    return (
      <View style={[styles.con, style, {backgroundColor: lightBackground}]}>
        <IconButton
          onPress={decr}
          icon={{
            name: isWeightUnit ? 'arrow-right' : 'minus',
            fill: primary,
            size: iconSize,
          }}
          style={[
            styles.incrBtn,
            {
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            },
          ]}
        />
        {isEdit ? (
          <TextInput
            autoFocus
            keyboardType={'numeric'}
            style={[styles.inputText, {color: primary}]}
            onBlur={handleBlur}
            value={count.toString()}
            onChangeText={handleChange}
          />
        ) : (
          <MyText
            onPress={handleEdit}
            style={[styles.inputText, {color: primary}]}>
            {formatUnit(count, isWeightUnit ? 'кг' : 'other')}
          </MyText>
        )}
        <IconButton
          onPress={incr}
          style={styles.incrBtn}
          icon={{
            name: isWeightUnit ? 'arrow-right' : 'plus',
            fill: primary,
            size: iconSize,
          }}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  con: {
    flexDirection: 'row',
    borderRadius: sizes[1],
    alignItems: 'center',
    flex: 1,
  },
  incrBtn: {
    paddingHorizontal: sizes[7],
    paddingVertical: sizes[10],
  },
  inputText: {
    fontSize: sizes[10],
    textAlign: 'center',
    flexGrow: 1,
  },
});
export default CountInput;
