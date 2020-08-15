import React from 'react';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {
  TouchableNativeFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';
import DesignIcon, {IDesignIconProps} from './DesignIcon';

interface IIconButtonProps extends TouchableWithoutFeedbackProps {
  icon: IDesignIconProps;
}
const IconButton = ({icon, ...props}: IIconButtonProps) => {
  return (
    <TouchableWithoutFeedback {...props}>
      <DesignIcon {...icon} />
    </TouchableWithoutFeedback>
  );
};

export default IconButton;
