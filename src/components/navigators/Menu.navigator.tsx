import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  SecondaryNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import ProfileScreen from '../screens/Menu.navigator/Profile.screen';
import ChangePasswordScreen from '../screens/Menu.navigator/ChangePassword.screen';
import LocationScreen from '../screens/Menu.navigator/Location.screen';
import LoyaltyCardScreen from '../screens/Menu.navigator/LoyaltyCard.screen';
import SettingsScreen from '../screens/Menu.navigator/Settings.screen';
import CertificateScreen from '../screens/Menu.navigator/Certificate.screen';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import OrdersScreen from '../screens/Menu.navigator/Orders.screen';
import IconButton from '../controls/IconButton';
import {sizes, useTheme} from '../../context/ThemeContext';
import t from '../../utils/translate';
import {useSelector} from 'react-redux';
import {selectorsUser} from '../../redux/user/userReducer';
import {IContact, IOrderItem, ISellPoint} from '../../typings/FetchData';
import OrderScreen from '../screens/Menu.navigator/Order.screen';
import MenuScreen from '../screens/Main.navigator/Menu.screen';
import ResultScreen from '../screens/Secondary.navigator/Result.screen';
import ContactScreen from '../screens/Menu.navigator/Contact.screen';
import EditProfileScreen from '../screens/Menu.navigator/EditProfile.screen';
import {StyleSheet, View} from 'react-native';
import MyText from '../controls/MyText';
import {getFontFamily} from '../../utils/getFontFamily';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BarCodeScreen from '../screens/Menu.navigator/BarCode.screen';
import LocationsScreen from '../screens/Secondary.navigator/Locations.screen';

export type MenuNavigatorParamList = {
  Certificate: {};
  ChangePassword: {};
  Location: {
    sellPoint: ISellPoint;
  };
  Locations: {};
  LoyaltyCard: {};
  Profile: {};
  Settings: {};
  Orders: {};
  Order: {
    item: IOrderItem;
  };
  Contact: {
    contact?: IContact;
  };
  EditProfile: {
    field: 'phone' | 'email' | 'name';
  };
  BarCode: {
    orderNumber: number;
  };
};

/// Certificate props
type CertificateScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Certificate'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type CertificateScreenRouteProp = RouteProp<
  MenuNavigatorParamList,
  'Certificate'
>;

export type CertificateScreenProps = {
  route: CertificateScreenRouteProp;
  navigation: CertificateScreenNavigationProp;
};
/// Certificate props

/// ChangePassword props
type ChangePasswordScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'ChangePassword'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ChangePasswordScreenRouteProp = RouteProp<
  MenuNavigatorParamList,
  'ChangePassword'
>;

export type ChangePasswordScreenProps = {
  route: ChangePasswordScreenRouteProp;
  navigation: ChangePasswordScreenNavigationProp;
};
/// ChangePassword props

/// Location props
type LocationScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Location'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type LocationScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Location'>;

export type LocationScreenProps = {
  route: LocationScreenRouteProp;
  navigation: LocationScreenNavigationProp;
};
/// Location props

/// LoyaltyCard props
type LoyaltyCardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'LoyaltyCard'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type LoyaltyCardScreenRouteProp = RouteProp<
  MenuNavigatorParamList,
  'LoyaltyCard'
>;

export type LoyaltyCardScreenProps = {
  route: LoyaltyCardScreenRouteProp;
  navigation: LoyaltyCardScreenNavigationProp;
};
/// LoyaltyCard props

/// Profile props
type ProfileScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Profile'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ProfileScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Profile'>;

export type ProfileScreenProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};
/// Profile props

/// Settings props
type SettingsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Settings'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type SettingsScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Settings'>;

export type SettingsScreenProps = {
  route: SettingsScreenRouteProp;
  navigation: SettingsScreenNavigationProp;
};
/// Settings props

/// Orders props
export type OrdersScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Orders'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type OrdersScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Orders'>;

export type OrdersScreenProps = {
  route: OrdersScreenRouteProp;
  navigation: OrdersScreenNavigationProp;
};
/// Orders props

/// Order props
type OrderScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Order'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type OrderScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Order'>;

export type OrderScreenProps = {
  route: OrderScreenRouteProp;
  navigation: OrderScreenNavigationProp;
};
/// Order props

/// Contact props
export type ContactScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'Contact'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ContactScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Contact'>;

export type ContactScreenProps = {
  route: ContactScreenRouteProp;
  navigation: ContactScreenNavigationProp;
};
/// Contact props

/// EditProfile props
export type EditProfileScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'EditProfile'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type EditProfileScreenRouteProp = RouteProp<
  MenuNavigatorParamList,
  'EditProfile'
>;

export type EditProfileScreenProps = {
  route: EditProfileScreenRouteProp;
  navigation: EditProfileScreenNavigationProp;
};
/// EditProfile props

/// BarCode props
export type BarCodeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList, 'BarCode'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type BarCodeScreenRouteProp = RouteProp<MenuNavigatorParamList, 'BarCode'>;

export type BarCodeScreenProps = {
  route: BarCodeScreenRouteProp;
  navigation: BarCodeScreenNavigationProp;
};
/// BarCode props

const Stack = createStackNavigator<MenuNavigatorParamList>();

const MenuNavigator = React.memo(
  ({navigation}: SecondaryNavigatorScreenProps) => {
    const {text, background, border} = useTheme();
    const insets = useSafeAreaInsets();
    return (
      <Stack.Navigator
        initialRouteName={'Profile'}
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
                    : () => navigation.push('MenuNavigator', {})
                }
                icon={{
                  name: 'arrow',
                  size: sizes[10],
                  fill: text,
                }}
              />
            );
          },
          headerTitleAlign: 'center',
          headerStyle: {
            shadowOpacity: 0,
            elevation: 0,
          },
          header: (props) => {
            return (
              <View
                style={{
                  flexGrow: 1,
                  paddingHorizontal: sizes[6],
                  marginTop: insets.top,
                  backgroundColor: background,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: sizes[6],
                    alignItems: 'center',
                  }}>
                  <IconButton
                    onPress={() => {
                      props.scene.descriptor.navigation.goBack();
                    }}
                    icon={{
                      size: sizes[12],
                      name: 'arrow',
                      fill: text,
                    }}
                  />
                  <MyText
                    style={{
                      flexGrow: 1,
                      textAlign: 'center',
                      fontSize: sizes[10],
                      fontFamily: getFontFamily('500'),
                    }}>
                    {props.scene.descriptor.options.title}
                  </MyText>
                  <IconButton
                    style={{opacity: 0}}
                    icon={{
                      size: sizes[10],
                      name: 'arrow',
                      fill: background,
                      stroke: background,
                    }}
                  />
                </View>
                <View
                  style={{
                    height: 1,
                    backgroundColor: border,
                    flexGrow: 1,
                  }}
                />
              </View>
            );
          },
        }}>
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: t('profileTitle'),
          }}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            title: t('profileMyOrders'),
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            title: t('profileChangePassword'),
          }}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
          options={{
            title: t('profileLocation'),
          }}
        />
        <Stack.Screen
          name="LoyaltyCard"
          component={LoyaltyCardScreen}
          options={{
            title: t('profileLoyaltyCard'),
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('profileSettings'),
          }}
        />
        <Stack.Screen
          name="Certificate"
          component={CertificateScreen}
          options={{
            title: t('profileCertificate'),
          }}
        />
        <Stack.Screen
          name="Order"
          component={OrderScreen}
          options={{
            title: t('profileMyOrder'),
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            title: t('profileContact'),
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            title: t('profileEditProfile'),
          }}
        />
        <Stack.Screen
          name="Locations"
          options={{
            title: t('profileLocations'),
          }}
          component={LocationsScreen}
        />
        <Stack.Screen
          name="BarCode"
          component={BarCodeScreen}
          options={({route}) => ({
            title: `№ ${(route.params.orderNumber + '').padStart(9, '0')}`,
          })}
        />
      </Stack.Navigator>
    );
  },
);

export default MenuNavigator;
