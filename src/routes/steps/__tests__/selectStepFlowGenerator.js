import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as reactNavigation from 'react-navigation';

import { renderShallow } from '../../../../testUtils/index';
import { selectStepFlowGenerator } from '../selectStepFlowGenerator';
import { navigatePush } from '../../../actions/navigation';
import { reloadJourney } from '../../../actions/journey';
import { CELEBRATION_SCREEN } from '../../../containers/CelebrationScreen/index';
import { SUGGESTED_STEP_DETAIL_SCREEN } from '../../../containers/SuggestedStepDetailScreen';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';
import { addStep } from '../../../actions/steps';
import SelectMyStepScreen from '../../../containers/SelectMyStepScreen';
import { CREATE_STEP } from '../../../constants';
import { buildCustomStep } from '../../../utils/steps';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/steps');
jest.mock('../../../utils/steps');

const myId = '111';
const personId = '2342342';
const orgId = '123';
const text = 'some step';
const step = { id: '424234243' };

const store = configureStore([thunk])({
  swipe: {
    completeStepExtraBack: false,
  },
  auth: {
    person: { id: myId, user: {} },
  },
});

const firstScreenRoute = 'nav/FIRST SCREEN';

const buildAndCallNext = async (screen, navParams, nextProps) => {
  const Component = selectStepFlowGenerator(
    firstScreenRoute,
    SelectMyStepScreen,
  )[screen];

  await store.dispatch(
    renderShallow(
      <Component
        navigation={{
          state: {
            params: navParams,
          },
        }}
      />,
      store,
    )
      .instance()
      .props.next(nextProps),
  );
};

const navigatePushResponse = { type: 'navigate push' };
const reloadJourneyResponse = { type: 'reload journey' };
const popToTopResponse = { type: 'pop to top of stack' };
const popResponse = { type: 'pop once' };
const addStepResponse = { type: 'added step' };

addStep.mockReturnValue(addStepResponse);
buildCustomStep.mockReturnValue(step);
navigatePush.mockReturnValue(navigatePushResponse);
reloadJourney.mockReturnValue(reloadJourneyResponse);
reactNavigation.StackActions.popToTop = jest
  .fn()
  .mockReturnValue(popToTopResponse);
reactNavigation.StackActions.pop = jest.fn().mockReturnValue(popResponse);

beforeEach(() => {
  store.clearActions();
  jest.clearAllMocks();
});

describe('first screen next', () => {
  let isAddingCustomStep;

  beforeEach(() =>
    buildAndCallNext(
      firstScreenRoute,
      {},
      {
        isAddingCustomStep,
        receiverId: personId,
        orgId,
        step,
      },
    ));

  describe('not adding custom step', () => {
    beforeAll(() => (isAddingCustomStep = false));

    it('navigates to SuggestedStepDetailScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(SUGGESTED_STEP_DETAIL_SCREEN, {
        step,
        receiverId: personId,
        orgId,
      });
    });

    it('should fire required next actions', () => {
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });

  describe('adding custom step', () => {
    beforeAll(() => (isAddingCustomStep = true));

    it('navigates to AddStepScreen', () => {
      expect(navigatePush).toHaveBeenCalledWith(ADD_STEP_SCREEN, {
        personId,
        orgId,
        type: CREATE_STEP,
      });
    });

    it('should fire required next actions', () => {
      expect(store.getActions()).toEqual([navigatePushResponse]);
    });
  });
});

describe('SuggestedStepDetailScreen next', () => {
  beforeEach(() =>
    buildAndCallNext(SUGGESTED_STEP_DETAIL_SCREEN, {
      step,
      receiverId: personId,
    }));

  it('navigates to CelebrationScreen', () => {
    expect(navigatePush).toHaveBeenCalled();
  });

  it('should fire required next actions', () => {
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('AddStepScreen next', () => {
  beforeEach(() =>
    buildAndCallNext(
      ADD_STEP_SCREEN,
      { contactId: personId, orgId },
      { text, personId, orgId },
    ));

  it('navigates to CelebrationScreen', () => {
    expect(navigatePush).toHaveBeenCalledWith(CELEBRATION_SCREEN, {
      contactId: personId,
      orgId,
    });
  });

  it('creates custom step', () => {
    expect(buildCustomStep).toHaveBeenCalledWith(text, false);
  });

  it('sends step to api', () => {
    expect(addStep).toHaveBeenCalledWith(step, personId, { id: orgId });
  });

  it('should fire required next actions', () => {
    expect(store.getActions()).toEqual([addStepResponse, navigatePushResponse]);
  });
});

describe('CelebrationScreen next', () => {
  beforeEach(() =>
    buildAndCallNext(
      CELEBRATION_SCREEN,
      { contactId: myId, orgId },
      { contactId: myId, orgId },
    ));

  it('should reload journey', () => {
    expect(reloadJourney).toHaveBeenCalledWith(myId, orgId);
  });

  it('should return to top of stack', () => {
    expect(reactNavigation.StackActions.popToTop).toHaveBeenCalledTimes(1);
  });

  it('should navigate back', () => {
    expect(reactNavigation.StackActions.pop).toHaveBeenCalledWith({
      immediate: true,
    });
  });

  it('should fire required next actions', () => {
    expect(store.getActions()).toEqual([
      reloadJourneyResponse,
      popToTopResponse,
      popResponse,
    ]);
  });
});
