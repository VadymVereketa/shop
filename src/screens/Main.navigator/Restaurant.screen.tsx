import React from 'react';
import {View, StyleSheet, Text, PixelRatio} from 'react-native';
import {RestaurantScreenProps} from '../../navigators/Main.navigator';
import {sizes} from '../../context/ThemeContext';
import { Dimensions } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const window = Dimensions.get('window');

const RestaurantScreen = ({navigation, route}: RestaurantScreenProps) => {
  const insets = useSafeAreaInsets();
  const [items, setItems] = React.useState([
    { name: 'TURQUOISE', code: '#1abc9c' },
    { name: 'EMERALD', code: '#2ecc71' },
    { name: 'PETER RIVER', code: '#3498db' },
    { name: 'AMETHYST', code: '#9b59b6' },
    { name: 'WET ASPHALT', code: '#34495e' },
    { name: 'GREEN SEA', code: '#16a085' },
    { name: 'NEPHRITIS', code: '#27ae60' },
    { name: 'BELIZE HOLE', code: '#2980b9' },
    { name: 'WISTERIA', code: '#8e44ad' },
    { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
    { name: 'SUN FLOWER', code: '#f1c40f' },
    { name: 'CARROT', code: '#e67e22' },
    { name: 'ALIZARIN', code: '#e74c3c' },
    { name: 'CLOUDS', code: '#ecf0f1' },
    { name: 'CONCRETE', code: '#95a5a6' },
    { name: 'ORANGE', code: '#f39c12' },
    { name: 'PUMPKIN', code: '#d35400' },
    { name: 'POMEGRANATE', code: '#c0392b' },
    { name: 'SILVER', code: '#bdc3c7' },
    { name: 'ASBESTOS', code: '#7f8c8d' },
  ]);
  return (
    <View style={[styles.container]}>
      <TouchableWithoutFeedback style={{
        margin: sizes[5],
      }} onPress={() => {
        navigation.navigate('SecondaryNavigator', { screen: 'Product' });
      }}>
        <Text style={{
          textTransform: 'uppercase',
          fontSize: sizes[9],
          color: 'white',
          backgroundColor: '#01a6e6',
          paddingHorizontal: sizes[13],
          paddingVertical: sizes[5],
        }}>замовити</Text>
      </TouchableWithoutFeedback>
      <Text style={{width: '100%'}}>{`${window.width}, ${window.height}, ${PixelRatio.get()}, ${window.fontScale}`}</Text>
      <Text style={{width: '100%'}}>{`${insets.bottom}, ${insets.top}, ${insets.left}, ${insets.right}`}</Text>
      <FlatGrid
        itemDimension={window.width / (Math.max(Math.floor(window.width / 200), 2))}
        data={items}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={-1}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { backgroundColor: item.code, margin: sizes[5]}]}>
            <Text style={{
              textTransform: 'uppercase',
              fontSize: sizes[10],
              color: 'white',
              backgroundColor: '#01a6e6',
              paddingHorizontal: sizes[13],
              paddingVertical: sizes[5],
            }}>замовити</Text>
          </View>
        )}
      />
     {/* <Text style={{width: '100%'}}>{`${window.width}, ${window.height}, ${PixelRatio.get()}, ${window.fontScale}`}</Text>
    <Text>{`${screen.width}, ${screen.height}, ${screen.scale}, ${screen.fontScale}`}</Text>
      {
        [1,2,3,4].map(_ => (
          <View style={{
              margin: fontSizes[5],
              backgroundColor: '#aaa'
          }}>
            <TouchableWithoutFeedback style={{
              margin: fontSizes[5],
            }} onPress={() => {
              navigation.navigate('SecondaryNavigator', { screen: 'Product' });
            }}>
              <Text style={{
                textTransform: 'uppercase',
                fontSize: fontSizes[9],
                color: 'white',
                backgroundColor: '#01a6e6',
                paddingHorizontal: fontSizes[13],
                paddingVertical: fontSizes[5],
              }}>замовити</Text>
            </TouchableWithoutFeedback>
          </View>
        ))
      }
      {
        [1,2,3,4, 5, 6, 7, 8].map(_ => (
          <View style={{
            backgroundColor: '#aaa',
            width: '25%'
          }}>
            <TouchableWithoutFeedback style={{
              margin: fontSizes[5],
            }} onPress={() => {
              navigation.navigate('SecondaryNavigator', { screen: 'Product' });
            }}>
              <Text style={{
                textTransform: 'uppercase',
                fontSize: fontSizes[5],
                color: 'white',
                backgroundColor: '#01a6e6',
                paddingHorizontal: fontSizes[5],
                paddingVertical: fontSizes[5],
              }}>замовити</Text>
            </TouchableWithoutFeedback>
          </View>
        ))
      }*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridView: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

export default RestaurantScreen;
