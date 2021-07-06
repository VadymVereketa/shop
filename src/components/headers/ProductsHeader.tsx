import {StackHeaderProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {sizes, useTheme} from '../../context/ThemeContext';
import {selectorsCart} from '../../redux/cart/cartReducer';
import {selectorsOrder, actionsOrder} from '../../redux/order/orderReducer';
import {actionsOther} from '../../redux/other/otherReducer';
import {getSellPoints} from '../../redux/sellPoints/sellPointsReducer';
import useGetTranslateForDeliveryType from '../../useHooks/useGetTranslateForDeliveryType';
import {getFontFamily} from '../../utils/getFontFamily';
import DesignIcon from '../common/DesignIcon';
import IconButton from '../controls/IconButton';
import MyText from '../controls/MyText';
import WrapperHeader from './WrapperHeader';

interface IProductsHeaderProps extends StackHeaderProps {
  isBack: boolean;
}

const ProductsHeader = ({
  scene,
  navigation,
  isBack = true,
}: IProductsHeaderProps) => {
  const {text} = useTheme();
  const {headerRight} = scene.descriptor.options;
  const title = scene.descriptor.options.title || '';

  return (
    <WrapperHeader
      style={{
        justifyContent: 'space-between',
        paddingHorizontal: sizes[8],
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {isBack && (
          <IconButton
            onPress={() => navigation.goBack()}
            icon={{
              name: 'arrow',
              size: sizes[10],
              fill: text,
            }}
          />
        )}
        <MyText style={styles.title}>{title}</MyText>
      </View>
      {headerRight && headerRight({tintColor: text})}
    </WrapperHeader>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: getFontFamily('400'),
    fontSize: sizes[10],
    paddingLeft: sizes[7],
  },
});
export default ProductsHeader;
