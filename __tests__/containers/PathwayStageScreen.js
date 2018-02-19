import 'react-native';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';

// Note: test renderer must be required after react-native.
import { createMockStore, testSnapshot } from '../../testUtils';
import PathwayStageScreen from '../../src/containers/PathwayStageScreen';
import * as common from '../../src/utils/common';

const store = createMockStore({
  stages: [
    { id: 1, name: 'Stage 1', description: 'Stage 1 description' },
    { id: 2, name: 'Stage 2', description: 'Stage 2 description' },
    { id: 3, name: 'Stage 3', description: 'Stage 3 description' },
  ],
});

jest.mock('react-native-device-info');

const mockProps = {
  onSelect: () => {},
  section: 'section',
  subsection: 'subsection',
};

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PathwayStageScreen {...mockProps} />
    </Provider>
  );
});

it('renders firstItem correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PathwayStageScreen {...mockProps} firstItem={1} />
    </Provider>
  );
});

it('renders back button correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <PathwayStageScreen {...mockProps} enableBackButton={true} />
    </Provider>
  );
});


describe('pathway stage screen methods', () => {
  let component;
  const mockSelect = jest.fn();
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PathwayStageScreen
        {...mockProps}
        onSelect={mockSelect}
      />,
      { context: { store } },
    );

    component = screen.dive().instance();
  });

  it('runs onSelect', () => {
    component.setStage({}, false);
    expect(mockSelect).toHaveBeenCalledTimes(1);
  });
});


describe('pathway stage screen methods without back', () => {
  let component;
  beforeEach(() => {
    Enzyme.configure({ adapter: new Adapter() });
    const screen = shallow(
      <PathwayStageScreen
        {...mockProps}
        enableBackButton={false}
      />,
      { context: { store } },
    );

    component = screen.dive().instance();
  });

  it('unmounts', () => {
    common.disableBack = { remove: jest.fn() };
    component.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});