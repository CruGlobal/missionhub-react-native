import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';
import SelectStepScreen from '../../src/containers/SelectStepScreen';
import { renderShallow, testSnapshot, createMockStore } from '../../testUtils';
import Enzyme, { shallow } from 'enzyme/build/index';
import Adapter from 'enzyme-adapter-react-16/build/index';
import * as navigation from '../../src/actions/navigation';
import { ADD_STEP_SCREEN } from '../../src/containers/AddStepScreen';
import { addSteps } from '../../src/actions/steps';
jest.mock('../../src/actions/steps');

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
      <SelectStepScreen
        steps={[ { id: '1', body: 'Test Step' } ]}
        onComplete={jest.fn()}
        createStepTracking={{}} />,
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

describe('saveAllSteps', () => {
  it('should add the selected steps', async() => {
    const onComplete = jest.fn();
    addSteps.mockReturnValue(Promise.resolve());
    const component = renderShallow(
      <SelectStepScreen
        steps={[
          {
            id: '1',
            body: 'Selected',
            selected: true,
          },
          {
            id: '2',
            body: 'Unselected',
          },
        ]}
        receiverId={1}
        organization={{ id: 2 }}
        onComplete={onComplete}
        createStepTracking={{}}
      />,
      store
    );
    const instance = component.instance();
    await instance.saveAllSteps();
    expect(addSteps).toHaveBeenCalledWith(
      [
        {
          id: '1',
          body: 'Selected',
          selected: true,
        },
      ],
      1,
      { id: 2 });
    expect(onComplete).toHaveBeenCalled();
  });
});
