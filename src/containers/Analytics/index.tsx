import { ScreenContext } from '../../actions/analytics';
import { useAnalytics } from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
  screenContext?: Partial<ScreenContext>;
}

const Analytics = ({ screenName, screenContext }: TrackOnFocusProps) => {
  useAnalytics({ screenName, screenContext });

  return null;
};

export default Analytics;
