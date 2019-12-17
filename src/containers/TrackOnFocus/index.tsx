import React from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line import/named
import { NavigationEvents } from 'react-navigation';
import { ThunkDispatch } from 'redux-thunk';

import { trackScreenChange } from '../../actions/analytics';

interface TrackTabChangeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, any>;
  screenNameFragments: string[];
  onFocus?: () => void;
}

export const TrackOnFocus = ({
  dispatch,
  screenNameFragments,
  onFocus,
}: TrackTabChangeProps) => {
  const handleFocus = () => {
    dispatch(trackScreenChange(screenNameFragments));
    onFocus && onFocus();
  };

  return <NavigationEvents onDidFocus={handleFocus} />;
};
export default connect()(TrackOnFocus);
