import { useNavigationEvents } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';

import { trackScreenChange } from '../../actions/analytics';

export const useAnalytics = (screenName: string | string[]) => {
  const dispatch = useDispatch();

  const handleFocus = () => {
    dispatch(trackScreenChange(screenName));
  };

  useNavigationEvents(event => {
    if (event.type === 'willFocus') {
      handleFocus();
    }
  });

  return handleFocus;
};
