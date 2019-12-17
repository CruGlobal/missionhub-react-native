/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { STEPS_TAB, PEOPLE_TAB, GROUPS_TAB } from '../../../constants';
import { checkForUnreadComments } from '../../../actions/unreadComments';
import { trackScreenChange } from '../../../actions/analytics';

import { TrackTabChange } from '..';

jest.mock('../../../actions/unreadComments');
let dispatch: jest.Mock;

const checkForUnreadCommentsResult = { type: 'check for unread comments' };
const trackScreenChangeResult = { type: 'track screen change' };

beforeEach(() => {
  dispatch = jest.fn(async () => {});
  (checkForUnreadComments as jest.Mock).mockReturnValue(
    checkForUnreadCommentsResult,
  );
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResult);
});

describe('TrackTabChange', () => {
  it('renders component correctly', () => {
    renderWithContext(<TrackTabChange dispatch={dispatch} screen="test" />, {
      initialState: {},
    }).snapshot();
  });

  describe('on mount', () => {
    it('calls actions for steps tab', () => {
      renderWithContext(
        <TrackTabChange dispatch={dispatch} screen={STEPS_TAB} />,
      );

      expect(checkForUnreadComments).toHaveBeenCalledWith();
      expect(trackScreenChange).toHaveBeenCalledWith(['steps']);
    });

    it('calls actions for people tab', () => {
      renderWithContext(
        <TrackTabChange dispatch={dispatch} screen={PEOPLE_TAB} />,
      );

      expect(checkForUnreadComments).toHaveBeenCalledWith();
      expect(trackScreenChange).toHaveBeenCalledWith(['people']);
    });

    it('calls actions for communities tab', () => {
      renderWithContext(
        <TrackTabChange dispatch={dispatch} screen={GROUPS_TAB} />,
      );

      expect(checkForUnreadComments).toHaveBeenCalledWith();
      expect(trackScreenChange).toHaveBeenCalledWith(['communities']);
    });
  });

  describe('onDidFocus', () => {
    it('calls actions for steps tab', () => {
      const component: any = renderWithContext(
        <TrackTabChange dispatch={dispatch} screen={STEPS_TAB} />,
      );

      component
        .instance()
        .props.onDidFocus({ action: { routeName: 'onDidFocus' } });

      expect(checkForUnreadComments).toHaveBeenCalledWith();
      expect(trackScreenChange).toHaveBeenCalledWith(['steps']);
    });

    it('calls actions for people tab', () => {
      const component: any = renderWithContext(
        <TrackTabChange dispatch={dispatch} screen={PEOPLE_TAB} />,
      );

      component
        .instance()
        .props.onDidFocus({ action: { routeName: 'onDidFocus' } });

      expect(checkForUnreadComments).toHaveBeenCalledWith();
      expect(trackScreenChange).toHaveBeenCalledWith(['people']);
    });

    it('calls actions for communities tab', () => {
      const component: any = renderWithContext(
        <TrackTabChange dispatch={dispatch} screen={GROUPS_TAB} />,
      );

      component
        .instance()
        .props.onDidFocus({ action: { routeName: 'onDidFocus' } });

      expect(checkForUnreadComments).toHaveBeenCalledWith();
      expect(trackScreenChange).toHaveBeenCalledWith(['communities']);
    });
  });
});
