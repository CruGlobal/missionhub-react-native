import {
  useAnalytics,
  UseAnalyticsOptions,
} from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
  screenContext?: UseAnalyticsOptions;
}

const Analytics = ({ screenName, screenContext }: TrackOnFocusProps) => {
  useAnalytics(screenName, screenContext);

  return null;
};

export default Analytics;
