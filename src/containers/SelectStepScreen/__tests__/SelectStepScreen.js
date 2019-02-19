import 'react-native';
import React from 'react';

import SelectStepScreen, { mapStateToProps } from '..';

import {
  renderShallow,
  createMockStore,
  testSnapshotShallow,
} from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';
import { ADD_STEP_SCREEN } from '../../AddStepScreen';
import { getStepSuggestions } from '../../../actions/steps';
import { shuffleArray } from '../../../utils/common';
import { CREATE_STEP } from '../../../constants';

jest.mock('react-native-device-info');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/common');
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

const org = { id: 2 };

const receiverId = '1';

const headerText = 'header';

const steps = {
  suggestedForOthers: {
    [contactStageId]: suggestions,
  },
};

let store = createMockStore({
  auth,
  steps,
});

let component, parallaxProps, flatListProps, instance;
let onComplete = jest.fn();
let createStepTracking = {};
let enableBackButton = false;

const createComponent = async () => {
  getStepSuggestions.mockReturnValue(
    Promise.resolve({ response: suggestions }),
  );
  component = renderShallow(
    <SelectStepScreen
      isMe={false}
      headerText={headerText}
      contactStageId={contactStageId}
      createStepTracking={createStepTracking}
      onComplete={onComplete}
      personFirstName={testName}
      enableBackButton={enableBackButton}
      receiverId={receiverId}
      organization={org}
    />,
    store,
  );
  parallaxProps = component.find('ParallaxScrollView').props();
  flatListProps = component.find('FlatList').props();
  instance = component.instance();
  await Promise.resolve();
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

  it('should render step item correctly', () => {
    testSnapshotShallow(flatListProps.renderItem({ item: suggestions[0] }));
  });

  it('should render load more button correctly', () => {
    testSnapshotShallow(flatListProps.ListFooterComponent());
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
  it('should call getStepSuggestions every time component mounts', async () => {
    store = createMockStore({ auth, steps: { suggestedForOthers: {} } });
    await createComponent();

    expect(getStepSuggestions).toHaveBeenCalled();
    store = createMockStore({ auth, steps });
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
    createStepTracking = { test: 'this is a test tracking property' };
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
