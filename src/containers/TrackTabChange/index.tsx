import React from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line import/named
import { NavigationEvents } from 'react-navigation';
import { ThunkDispatch } from 'redux-thunk';

import { STEPS_TAB, PEOPLE_TAB, GROUPS_TAB } from '../../constants';
import { checkForUnreadComments } from '../../actions/unreadComments';
import { trackScreenChange } from '../../actions/analytics';

interface TrackTabChangeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, any>;
  screen: string;
}
interface Payload {
  action: {
    routeName?: string;
    type?: string;
  };
}

export const TrackTabChange = ({ dispatch, screen }: TrackTabChangeProps) => {
  const getAnalyticsScreenName = () => {
    switch (screen) {
      case STEPS_TAB:
        return 'steps';
      case PEOPLE_TAB:
        return 'people';
      case GROUPS_TAB:
        return 'communities';
      default:
        return '';
    }
  };

  const tabFocused = () => {
    dispatch(checkForUnreadComments());
    dispatch(trackScreenChange([getAnalyticsScreenName()]));
  };

  return <NavigationEvents onDidFocus={tabFocused} />;
};
export default connect()(TrackTabChange);
