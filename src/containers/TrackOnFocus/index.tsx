import React from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line import/named
import { NavigationEvents } from 'react-navigation';
import { ThunkDispatch } from 'redux-thunk';

import { trackScreenChange } from '../../actions/analytics';

interface TrackOnFocusProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, any>;
  screenName: string | string[];
  onFocus?: () => void;
}

export const TrackOnFocus = ({
  dispatch,
  screenName,
  onFocus,
}: TrackOnFocusProps) => {
  const handleFocus = () => {
    dispatch(trackScreenChange(screenName));
    onFocus && onFocus();
  };

  return <NavigationEvents onDidFocus={handleFocus} />;
};
export default connect()(TrackOnFocus);
