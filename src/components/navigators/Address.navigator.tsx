import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  AddressNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import IconButton from '../controls/IconButton';
import {sizes, useTheme} from '../../context/ThemeContext';
import AddressScreen from '../screens/Address.navigator/Address.screen';
import BuildScreen, {IExtra} from '../screens/Address.navigator/Build.screen';
import CityScreen from '../screens/Address.navigator/City.screen';
import StreetScreen from '../screens/Address.navigator/Street.screen';
import t from '../../utils/translate';
import {IOption} from '../../useHooks/useAvailableDate';

export type AddressNavigatorParamList = {
  Address: {
    city?: any;
    street?: IOption<number>;
    build?: IOption<number, IExtra>;
  };
  Build: {
    street: IOption<number>;
  };
  City: {
    cities: any[];
    city: any;
  };
  Street: {};
};

type AddressScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AddressNavigatorParamList, 'Address'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type AddressScreenRouteProp = RouteProp<AddressNavigatorParamList, 'Address'>;

export type AddressScreenProps = {
  route: AddressScreenRouteProp;
  navigation: AddressScreenNavigationProp;
};

type BuildScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AddressNavigatorParamList, 'Build'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type BuildScreenRouteProp = RouteProp<AddressNavigatorParamList, 'Build'>;

export type BuildScreenProps = {
  route: BuildScreenRouteProp;
  navigation: BuildScreenNavigationProp;
};

type CityScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AddressNavigatorParamList, 'City'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type CityScreenRouteProp = RouteProp<AddressNavigatorParamList, 'City'>;

export type CityScreenProps = {
  route: CityScreenRouteProp;
  navigation: CityScreenNavigationProp;
};

type StreetScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AddressNavigatorParamList, 'Street'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type StreetScreenRouteProp = RouteProp<AddressNavigatorParamList, 'Street'>;

export type StreetScreenProps = {
  route: StreetScreenRouteProp;
  navigation: StreetScreenNavigationProp;
};

const Stack = createStackNavigator<AddressNavigatorParamList>();

const AddressNavigator = React.memo(
  ({navigation}: AddressNavigatorScreenProps) => {
    const {text} = useTheme();
    return (
      <Stack.Navigator
        initialRouteName={'Address'}
        keyboardHandlingEnabled={true}
        screenOptions={{
          headerTruncatedBackTitle: '',
          headerBackTitle: '',
          headerLeft: (props) => {
            return (
              <IconButton
                style={{
                  paddingLeft: sizes[5],
                }}
                onPress={
                  props.canGoBack
                    ? props.onPress
                    : () => navigation.push('MainNavigator', {})
                }
                icon={{
                  name: 'close',
                  size: sizes[10],
                  fill: text,
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          name="Address"
          component={AddressScreen}
          options={{
            title: t('addressScreen'),
          }}
        />
        <Stack.Screen
          name="Build"
          component={BuildScreen}
          options={{
            title: t('addressBuild'),
          }}
        />
        <Stack.Screen
          name="City"
          component={CityScreen}
          options={{
            title: t('addressCity'),
          }}
        />
        <Stack.Screen
          name="Street"
          component={StreetScreen}
          options={{
            title: t('addressStreet'),
          }}
        />
      </Stack.Navigator>
    );
  },
);

export default AddressNavigator;
