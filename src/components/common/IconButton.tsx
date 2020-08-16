import React from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {StyleSheet, TouchableWithoutFeedbackProps} from 'react-native';
import DesignIcon, {IDesignIconProps} from './DesignIcon';

interface IIconButtonProps extends TouchableWithoutFeedbackProps {
  icon: IDesignIconProps;
}
const IconButton = ({icon, style = {}, ...props}: IIconButtonProps) => {
  return (
    <TouchableWithoutFeedback style={[styles.con, style]} {...props}>
      <DesignIcon {...icon} />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  con: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default IconButton;
