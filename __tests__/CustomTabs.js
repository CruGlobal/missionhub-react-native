import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import CustomTabs from '../src/containers/CustomTabs';
import { createMockStore, testSnapshot } from '../testUtils';
import { Provider } from 'react-redux';

const store = createMockStore();

const tabArray = [
  {
    page: 'steps',
    iconName: 'stepsIcon',
    tabLabel: 'My Steps',
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
];

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CustomTabs tabArray={tabArray} activeTab={1} goToPage={()=>{}} />
    </Provider>
  );
});

it('renders tab 0 correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CustomTabs tabArray={tabArray} activeTab={0} goToPage={()=>{}} />
    </Provider>
  );
});
