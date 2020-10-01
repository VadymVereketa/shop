import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {StackScreenProps} from '@react-navigation/stack/src/types';
import LoginScreen from '../screens/Auth.navigator/Login.screen';
import SignUpScreen from '../screens/Auth.navigator/Signup.screen';
import {
  AuthNavigatorScreenProps,
  StartNavigatorParamList,
} from './Start.navigator';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import IconButton from '../controls/IconButton';
import {sizes, useTheme} from '../../context/ThemeContext';
import ForgetPasswordScreen from '../screens/Auth.navigator/ForgetPassword.screen';
import VerificationScreen from '../screens/Auth.navigator/Verification.screen';

export type AuthNavigatorParamList = {
  Login: {};
  SignUp: {};
  ForgetPassword: {};
  Verification: {
    phone: string;
  };
};

type LoginScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList, 'Login'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type LoginScreenRouteProp = RouteProp<AuthNavigatorParamList, 'Login'>;

export type LoginScreenProps = {
  route: LoginScreenRouteProp;
  navigation: LoginScreenNavigationProp;
};

type SignUpScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList, 'SignUp'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type SignUpScreenRouteProp = RouteProp<AuthNavigatorParamList, 'SignUp'>;

export type SignUpScreenProps = {
  route: SignUpScreenRouteProp;
  navigation: SignUpScreenNavigationProp;
};

type ForgetPasswordScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList, 'ForgetPassword'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type ForgetPasswordScreenRouteProp = RouteProp<
  AuthNavigatorParamList,
  'ForgetPassword'
>;

export type ForgetPasswordScreenProps = {
  route: ForgetPasswordScreenRouteProp;
  navigation: ForgetPasswordScreenNavigationProp;
};

type VerificationScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthNavigatorParamList, 'Verification'>,
  StackNavigationProp<StartNavigatorParamList>
>;
type VerificationScreenRouteProp = RouteProp<
  AuthNavigatorParamList,
  'Verification'
>;

export type VerificationScreenProps = {
  route: VerificationScreenRouteProp;
  navigation: VerificationScreenNavigationProp;
};

const Stack = createStackNavigator<AuthNavigatorParamList>();

const AuthNavigator = React.memo(({navigation}: AuthNavigatorScreenProps) => {
  const {text} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={{
        title: '',
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
        headerStyle: {
          shadowOpacity: 0,
          elevation: 0,
        },
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
    </Stack.Navigator>
  );
});

export default AuthNavigator;
