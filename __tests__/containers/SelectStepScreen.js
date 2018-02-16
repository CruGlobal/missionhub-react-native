import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import { createMockStore } from '../../testUtils/index';
import SelectStepScreen from '../../src/containers/SelectStepScreen';
import { testSnapshot } from '../../testUtils';
import Enzyme, { shallow } from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';
import * as navigation from '../../src/actions/navigation';
import { ADD_STEP_SCREEN } from '../../src/containers/AddStepScreen';

const store = createMockStore();

jest.mock('react-native-device-info');

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <SelectStepScreen steps={[]} createStepTracking={{}} onComplete={() => {}} />
    </Provider>
  );
});


describe('Navigation', () => {
  Enzyme.configure({ adapter: new Adapter() });
  navigation.navigatePush = jest.fn();

  const createComponent = () => {
    const screen = shallow(
      <SelectStepScreen />,
      { context: { store } },
    );

    let component = screen.dive().dive().dive().instance();
    return component;
  };

  it('navigates to add step screen', () => {
    let component = createComponent(true);

    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(
      ADD_STEP_SCREEN,
      { onComplete: expect.any(Function) }
    );
  });
});