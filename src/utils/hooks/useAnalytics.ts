import { useNavigationEvents } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import { trackScreenChange } from '../../actions/analytics';

export const useAnalytics = (
  screenName: string | string[],
  onFocus?: () => void,
) => {
  const dispatch = useDispatch();

  const handleFocus = () => {
    dispatch(trackScreenChange(screenName));
    onFocus && onFocus();
  };

  useNavigationEvents(event => {
    if (event.type === 'willFocus') {
      handleFocus();
    }
  });

  return handleFocus;
};
