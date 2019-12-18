import { useNavigationEvents } from 'react-navigation-hooks';

import { store } from '../../store';
import { trackScreenChange } from '../../actions/analytics';

export const useAnalytics = (
  screenName: string | string[],
  onFocus?: () => void,
) => {
  const handleFocus = () => {
    store.dispatch(trackScreenChange(screenName));
    onFocus && onFocus();
  };

  useNavigationEvents(event => {
    if (event.type === 'willFocus') {
      handleFocus();
    }
  });

  return handleFocus;
};
