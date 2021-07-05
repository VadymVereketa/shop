import React from 'react';
import {Linking, Modal, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {sizes, useTheme} from '../../context/ThemeContext';
import {getFontFamily} from '../../utils/getFontFamily';
import {isIOS} from '../../utils/isPlatform';
import DesignIcon from '../common/DesignIcon';
import MyButton from '../controls/MyButton';
import MyText from '../controls/MyText';
import MyModal from './MyModal';

interface IModalUpdateAppProps {
  modalVisible: boolean;
  onClose: any;
  isRequired?: boolean;
}

const width = responsiveScreenWidth(100) - sizes[40];

const ModalUpdateApp = ({
  modalVisible,
  onClose,
  isRequired = false,
}: IModalUpdateAppProps) => {
  const {border, lightText} = useTheme();

  const handleUpdate = async () => {
    await Linking.openURL(
      isIOS
        ? 'https://apps.apple.com/ua/app/egersund/id1529261110'
        : 'https://play.google.com/store/apps/details?id=com.egersund_mobile_app',
    );
  };

  return (
    <MyModal
      modalVisible={modalVisible}
      onClose={onClose}
      title="Оновіть додаток">
      <View
        style={{
          padding: sizes[15],
          alignItems: 'center',
        }}>
        <DesignIcon name="UpdateApp" size={responsiveScreenWidth(40)} fill="" />
        <MyText style={styles.mainText}>
          Роботу додатку покращено! У ній виправлені помилки і додані корисні
          функції.
        </MyText>
        <MyText style={[styles.subText, {color: lightText}]}>
          Зазвичай оновлення займає не більше хвилини
        </MyText>
        <MyButton
          onPress={handleUpdate}
          style={{
            marginBottom: sizes[6],
          }}>
          Оновити
        </MyButton>
        {!isRequired && (
          <MyButton type={'default'} onPress={onClose}>
            Пропустити
          </MyButton>
        )}
      </View>
    </MyModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width,
    backgroundColor: 'white',
    position: 'absolute',
  },
  title: {
    textAlign: 'center',
    fontSize: sizes[12],
    fontFamily: getFontFamily('400'),
    paddingVertical: sizes[6],
  },
  mainText: {
    textAlign: 'center',
    fontSize: sizes[9],
    fontFamily: getFontFamily('400'),
    marginTop: sizes[10],
  },
  subText: {
    textAlign: 'center',
    fontSize: sizes[8],
    fontFamily: getFontFamily('400'),
    marginTop: sizes[6],
    marginBottom: sizes[6],
  },
});
export default ModalUpdateApp;
