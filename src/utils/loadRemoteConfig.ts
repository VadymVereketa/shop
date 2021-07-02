import AsyncStorage from '@react-native-community/async-storage';
import remoteConfig from '@react-native-firebase/remote-config';
import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';
import {actionsConfig} from '../redux/config/configReducer';

const loadRemoteConfig = async (dispatch?: any, immediately = false) => {
  console.log('loadRemoteConfig');

  if (immediately) {
    await remoteConfig().fetch(0);
  } else {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 24 * 60 * 60 * 1000,
    });
  }
  return remoteConfig()
    .setDefaults({
      enabledOptionalCheckVersion: true,
      enabledRequiredCheckVersion: true,
      optionalVersionAndroid: ANDROID_VERSION,
      requiredVersionAndroid: ANDROID_VERSION,
      optionalVersionIOS: IOS_VERSION,
      requiredVersionIOS: IOS_VERSION,
      isNewCategory: false,
    })
    .then(() => remoteConfig().fetchAndActivate())
    .then((fetchedRemotely) => {
      if (dispatch) {
        const parameters = remoteConfig().getAll();
        const isBool = [
          'enabledOptionalCheckVersion',
          'enabledRequiredCheckVersion',
          'isNewCategory',
        ];
        const isNumber = ['optionalVersionAndroid', 'requiredVersionAndroid'];
        const isString = ['optionalVersionIOS', 'requiredVersionIOS'];
        try {
          Object.entries(parameters).forEach(async ($) => {
            const [key, entry] = $;
            if (isBool.some((s) => s === key)) {
              if (key === 'isNewCategory') {
                console.log(key, entry.asBoolean());
              }
              if (key === 'isNewCategory' && immediately) {
                console.log('save, ', entry.asBoolean().toString());

                await AsyncStorage.setItem(key, entry.asBoolean().toString());
              }
              console.log(2);
              dispatch(
                actionsConfig.setData({
                  [key]: entry.asBoolean(),
                }),
              );
            } else if (isNumber.some((s) => s === key)) {
              dispatch(
                actionsConfig.setData({
                  [key]: entry.asNumber(),
                }),
              );
            } else if (isString.some((s) => s === key)) {
              dispatch(
                actionsConfig.setData({
                  [key]: entry.asString(),
                }),
              );
            }
          });
        } catch (e) {}
      }
    });
};

export default loadRemoteConfig;
