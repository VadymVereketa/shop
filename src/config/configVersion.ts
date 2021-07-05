import DeviceInfo from 'react-native-device-info';

const IOS_VERSION = DeviceInfo.getVersion();
const ANDROID_VERSION = +DeviceInfo.getBuildNumber();

export {IOS_VERSION, ANDROID_VERSION};
