import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { ThunkDispatch } from 'redux-thunk';
import { TRACK_TAB } from '../../constants';
import { checkForUnreadComments } from '../../actions/unreadComments';
interface TrackTabChangeProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, any, any>;
  screen: string;
}
export const TrackTabChange = ({ dispatch, screen }: TrackTabChangeProps) => {
  useEffect(() => {
    tabFocused({ action: { routeName: screen } });
  }, []);
  const tabFocused = (payload: any) => {
    dispatch({ type: TRACK_TAB, routeName: payload.action.routeName });
    dispatch(checkForUnreadComments());
  };
  return <NavigationEvents onDidFocus={tabFocused} />;
};
export default connect()(TrackTabChange);
