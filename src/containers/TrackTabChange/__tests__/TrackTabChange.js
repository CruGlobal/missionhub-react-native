import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';

import { TrackTabChange } from '..';

import * as tracking from '../../../middleware/tracking';

const dispatch = jest.fn(async () => {});

const newState = { newState: 'test' };
tracking.getNextTrackState = jest.fn().mockReturnValue(newState);
tracking.trackTabChanges = jest.fn();

describe('TrackTabChange', () => {
  it('renders component correctly', () => {
    testSnapshotShallow(<TrackTabChange dispatch={dispatch} screen="test" />);
  });

  it('mounts and calls tab focused', () => {
    renderShallow(<TrackTabChange dispatch={dispatch} screen="test" />);

    expect(tracking.getNextTrackState).toHaveBeenCalledWith({
      routeName: 'test',
    });
    expect(tracking.trackTabChanges).toHaveBeenCalledWith(
      {
        routeName: 'test',
      },
      newState,
      dispatch,
    );
  });

  it('calls on focus and tracks it', () => {
    const component = renderShallow(
      <TrackTabChange dispatch={dispatch} screen="test" />,
    );
    component
      .instance()
      .props.onDidFocus({ action: { routeName: 'onDidFocus' } });

    expect(tracking.getNextTrackState).toHaveBeenCalledWith({
      routeName: 'onDidFocus',
    });
    expect(tracking.trackTabChanges).toHaveBeenCalledWith(
      {
        routeName: 'onDidFocus',
      },
      newState,
      dispatch,
    );
  });
});
