import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';

import { createMockStore, testSnapshot } from '../testUtils';
import CustomTabs from '../src/containers/CustomTabs';

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

Enzyme.configure({ adapter: new Adapter() });

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CustomTabs tabArray={tabArray} activeTab={1} goToPage={() => {}} />
    </Provider>
  );
});

it('renders tab 0 correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <CustomTabs tabArray={tabArray} activeTab={0} goToPage={() => {}} />
    </Provider>
  );
});

it('goes to tab when clicked', () => {
  const onChangeTab = jest.fn();
  const goToPage = jest.fn();
  const shallowScreen = shallow(<CustomTabs store={store} tabArray={tabArray} activeTab={0} onChangeTab={onChangeTab} goToPage={goToPage} />);

  shallowScreen.dive().childAt(1).simulate('press');

  expect(onChangeTab).toHaveBeenCalledWith(1, tabArray[1].page);
  expect(goToPage).toHaveBeenCalledWith(1);
});
