declare module 'react-native-omniture' {
  function trackAction(action: string, context: unknown);
  function trackState(state: string, context: unknown);
  function syncIdentifier(id: string | null);
  function loadMarketingCloudId(callback: (id: string) => void);
  function collectLifecycleData(lifecycleData: Record<string, unknown>);
}
