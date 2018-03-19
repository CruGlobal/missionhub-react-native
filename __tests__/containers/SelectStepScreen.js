import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import SelectStepScreen from '../../src/containers/SelectStepScreen';
import { renderShallow, createMockStore, testSnapshotShallow } from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import { ADD_STEP_SCREEN } from '../../src/containers/AddStepScreen';
import { addSteps } from '../../src/actions/steps';
jest.mock('../../src/actions/steps');

const store = createMockStore({ auth: {} });

jest.mock('react-native-device-info');

describe('SelectStepScreen', () => {
  let component, parallaxProps;
  beforeEach(() => {
    component = renderShallow(
      <SelectStepScreen steps={[]} createStepTracking={{}} onComplete={() => {}} />,
      store
    );
    parallaxProps = component.find('ParallaxScrollView').props();
  });
  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render foreground header correctly', () => {
    testSnapshotShallow(parallaxProps.renderForeground());
  });
  it('should render sticky header correctly', () => {
    testSnapshotShallow(parallaxProps.renderStickyHeader());
  });
});


describe('Navigation', () => {
  navigation.navigatePush = jest.fn();

  const createComponent = () => {
    const screen = renderShallow(
      <SelectStepScreen
        steps={[ { id: '1', body: 'Test Step' } ]}
        onComplete={jest.fn()}
        createStepTracking={{}} />,
      store,
    );

    return screen.instance();
  };

  it('navigates to add step screen', () => {
    const component = createComponent(true);

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
