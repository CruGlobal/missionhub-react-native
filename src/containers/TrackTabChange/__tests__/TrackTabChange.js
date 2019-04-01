import React from 'react';

import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import { TRACK_TAB } from '../../../constants';

import { TrackTabChange } from '..';

const dispatch = jest.fn(async () => {});

describe('TrackTabChange', () => {
  it('renders component correctly', () => {
    testSnapshotShallow(<TrackTabChange dispatch={dispatch} screen="test" />);
  });

  it('mounts and calls tab focused', () => {
    renderShallow(<TrackTabChange dispatch={dispatch} screen="test" />);

    expect(dispatch).toHaveBeenCalledWith({
      type: TRACK_TAB,
      routeName: 'test',
    });
  });

  it('calls on focus and tracks it', () => {
    const component = renderShallow(
      <TrackTabChange dispatch={dispatch} screen="test" />,
    );
    component
      .instance()
      .props.onDidFocus({ action: { routeName: 'onDidFocus' } });

    expect(dispatch).toHaveBeenCalledWith({
      type: TRACK_TAB,
      routeName: 'onDidFocus',
    });
  });
});
