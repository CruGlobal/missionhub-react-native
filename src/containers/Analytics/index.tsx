import { useAnalytics } from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
}

const Analytics = ({ screenName }: TrackOnFocusProps) => {
  useAnalytics(screenName);

  return null;
};

export default Analytics;
