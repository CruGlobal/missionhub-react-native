import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactScreen from '../../src/containers/ContactScreen';
import { createMockStore } from '../../testUtils/index';
import { createMockNavState } from '../../testUtils';
import { shallow } from 'enzyme/build/index';

jest.mock('react-native-device-info');

const mockState = {
  auth: { isJean: false },
  stages: [],
  profile: { visiblePersonInfo: {} },
};

const store = createMockStore(mockState);

const buildScreen = () => (
  shallow(
    <ContactScreen navigation={createMockNavState({ person: {} })} />,
    { context: { store: store } }
  )
);


it('renders correctly as Casey', () => {
  expect(buildScreen().dive()).toMatchSnapshot();
});

it('renders correctly as Jean', () => {
  store.getState().auth.isJean = true;

  expect(buildScreen().dive()).toMatchSnapshot();
});
