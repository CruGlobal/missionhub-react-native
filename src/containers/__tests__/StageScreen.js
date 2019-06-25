import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import StageScreen from '../StageScreen';
import {
  renderWithContext,
  createMockNavState,
  renderShallow,
} from '../../../testUtils';
import { selectMyStage } from '../../actions/selectStage';
import { navigatePush, navigateBack } from '../../actions/navigation';

jest.mock('react-native-device-info');
jest.mock('../PathwayStageScreen', () => 'PathwayStageScreen');
jest.mock('../../actions/selectStage');
jest.mock('../../actions/navigation');

const orgId = '111';
const contactId = '123';
const mockStage = {
  id: '0',
  name: 'uninterested',
};

const mockState = {
  auth: {
    person: {
      id: contactId,
    },
  },
  profile: {
    firstName: 'Roger',
  },
  stages: { stages: [mockStage] },
};

const mockCurrentStage = { id: 2 };

const mockComplete = jest.fn();

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
});

it('renders correctly with back button', () => {
  renderWithContext(<StageScreen />, {
    initialState: mockState,
    navParams: {
      enableBackButton: true,
      section: 'section',
      subsection: 'subsection',
    },
  }).snapshot();
});

it('renders correctly without back button', () => {
  renderWithContext(<StageScreen />, {
    initialState: mockState,
    navParams: {
      enableBackButton: false,
      section: 'section',
      subsection: 'subsection',
    },
  }).snapshot();
});

describe('handleSelectStage', () => {
  const selectStageAction = { type: 'selected stage' };
  const selectMyStepNavAction = {
    type: 'navigated to select my step screen',
  };
  const navigateBackAction = { type: 'navigated back 2x' };
  const nextResponse = { type: 'next' };

  selectMyStage.mockReturnValue(selectStageAction);
  navigatePush.mockImplementation((screen, { next }) => {
    store.dispatch(next());
    return selectMyStepNavAction;
  });
  navigateBack.mockReturnValue(navigateBackAction);

  describe('when not already selected', () => {
    describe('and onComplete prop exists', () => {
      beforeEach(() => {
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
      const next = jest.fn();

      beforeEach(() => {
        next.mockReturnValue(nextResponse);

        component = renderShallow(
          <StageScreen
            navigation={createMockNavState({
              name: 'Test',
              contactId,
              orgId,
              currentStage: mockCurrentStage.id,
              section: 'section',
              subsection: 'subsection',
              dispatch: null,
            })}
            next={next}
          />,
          store,
        ).instance();
      });

      it('should select stage, then call next, if stage not already selected', async () => {
        await component.handleSelectStage(mockStage, false);

        expect(selectMyStage).toHaveBeenCalledWith(mockStage.id);
        expect(next).toHaveBeenCalledWith({
          stage: mockStage,
          contactId,
          orgId,
          isAlreadySelected: false,
        });
        expect(store.getActions()).toEqual([selectStageAction, nextResponse]);
      });

      it('should only call next if stage already selected', async () => {
        await component.handleSelectStage(mockStage, true);

        expect(selectMyStage).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({
          stage: mockStage,
          contactId,
          orgId,
          isAlreadySelected: true,
        });
        expect(store.getActions()).toEqual([nextResponse]);
      });
    });
  });
});

describe('stage screen methods', () => {
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
