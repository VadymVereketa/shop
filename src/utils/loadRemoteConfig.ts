import remoteConfig from '@react-native-firebase/remote-config';
import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';
import {actionsConfig} from '../redux/config/configReducer';
import {cdnUrlRef} from './navigationRef';

const loadRemoteConfig = async (dispatch?: any, immediately = false) => {
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
      cdnURL: 'https://imagedelivery.net/lHorqxvmS2N-7iEdaTakMQ/',
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
        const isString = ['optionalVersionIOS', 'requiredVersionIOS', 'cdnURL'];
        try {
          Object.entries(parameters).forEach(async ($) => {
            const [key, entry] = $;
            if (isBool.some((s) => s === key)) {
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
              if (key === 'cdnURL') {
                console.log(entry.asString());

                cdnUrlRef.current = entry.asString();
              }
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
