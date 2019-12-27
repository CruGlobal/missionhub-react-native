import { useNavigationEvents } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import { trackScreenChange } from '../../actions/analytics';

export const useAnalytics = (screenName: string | string[]) => {
  const dispatch = useDispatch();

  const handleScreenChange = (name: string | string[]) => {
    dispatch(trackScreenChange(name));
  };

  useNavigationEvents(event => {
    if (event.type === 'didFocus') {
      handleScreenChange(screenName);
    }
  });

  return handleScreenChange;
};
