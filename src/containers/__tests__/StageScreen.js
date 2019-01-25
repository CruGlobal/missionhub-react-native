import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import StageScreen from '../StageScreen';
import {
  createMockNavState,
  mockFnWithParams,
  renderShallow,
  testSnapshot,
} from '../../../testUtils';
import * as selectStage from '../../actions/selectStage';
import * as navigation from '../../actions/navigation';
import { SELECT_MY_STEP_SCREEN } from '../SelectMyStepScreen';

jest.mock('react-native-device-info');

const mockState = {
  profile: {
    firstName: 'Roger',
  },
  stages: {},
};
const mockStage = {
  id: 1,
};
const mockCurrentStage = { id: 2 };

const mockComplete = jest.fn();
const contactId = '123';
const orgId = '111';

const mockStore = configureStore([thunk]);
let store;
let component;

function buildShallowScreen(props) {
  return renderShallow(
    <StageScreen
      navigation={createMockNavState({
        name: 'Test',
        contactId,
        orgId,
        currentStage: mockCurrentStage.id,
        section: 'section',
        subsection: 'subsection',
        onComplete: mockComplete,
        dispatch: null,
        ...props,
      })}
    />,
    store,
  ).instance();
}

beforeEach(() => {
  store = mockStore(mockState);
  mockComplete.mockReset();
});

it('StageScreen renders correctly with back button', () => {
  testSnapshot(
    <Provider store={store}>
      <StageScreen
        navigation={createMockNavState({
          enableBackButton: true,
          section: 'section',
          subsection: 'subsection',
        })}
      />
    </Provider>,
  );
});

describe('StageScreen', () => {
  let tree;

  beforeEach(() => {
    tree = renderer.create(
      <Provider store={store}>
        <StageScreen
          navigation={createMockNavState({
            enableBackButton: false,
            section: 'section',
            subsection: 'subsection',
          })}
        />
      </Provider>,
    );
  });

  it('renders correctly without back button', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('handleSelectStage', () => {
  const selectStageAction = { type: 'selected stage' };
  const selectMyStepNavAction = {
    type: 'navigated to select my step screen',
  };
  const navigateBackAction = { type: 'navigated back 2x' };
  const nextResponse = { type: 'next' };

  selectStage.selectMyStage = jest.fn(() => selectStageAction);
  navigation.navigatePush = jest.fn((_, params) => {
    params.onSaveNewSteps();
    return selectMyStepNavAction;
  });
  navigation.navigateBack = jest.fn(() => navigateBackAction);
  const mockNext = jest.fn(() => nextResponse);

  describe('when not already selected', () => {
    describe('and onComplete prop exists', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component = buildShallowScreen({});
      });

      describe('and no nav is false', () => {
        it('should select stage, navigate to select step screen, then onComplete navigates to contact screen', async () => {
          await component.handleSelectStage(mockStage, false);

          expect(store.getActions()).toEqual([
            selectStageAction,
            navigateBackAction,
            selectMyStepNavAction,
          ]);
        });
      });
    });

    describe('and next prop exists', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        component = buildShallowScreen({
          onComplete: undefined,
          next: mockNext,
        });
      });

      it('should select stage, then call next', async () => {
        await component.handleSelectStage(mockStage, false);

        expect(mockNext).toHaveBeenCalledWith({
          stage: mockStage,
          contactId,
          orgId,
          isAlreadySelected: false,
        });
        expect(store.getActions()).toEqual([selectStageAction, nextResponse]);
      });
    });
  });
});

describe('stage screen methods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs select stage with active', () => {
    component = buildShallowScreen({ noNav: true });

    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });

  it('runs select stage with active', () => {
    component = buildShallowScreen({ noNav: true });

    component.handleSelectStage(mockStage, true);

    expect(mockComplete).toHaveBeenCalledTimes(1);
  });
});
