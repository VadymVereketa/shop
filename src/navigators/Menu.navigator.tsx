import React from 'react';
import {createStackNavigator, StackNavigationProp} from '@react-navigation/stack';
import {SecondaryNavigatorScreenProps, StartNavigatorParamList} from './Start.navigator';
import ProfileScreen from '../screens/Menu.navigator/Profile.screen';
import ChangePasswordScreen from '../screens/Menu.navigator/ChangePassword.screen';
import LocationScreen from '../screens/Menu.navigator/Location.screen';
import LoyaltyCardScreen from '../screens/Menu.navigator/LoyaltyCard.screen';
import SettingsScreen from '../screens/Menu.navigator/Settings.screen';
import CertificateScreen from '../screens/Menu.navigator/Certificate.screen';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';

export type MenuNavigatorParamList = {
  Certificate: {
  };
  ChangePassword: {
  };
  Location: {
  };
  LoyaltyCard: {
  };
  Profile: {
  };
  Settings: {
  };
};

/// Certificate props
type CertificateScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList,'Certificate'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type CertificateScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Certificate'>;

export type CertificateScreenProps = {
  route: CertificateScreenRouteProp;
  navigation: CertificateScreenNavigationProp;
}
/// Certificate props

/// ChangePassword props
type ChangePasswordScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList,'ChangePassword'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type ChangePasswordScreenRouteProp = RouteProp<MenuNavigatorParamList, 'ChangePassword'>;

export type ChangePasswordScreenProps = {
  route: ChangePasswordScreenRouteProp;
  navigation: ChangePasswordScreenNavigationProp;
}
/// ChangePassword props

/// Location props
type LocationScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList,'Location'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type LocationScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Location'>;

export type LocationScreenProps = {
  route: LocationScreenRouteProp;
  navigation: LocationScreenNavigationProp;
}
/// Location props

/// LoyaltyCard props
type LoyaltyCardScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList,'LoyaltyCard'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type LoyaltyCardScreenRouteProp = RouteProp<MenuNavigatorParamList, 'LoyaltyCard'>;

export type LoyaltyCardScreenProps = {
  route: LoyaltyCardScreenRouteProp;
  navigation: LoyaltyCardScreenNavigationProp;
}
/// LoyaltyCard props

/// Profile props
type ProfileScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList,'Profile'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type ProfileScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Profile'>;

export type ProfileScreenProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
}
/// Profile props

/// Settings props
type SettingsScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MenuNavigatorParamList,'Settings'>,
  StackNavigationProp<StartNavigatorParamList>
  >
type SettingsScreenRouteProp = RouteProp<MenuNavigatorParamList, 'Settings'>;

export type SettingsScreenProps = {
  route: SettingsScreenRouteProp;
  navigation: SettingsScreenNavigationProp;
}
/// Settings props

const Stack = createStackNavigator<MenuNavigatorParamList>();

const MenuNavigator = (props: SecondaryNavigatorScreenProps) => {
  return (
      <Stack.Navigator initialRouteName={'Profile'}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="LoyaltyCard" component={LoyaltyCardScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Certificate" component={CertificateScreen} />
      </Stack.Navigator>
  );
};

export default MenuNavigator;
