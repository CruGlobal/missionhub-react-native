import {
  useAnalytics,
  UseAnalyticsParams,
  UseAnalyticsOptions,
} from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
  params?: UseAnalyticsParams;
  options?: UseAnalyticsOptions;
}

const Analytics = ({ screenName, params, options }: TrackOnFocusProps) => {
  useAnalytics(screenName, params, options);

  return null;
};

export default Analytics;
