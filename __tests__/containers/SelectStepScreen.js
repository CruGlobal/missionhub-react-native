import 'react-native';
import React from 'react';

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
import { addSteps, getStepSuggestions } from '../../src/actions/steps';
import { shuffleArray } from '../../src/utils/common';
import { CREATE_STEP } from '../../src/constants';

jest.mock('react-native-device-info');
jest.mock('../../src/actions/steps');
jest.mock('../../src/utils/common');
shuffleArray.mockImplementation(arr => arr);

const testName = 'Bill';

const contactStageId = 5;

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

const auth = {
  person: {
    id: '123',
  },
};

const steps = {
  suggestedForOthers: {
    [contactStageId]: suggestions,
  },
};

let store = createMockStore({
  auth,
  steps,
});

let component, parallaxProps, instance;
let onComplete = jest.fn();
let createStepTracking = {};
let enableBackButton = false;

const createComponent = async () => {
  component = renderShallow(
    <SelectStepScreen
      isMe={false}
      contactStageId={contactStageId}
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
              [contactStageId]: [{ id: '1', body: 'test 1' }],
            },
            suggestedForOthers: {},
          },
        },
        {
          isMe: true,
          contactStageId,
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
              [contactStageId]: [{ id: '1', body: 'test 1' }],
            },
          },
        },
        {
          isMe: false,
          contactStageId,
        },
      ),
    ).toMatchSnapshot();
  });
});

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

  it('should call navigate back two screens', () => {
    navigation.navigateBack = jest.fn();
    instance.navigateBackTwoScreens();
    expect(navigation.navigateBack).toHaveBeenCalledWith(2);
  });

  it('should call steps list ref', () => {
    instance.stepsListRef('test');
    expect(instance.stepsList).toEqual('test');
  });
});

describe('componentDidMount', () => {
  it('should not call getStepSuggestions if Redux has suggestions', async () => {
    await createComponent();

    expect(getStepSuggestions).not.toHaveBeenCalled();
  });

  it('should call getStepSuggestions if Redux has no suggestions', async () => {
    store = createMockStore({ auth, steps: { suggestedForOthers: {} } });
    await createComponent();

    expect(getStepSuggestions).toHaveBeenCalled();
    store = createMockStore({ auth, steps });
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
    enableBackButton = false;
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
    createStepTracking = {};
    onComplete = jest.fn();
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
