import { connect } from 'react-redux';

import { useAnalytics } from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
  onFocus?: () => void;
}

export const TrackOnFocus = ({ screenName, onFocus }: TrackOnFocusProps) => {
  useAnalytics(screenName, onFocus);

  return null;
};
export default connect()(TrackOnFocus);
