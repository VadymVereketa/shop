import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet, TouchableOpacityProps} from 'react-native';
import DesignIcon, {IDesignIconProps} from '../common/DesignIcon';
import withPreventDoubleClick from '../../utils/withPreventDoubleClick';

const TO = withPreventDoubleClick(TouchableOpacity);

interface IIconButtonProps extends TouchableOpacityProps {
  icon: IDesignIconProps;
}
const IconButton = ({icon, style = {}, ...props}: IIconButtonProps) => {
  return (
    <TO style={[styles.con, style]} {...props}>
      <DesignIcon {...icon} />
    </TO>
  );
};

const styles = StyleSheet.create({
  con: {
    justifyContent: 'center',
  },
});
export default IconButton;
