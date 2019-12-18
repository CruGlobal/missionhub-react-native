import { connect } from 'react-redux';

import { useAnalytics } from '../../utils/hooks/useAnalytics';

interface TrackOnFocusProps {
  screenName: string | string[];
}

export const Analytics = ({ screenName }: TrackOnFocusProps) => {
  useAnalytics(screenName);

  return null;
};
export default connect()(Analytics);
