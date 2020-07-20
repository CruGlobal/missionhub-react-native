import DeviceInfo from 'react-native-device-info';

export const useGetAppVersion = () => DeviceInfo.getVersion();
