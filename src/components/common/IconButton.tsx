import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {StyleSheet, TouchableWithoutFeedbackProps} from 'react-native';
import DesignIcon, {IDesignIconProps} from './DesignIcon';

interface IIconButtonProps extends TouchableWithoutFeedbackProps {
  icon: IDesignIconProps;
}
const IconButton = ({icon, style = {}, ...props}: IIconButtonProps) => {
  return (
    <TouchableOpacity style={[styles.con, style]} {...props}>
      <DesignIcon {...icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  con: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default IconButton;
