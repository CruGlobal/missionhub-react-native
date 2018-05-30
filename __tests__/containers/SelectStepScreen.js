import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import SelectStepScreen from '../../src/containers/SelectStepScreen';
import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../testUtils';
import * as navigation from '../../src/actions/navigation';
import { ADD_STEP_SCREEN } from '../../src/containers/AddStepScreen';
import { addSteps } from '../../src/actions/steps';
import { CREATE_STEP } from '../../src/constants';
jest.mock('../../src/actions/steps');

const testName = 'Bill';

const stageId = 5;
const contactStage = { id: stageId };

const store = createMockStore({
  auth: {
    person: {
      id: '123',
    },
  },
  steps: {
    suggestedForOthers: {
      [stageId]: [
        { id: '1', body: 'test 1' },
        { id: '2', body: 'test 2 <<name>>' },
        { id: '3', body: 'test 3' },
      ],
    },
  },
});

jest.mock('react-native-device-info');

describe('SelectStepScreen', () => {
  let component, parallaxProps;

  beforeEach(() => {
    component = renderShallow(
      <SelectStepScreen
        isMe={false}
        contactStage={contactStage}
        createStepTracking={{}}
        onComplete={() => {}}
      />,
      store,
    );
    parallaxProps = component.find('ParallaxScrollView').props();
  });

  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should render foreground header correctly', () => {
    testSnapshotShallow(parallaxProps.renderForeground());
  });

  it('should render sticky header correctly', () => {
    testSnapshotShallow(parallaxProps.renderStickyHeader());
  });
});

describe('renderSaveButton', () => {
  let component;
  beforeEach(async () => {
    component = renderShallow(
      <SelectStepScreen
        isMe={false}
        contactStage={contactStage}
        createStepTracking={{}}
        onComplete={() => {}}
        personFirstName={testName}
      />,
      store,
    );
    await component.instance().componentDidMount();
    component.update();
  });
  it('should not render save button', () => {
    expect(component).toMatchSnapshot();
  });
  it('should render save button', () => {
    component.instance().handleSelectStep({ id: '1' });
    component.update();
    expect(component).toMatchSnapshot();
  });
});

describe('renderBackButton', () => {
  let component;
  beforeEach(() => {
    component = renderShallow(
      <SelectStepScreen
        isMe={false}
        contactStage={contactStage}
        createStepTracking={{}}
        onComplete={() => {}}
        enableBackButton={true}
      />,
      store,
    );
  });
  it('should render back button', () => {
    expect(component).toMatchSnapshot();
  });
});

describe('Navigation', () => {
  navigation.navigatePush = jest.fn();

  const createStepTracking = 'this is a test tracking property';
  const createComponent = () => {
    const screen = renderShallow(
      <SelectStepScreen
        isMe={false}
        contactStage={contactStage}
        onComplete={jest.fn()}
        createStepTracking={createStepTracking}
      />,
      store,
    );

    return screen.instance();
  };

  it('navigates to add step screen', () => {
    const component = createComponent(true);

    component.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      onComplete: expect.any(Function),
      trackingObj: createStepTracking,
    });
  });
});

describe('saveAllSteps', () => {
  it('should add the selected steps', async () => {
    const onComplete = jest.fn();
    addSteps.mockReturnValue(Promise.resolve());
    const component = renderShallow(
      <SelectStepScreen
        isMe={false}
        contactStage={contactStage}
        receiverId={1}
        organization={{ id: 2 }}
        onComplete={onComplete}
        createStepTracking={{}}
      />,
      store,
    );
    const instance = component.instance();
    await instance.componentDidMount();
    component.update();

    instance.handleSelectStep({ id: '1' });
    instance.handleSelectStep({ id: '3' });
    component.update();
    await instance.saveAllSteps();

    expect(addSteps).toHaveBeenCalledWith(
      [
        {
          id: '1',
          body: 'test 1',
          selected: true,
        },
        {
          id: '3',
          body: 'test 3',
          selected: true,
        },
      ],
      1,
      { id: 2 },
    );
    expect(onComplete).toHaveBeenCalled();
  });
});
