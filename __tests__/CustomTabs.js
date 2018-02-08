import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import CustomTabs from '../src/components/CustomTabs';
import { testSnapshot } from '../testUtils';
import { shallow } from 'enzyme/build/index';
import Enzyme from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';

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
    <CustomTabs tabArray={tabArray} activeTab={1} goToPage={()=>{}} />
  );
});

it('renders tab 0 correctly', () => {
  testSnapshot(
    <CustomTabs tabArray={tabArray} activeTab={0} goToPage={()=>{}} />
  );
});

it('goes to tab when clicked', () => {
  const onChangeTab = jest.fn();
  const goToPage = jest.fn();
  const shallowScreen = shallow(<CustomTabs tabArray={tabArray} activeTab={0} onChangeTab={onChangeTab} goToPage={goToPage} />);

  shallowScreen.dive().childAt(1).simulate('press');

  expect(onChangeTab).toHaveBeenCalledWith(tabArray[1].page);
  expect(goToPage).toHaveBeenCalledWith(1);
});
