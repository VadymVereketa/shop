import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import BlockWrapperOrder from '../../common/BlockWrapperOrder';
import MyText from '../../controls/MyText';
import {getFontFamily} from '../../../utils/getFontFamily';
import {sizes, useTheme} from '../../../context/ThemeContext';
import {ThirdStepScreenProps} from '../../navigators/Order.navigator';
import BlockPayment from '../../common/BlockPayment';
import {useCreateOrder} from '../../../useHooks/useCreateOrder';
import t from '../../../utils/translate';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {actionsOrder, selectorsOrder} from '../../../redux/order/orderReducer';
import {
  DEFAULT_NAME_SETTING,
  TypeDelivery,
} from '../../../constants/constantsId';
import {selectorsOther} from '../../../redux/other/otherReducer';
import service from '../../../services/service';

const ThirdStepScreen = React.memo(
  ({navigation, route}: ThirdStepScreenProps) => {
    const dispatch = useDispatch();
    const {loading, submit} = useCreateOrder();
    const idSellPoint = useSelector(selectorsOrder.getSellPointId);
    const isExpress = useSelector(selectorsOrder.isDeliveryExpress);
    const deliveryType = useSelector(selectorsOrder.getDeliveryType);
    let date = useSelector(selectorsOrder.getDate)!;
    const time = useSelector(selectorsOrder.getTime)!;
    const name = useMemo(() => {
      return deliveryType === null
        ? DEFAULT_NAME_SETTING
        : deliveryType.code === TypeDelivery.courier
        ? DEFAULT_NAME_SETTING
        : idSellPoint === null
        ? DEFAULT_NAME_SETTING
        : idSellPoint;
    }, [idSellPoint, deliveryType]);
    const settings = useSelector(selectorsOther.getSetting(name));

    const handleContinue = async () => {
      if (!isExpress) {
        let currentDate = await service.getCurrentTime();
        currentDate.setMinutes(currentDate.getMinutes() + settings.offset - 15);
        const [h, m] = time.split(':').map(parseFloat);
        date.setHours(h, m);
        if (currentDate.getTime() >= date.getTime()) {
          Toast.show('Виберіть будь ласка дату');
          dispatch(
            actionsOrder.setData({
              date: null,
              time: '',
            }),
          );
          navigation.navigate('SecondStep', {});
          return;
        }
      }

      const res = await submit();
      if (res) {
        navigation.navigate('FinalStep', {});
      }
    };

    return (
      <BlockWrapperOrder isLoading={loading} handleContinue={handleContinue}>
        <MyText style={styles.text}>{t('commonSelectWayPayment')}</MyText>
        <BlockPayment />
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
  item: {
    marginBottom: sizes[6],
  },
});

export default ThirdStepScreen;
