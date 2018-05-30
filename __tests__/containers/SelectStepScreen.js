import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import SelectStepScreen, {
  mapStateToProps,
} from '../../src/containers/SelectStepScreen';
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

const suggestions = [
  { id: '1', body: 'test 1' },
  { id: '2', body: 'test 2' },
  { id: '3', body: 'test 3' },
  { id: '4', body: 'test 4' },
  { id: '5', body: 'test 5' },
  { id: '6', body: 'test 6' },
  { id: '7', body: 'test 7' },
  { id: '8', body: 'test 8' },
  { id: '9', body: 'test 9' },
];

const store = createMockStore({
  auth: {
    person: {
      id: '123',
    },
  },
  steps: {
    suggestedForOthers: {
      [stageId]: suggestions,
    },
  },
});

describe('mapStateToProps', () => {
  it('should provide necessary props for me', () => {
    expect(
      mapStateToProps(
        {
          auth: {
            person: {
              id: '123',
            },
          },
          steps: {
            suggestedForMe: {
              [stageId]: [{ id: '1', body: 'test 1' }],
            },
            suggestedForOthers: {},
          },
        },
        {
          isMe: true,
          contactStage,
        },
      ),
    ).toMatchSnapshot();
  });

  it('should provide necessary props for others', () => {
    expect(
      mapStateToProps(
        {
          auth: {
            person: {
              id: '123',
            },
          },
          steps: {
            suggestedForMe: {},
            suggestedForOthers: {
              [stageId]: [{ id: '1', body: 'test 1' }],
            },
          },
        },
        {
          isMe: false,
          contactStage,
        },
      ),
    ).toMatchSnapshot();
  });
});

jest.mock('react-native-device-info');

let component, parallaxProps, instance;
let onComplete = () => {};
let createStepTracking = {};
let enableBackButton = false;

const createComponent = async () => {
  component = renderShallow(
    <SelectStepScreen
      isMe={false}
      contactStage={contactStage}
      createStepTracking={createStepTracking}
      onComplete={onComplete}
      personFirstName={testName}
      enableBackButton={enableBackButton}
      receiverId={1}
      organization={{ id: 2 }}
    />,
    store,
  );
  parallaxProps = component.find('ParallaxScrollView').props();
  instance = component.instance();
};

describe('SelectStepScreen', () => {
  beforeEach(async () => {
    await createComponent();
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
  it('should render save button', async () => {
    await createComponent();

    component.instance().handleSelectStep({ id: '1' });
    component.update();
    expect(component).toMatchSnapshot();
  });
});

describe('renderBackButton', () => {
  it('should render back button', async () => {
    enableBackButton = true;
    await createComponent();

    expect(component).toMatchSnapshot();
  });
});

describe('Navigation', () => {
  it('navigates to add step screen', async () => {
    navigation.navigatePush = jest.fn();
    createStepTracking = 'this is a test tracking property';
    onComplete = jest.fn();
    await createComponent();

    instance.handleCreateStep();

    expect(navigation.navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
      type: CREATE_STEP,
      onComplete: expect.any(Function),
      trackingObj: createStepTracking,
    });
  });
});

describe('handleLoadSteps', () => {
  beforeAll(async () => {
    await createComponent();
  });

  it('Initially displays four suggestions', () => {
    expect(instance.state.steps).toEqual(suggestions.slice(0, 4));
  });
  it('Loads four more suggestions', () => {
    instance.handleLoadSteps();
    component.update();
    expect(instance.state.steps).toEqual(suggestions.slice(0, 8));
  });
  it('Loads last suggestion', () => {
    instance.handleLoadSteps();
    component.update();
    expect(instance.state.steps).toEqual(suggestions);
  });
  it('loads no more because all suggestions are displayed', () => {
    instance.handleLoadSteps();
    component.update();
    expect(instance.state.steps).toEqual(suggestions);
  });
});

describe('saveAllSteps', () => {
  it('should add the selected steps', async () => {
    onComplete = jest.fn();
    addSteps.mockReturnValue(Promise.resolve());
    await createComponent();

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
