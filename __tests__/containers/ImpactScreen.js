import 'react-native';
import React from 'react';
import MockDate from 'mockdate';

import { createMockStore } from '../../testUtils/index';
import ImpactScreen from '../../src/containers/ImpactScreen';
import { testSnapshotShallow } from '../../testUtils';

const store = createMockStore({
  impact: {
    mine: {
      steps_count: 5,
      receivers_count: 2,
      pathway_moved_count: 1,
    },
    global: {
      steps_count: 155,
      receivers_count: 52,
      step_owners_count: 32,
      pathway_moved_count: 46,
    },
  },
  auth: {
    person: {
      id: '123',
      first_name: 'Fname',
    },
  },
});

jest.mock('react-native-device-info');

describe('Impact Screen', () => {
  beforeEach(() => {
    MockDate.set('2017-08-20');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('renders correctly', () => {
    testSnapshotShallow(
      <ImpactScreen />,
      store
    );
  });
});
