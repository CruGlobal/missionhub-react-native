import DeviceInfo from 'react-native-device-info';
// eslint-disable-next-line import/default
import VersionCheck from 'react-native-version-check';
import { useEffect, useState } from 'react';

export const useCheckForUpdate = () => {
  const [needsToUpdate, setNeedsToUpdate] = useState(false);
  const currentAppVersion = DeviceInfo.getVersion();
  useEffect(() => {
    async function getLatestVersion() {
      const latesAppVersion = await VersionCheck.getLatestVersion();
      setNeedsToUpdate(latesAppVersion !== currentAppVersion);
    }
    getLatestVersion();
  }, []);

  return needsToUpdate;
};
