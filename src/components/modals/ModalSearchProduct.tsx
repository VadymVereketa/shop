import React, {useState} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colorWithOpacity, sizes, useTheme} from '../../context/ThemeContext';
import t from '../../utils/translate';
import IconButton from '../controls/IconButton';
import MyTextInput from '../controls/MyTextInput';

interface IModalSearchProductProps {
  modalVisible: boolean;
  onClose: any;
  defaultSearch?: string;
  onSubmit: (search: string) => void;
  isInnerSearch: boolean;
}

const ModalSearchProduct = ({
  isInnerSearch,
  modalVisible,
  onClose,
  onSubmit,
  defaultSearch = '',
}: IModalSearchProductProps) => {
  const insets = useSafeAreaInsets();
  const {background, lightBackground, text} = useTheme();
  const [search, setSearch] = useState(defaultSearch);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(search);
    if (!isInnerSearch) {
      onClose();
    }
  };

  const handleClear = () => {
    setSearch('');
  };

  return (
    <Portal>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <GestureHandlerRootView style={{flex: 1}}>
          <View
            style={[
              styles.topView,
              {
                backgroundColor: background,
                paddingTop: insets.top || sizes[5],
              },
            ]}>
            <IconButton
              style={styles.backIcon}
              onPress={handleClose}
              icon={{
                name: 'arrow',
                size: sizes[12],
                fill: text,
              }}
            />
            <MyTextInput
              autoFocus
              styleCon={{
                flexGrow: 1,
              }}
              placeholder={t('tiSearchPlaceholder')}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSubmit}
              afterIcon={{
                name: 'close',
                onPress: handleClear,
              }}
            />
          </View>
          <ScrollView
            style={{
              backgroundColor: colorWithOpacity(lightBackground, 0.8),
            }}></ScrollView>
        </GestureHandlerRootView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  topView: {
    paddingVertical: sizes[5],
    paddingHorizontal: sizes[7],
    flexDirection: 'row',
    alignItems: 'center',

    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: 'rgb(60, 65, 98)',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 2,
  },

  backIcon: {
    paddingRight: sizes[7],
    flexGrow: 1,
  },
});
export default ModalSearchProduct;
