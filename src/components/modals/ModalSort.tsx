import React, {useState} from 'react';
import {Modal, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Portal} from 'react-native-portalize';
import {sizes, useTheme} from '../../context/ThemeContext';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import TypeSortProduct, {
  useGetOptionsSortProduct,
} from '../../typings/TypeSortProduct';
import MyButton from '../controls/MyButton';
import DesignIcon from '../common/DesignIcon';

interface IMyModalProps {
  modalVisible: boolean;
  onClose: any;
  defaultSort: TypeSortProduct | null;
  onSelect: (s: TypeSortProduct | null) => void;
}

const ModalSort = React.memo(
  ({modalVisible, onClose, onSelect, defaultSort}: IMyModalProps) => {
    const [sort, setSort] = useState(defaultSort);
    const {text, primary, lightText, background, border} = useTheme();
    const options = useGetOptionsSortProduct();

    const findItem = options.find((opt) => opt.value === sort);

    const handleSubmit = () => {
      onSelect(sort);
      onClose();
    };

    const handleSelect = (value: TypeSortProduct) => {
      setSort((sort) => {
        return sort === value ? null : value;
      });
    };
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
                ]}>
                <MyText
                  style={[
                    styles.title,
                    {
                      color: lightText,
                    },
                  ]}>
                  Cортувати по:
                </MyText>
                <View
                  style={{
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderTopColor: lightText,
                    borderBottomColor: lightText,
                    paddingVertical: sizes[6],
                    marginBottom: sizes[10],
                  }}>
                  {options.map((opt) => {
                    const isSelected = findItem
                      ? findItem.value === opt.value
                      : false;

                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <MyText
                          onPress={() => handleSelect(opt.value)}
                          style={{
                            paddingVertical: sizes[4],
                            color: isSelected ? primary : text,
                            fontFamily: getFontFamily(
                              isSelected ? '500' : '300',
                            ),
                            fontSize: sizes[10],
                          }}>
                          {opt.label}
                        </MyText>
                        {isSelected && (
                          <DesignIcon
                            name="check-mark"
                            size={sizes[10]}
                            fill={primary}
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
                <MyButton onPress={handleSubmit}>Застосувати</MyButton>
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
    padding: sizes[10],
    paddingHorizontal: sizes[12],
  },
  title: {
    textAlign: 'center',
    fontSize: sizes[10],
    fontFamily: getFontFamily('300'),
    paddingVertical: sizes[4],
  },
});
export default ModalSort;
