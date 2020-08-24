import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet, TouchableOpacityProps} from 'react-native';
import DesignIcon, {IDesignIconProps} from '../common/DesignIcon';

interface IIconButtonProps extends TouchableOpacityProps {
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
    justifyContent: 'center',
  },
});
export default IconButton;
