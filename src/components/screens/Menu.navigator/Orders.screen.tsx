import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {
  LocationScreenProps,
  OrdersScreenProps,
} from '../../navigators/Menu.navigator';
import {ScrollView} from 'react-native-gesture-handler';
import {IOrderItem, IProduct} from '../../../typings/FetchData';
import {useAxios} from '../../../useHooks/useAxios';
import service from '../../../services/service';
import OrderItem from '../../common/OrderItem';
import {sizes} from '../../../context/ThemeContext';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const OrdersScreen = (props: OrdersScreenProps) => {
  const perPage = 6;
  const insets = useSafeAreaInsets();
  const [skip, setSkip] = useState(0);
  const [countItems, setCountItems] = useState(0);
  const [orders, setOrders] = useState([] as IOrderItem[]);
  const {isLoading, request} = useAxios(service.getOrders);

  useEffect(() => {
    handleRequest();
  }, []);

  const handleRequest = () => {
    request<any>({
      top: perPage,
      skip: skip * perPage,
    }).then((res) => {
      console.log(res);
      if (res.success) {
        setOrders((p) => {
          return [...p, ...res.data.items];
        });
        setCountItems(res.data.count);
      }
    });
  };

  const handleLoad = ({height, y}) => {
    if (height - y <= 50) {
      setSkip((s) => {
        return s + 1;
      });
    }
  };

  const handleEventScroll = (event) => {
    if (event.nativeEvent && countItems > orders.length && !isLoading) {
      const {
        contentOffset: {y},
        layoutMeasurement,
        contentSize,
      } = event.nativeEvent;
      handleLoad({y, height: contentSize.height - layoutMeasurement.height});
    }
  };

  return (
    <SafeAreaView style={[styles.container, {marginTop: -insets.top}]}>
      <ScrollView>
        {orders.map((o) => {
          return <OrderItem key={o.id} order={o} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: sizes[5],
    paddingTop: sizes[8],
  },
});

export default OrdersScreen;
