import crashlytics from '@react-native-firebase/crashlytics';
import {isIOS} from '../utils/isPlatform';
import {ANDROID_VERSION, IOS_VERSION} from '../config/configVersion';
import {IUser} from '../typings/FetchData';
import {Mode, mode} from '../config/config';
import CrashTypeError from '../typings/CrashTypeError';

class FirebaseCrash {
  public static async init(user: IUser) {
    if (mode === Mode.LOCAL) {
      return;
    }
    FirebaseCrash.log(
      `User ${user.firstName} by phone (${user.phone}) signed in.`,
    );

    await crashlytics().setUserId(user.id.toString());
    await crashlytics().setAttributes({
      id: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      ENV: mode,
      OS: isIOS ? 'iOS' : 'Android',
      version: (isIOS ? IOS_VERSION : ANDROID_VERSION).toString(),
    });
  }

  public static log(str: string | any) {
    if (mode === Mode.LOCAL) {
      return;
    }
    if (typeof str === 'string') {
      crashlytics().log(str);
      console.log(str);
    }
    try {
      const json = JSON.stringify(str);
      crashlytics().log(json);
      console.log(json);
    } catch {
      crashlytics().log((str as Error).message);
      console.log((str as Error).message);
    }
  }

  public static catch(error: Error, errorName: CrashTypeError) {
    if (mode === Mode.LOCAL) {
      return;
    }
    console.error(error);
    crashlytics().recordError(error, errorName);
  }
}

export default FirebaseCrash;
