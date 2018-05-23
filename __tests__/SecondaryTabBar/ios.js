import 'react-native';
import React from 'react';

import SecondaryTabBar from '../../src/components/SecondaryTabBar/index';
import { createMockStore } from '../../testUtils/index';
import { testSnapshotShallow } from '../../testUtils';
const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
  auth: {
    person: {
      id: '123',
    },
  },
  profile: {
    visiblePersonInfo: {
      contactAssignmentId: '333',
    },
  },
};

const store = createMockStore(mockState);

const tabArray = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: 'My Steps',
  },
  {
    page: 'actions',
    iconName: 'actionsIcon',
    tabLabel: 'My Actions',
  },
  {
    page: 'journey',
    iconName: 'journeyIcon',
    tabLabel: 'Our Journey',
  },
  {
    page: 'notes',
    iconName: 'notesIcon',
    tabLabel: 'My Notes',
  },
  {
    page: 'userImpact',
    iconName: 'impactIcon',
    tabLabel: 'Impact',
  },
];

jest.mock('NativeAnimatedHelper');

it('renders correctly', () => {
  testSnapshotShallow(
    <SecondaryTabBar person={{ first_name: 'ben', id: 1 }} tabs={tabArray} />,
    store,
  );
});
