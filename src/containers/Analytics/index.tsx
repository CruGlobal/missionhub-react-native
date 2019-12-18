import { useAnalytics } from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
}

export default ({ screenName }: TrackOnFocusProps) => {
  useAnalytics(screenName);

  return null;
};
