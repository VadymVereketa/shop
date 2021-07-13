import React from 'react';
import {Modal, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {sizes, useTheme} from '../../context/ThemeContext';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';

interface IMyModalProps {
  modalVisible: boolean;
  onClose: any;
  isClose?: boolean;
  children?: any;
  style?: StyleProp<ViewStyle>;
  title?: string;
}

const MyModal = React.memo(
  ({modalVisible, onClose, children, isClose, style, title}: IMyModalProps) => {
    const {text, primary, background, border} = useTheme();

    return (
      <Portal>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <GestureHandlerRootView style={{flex: 1}}>
            <View
              style={[
                styles.centeredView,
                {
                  backgroundColor: 'rgba(60, 65, 98, 0.8)',
                },
              ]}>
              <View
                style={[
                  styles.modalView,
                  {
                    backgroundColor: background,
                  },
                  style,
                ]}>
                {title && (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: border,
                    }}>
                    <MyText style={[styles.title]}>{title}</MyText>
                  </View>
                )}
                {children}
              </View>
            </View>
          </GestureHandlerRootView>
        </Modal>
      </Portal>
    );
  },
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: responsiveScreenWidth(100) - sizes[20],
    backgroundColor: 'white',
    position: 'absolute',
  },
  btn: {
    position: 'absolute',
    right: sizes[20],
    top: sizes[20],
    zIndex: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: sizes[12],
    fontFamily: getFontFamily('400'),
    paddingVertical: sizes[6],
  },
});
export default MyModal;
