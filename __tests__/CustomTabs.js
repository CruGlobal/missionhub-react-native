import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import CustomTabs from '../src/components/CustomTabs';
import { testSnapshot } from '../testUtils';

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
    <CustomTabs tabArray={tabArray} activeTab={1} goToPage={()=>{}} />
  );
});

it('renders tab 0 correctly', () => {
  testSnapshot(
    <CustomTabs tabArray={tabArray} activeTab={0} goToPage={()=>{}} />
  );
});
