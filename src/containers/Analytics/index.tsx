import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { ScreenContext } from '../../actions/analytics';

interface TrackOnFocusProps {
  screenName: string | string[];
  screenContext?: Partial<ScreenContext>;
}

const Analytics = ({ screenName, screenContext }: TrackOnFocusProps) => {
  useAnalytics(screenName, screenContext ? { screenContext } : undefined);

  return null;
};

export default Analytics;
