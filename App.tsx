import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {useTheme} from './src/context/ThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import {View, Text, Dimensions, ScrollView, TextInput} from 'react-native';
import Svg, { Path } from "react-native-svg"
import {getFontFamily} from './src/utils/getFontFamily';
import {
  responsiveHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import ScalableText from 'react-native-text';

function SvgComponent(props: any) {
  return (
    <Svg width={100} height={100} fill={'red'} {...props}>
      <Path
        scale={[5]}
        fill="red"
        d="M8 8l6.7-6.7c.3-.3.3-.8 0-1.1s-.8-.3-1.1 0L7.5 6.4 1.3.2C1-.1.5-.1.2.2s-.3.8 0 1.1L7 8c.3.3.7.3 1 0z"
      />
    </Svg>
  )
}

const MyText = (props: any) => {

  return (
    <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center'}}>

    </View>
  )
};

const icons = ['restaurant',
  'store',
  'eye',
  'map',
  'menu-more',
  'arrow',
  'arrow-right',
  'check-mark',
  'close',
  'copy',
  'fingerprint',
  'log-out',
  'next',
  'open-eye',
  'phone',
  'sale',
  'search',
  'share',
  'star-empty',
  'star-filled'];

function HomeScreen() {
  return (
    <ScrollView style={{ flex: 1}}>
      <View style={{
        width: '50%',
        height: 100,
        backgroundColor: 'grey'
      }}>

      </View>
    </ScrollView>
  );
}

const Stack = createStackNavigator();

const App = () => {
  const {theme, onChangeTheme, ...colors} = useTheme();

  const MyTheme = {
    dark: theme === 'dark',
    colors,
  };

  return <NavigationContainer theme={MyTheme}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>;
};

export default App;
