import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { createMockStore } from '../../testUtils/index';
import SelectMyStepScreen from '../../src/containers/SelectMyStepScreen';

const mockStore = {
  steps: {
    suggestedForMe: [ { id: 1 }, { id: 2 }, { id: 3 } ],
  },
  auth: {
    personId: 1234,
  },
};

const store = createMockStore(mockStore);

jest.mock('react-native-device-info');

it('renders correctly', () => {
  Enzyme.configure({ adapter: new Adapter() });
  const screen = shallow(
    <SelectMyStepScreen />,
    { context: { store: store } }
  );

  screen.setState({ isSearching: true });
  expect(screen.dive()).toMatchSnapshot();
});