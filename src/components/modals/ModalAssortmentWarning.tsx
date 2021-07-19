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
  onConfirm: any;
}

const width = responsiveScreenWidth(100) - sizes[40];

const ModalAssortmentWarning = ({
  modalVisible,
  onClose,
  onConfirm,
}: IModalUpdateAppProps) => {
  const {border} = useTheme();

  return (
    <MyModal
      modalVisible={modalVisible}
      onClose={onClose}
      title="Зміна відображення асортименту">
      <View
        style={{
          alignItems: 'center',
        }}>
        <View
          style={{
            padding: sizes[10],
          }}>
          <MyText
            style={{
              fontSize: sizes[9],
            }}>
            Увага! При зміні способу доставки чи магазину,{' '}
            <MyText
              style={{
                fontFamily: getFontFamily('500'),
              }}>
              продукти з корзини будуть видалені
            </MyText>
            , оскільки асортимент відрізняється.
          </MyText>
        </View>
        <View
          style={{
            flexDirection: 'row',
            padding: sizes[10],
            borderTopWidth: 1,
            borderTopColor: border,
          }}>
          <MyButton
            style={{
              marginRight: sizes[4],
            }}
            onPress={onClose}
            type="default">
            Скасувати
          </MyButton>
          <MyButton
            onPress={onConfirm}
            style={{
              marginLeft: sizes[4],
            }}>
            Змінити
          </MyButton>
        </View>
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
export default ModalAssortmentWarning;
