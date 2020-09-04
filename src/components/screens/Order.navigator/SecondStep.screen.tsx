import React from 'react';
import {StyleSheet} from 'react-native';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes} from '../../../context/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import BlockDelivery from '../../common/BlockDelivery';
import useDidUpdateEffect from '../../../useHooks/useDidUpdateEffect';
import {SecondStepScreenProps} from '../../navigators/Order.navigator';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import DateInput from '../../common/DateInput';
import BlockWrapperOrder from '../../common/BlockWrapperOrder';

const SecondStepScreen = React.memo(
  ({navigation, route}: SecondStepScreenProps) => {
    const params = route.params || {};
    const paramAddressId = params.idAddress;
    const paramOption = params.option;
    const dispatch = useDispatch();
    const disabled = useSelector(selectorsOrder.isAllowThirdStep);

    const handleContinue = () => {
      navigation.navigate('ThirdStep', {});
    };

    useDidUpdateEffect(() => {
      dispatch(
        actionsOrder.setData({
          addressId: paramAddressId,
        }),
      );
    }, [paramAddressId]);

    useDidUpdateEffect(() => {
      if (paramOption) {
        dispatch(
          actionsOrder.setData({
            date: paramOption.date,
            time: paramOption.time,
          }),
        );
      }
    }, [paramOption]);

    return (
      <BlockWrapperOrder disabled={disabled} handleContinue={handleContinue}>
        <MyText style={styles.text}>Оберіть спосіб отримання</MyText>
        <BlockDelivery navigate={'SecondStep'} />
        <DateInput navigate={'SecondStep'} />
      </BlockWrapperOrder>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    fontFamily: getFontFamily('500'),
    marginTop: sizes[5],
    marginBottom: sizes[8],
  },
});

export default SecondStepScreen;
