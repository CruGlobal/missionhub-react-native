declare module 'react-native-omniture' {
  function trackAction(action: string, context: object);
  function trackState(state: string, context: object);
  function syncIdentifier(id: string | null);
  function loadMarketingCloudId(callback: (id: string) => void);
  function collectLifecycleData(lifecycleData: object);
}
