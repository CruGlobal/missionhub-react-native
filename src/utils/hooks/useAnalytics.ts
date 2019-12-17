import { useNavigationEvents } from 'react-navigation-hooks';

import { store } from '../../store';
import { trackScreenChange } from '../../actions/analytics';

export const useAnalytics = (screenName: string | string[]) => {
  useNavigationEvents(event => {
    if (event.type === 'willFocus') {
      store.dispatch(trackScreenChange(screenName));
    }
  });
};
