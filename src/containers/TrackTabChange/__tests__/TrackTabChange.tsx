import React from 'react';

import { renderShallow, renderWithContext } from '../../../../testUtils';
import { TRACK_TAB } from '../../../constants';
import { checkForUnreadComments } from '../../../actions/unreadComments';

import { TrackTabChange } from '..';

jest.mock('../../../actions/unreadComments');
let dispatch: jest.Mock;

beforeEach(() => {
  dispatch = jest.fn(async () => {});
  (checkForUnreadComments as jest.Mock).mockReturnValue({
    type: 'check for unread comments',
  });
});

describe('TrackTabChange', () => {
  it('renders component correctly', () => {
    renderWithContext(
      <TrackTabChange dispatch={dispatch} screen="test" />,
    ).snapshot();
  });

  describe('ComponentDidMount', () => {
    beforeEach(() => {
      renderWithContext(<TrackTabChange dispatch={dispatch} screen="test" />);
    });

    it('calls tab focused', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: TRACK_TAB,
        routeName: 'test',
      });
    });

    it('calls check for unread comments', () => {
      expect(checkForUnreadComments).toHaveBeenCalled();
    });
  });

  describe('onDidFocus', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let component: any;

    beforeEach(() => {
      component = renderShallow(
        <TrackTabChange dispatch={dispatch} screen="test" />,
      );

      component
        .instance()
        .props.onDidFocus({ action: { routeName: 'onDidFocus' } });
    });

    it('calls on focus and tracks it', () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: TRACK_TAB,
        routeName: 'onDidFocus',
      });
    });

    it('calls check for unread comments', () => {
      expect(checkForUnreadComments).toHaveBeenCalled();
    });
  });
});
