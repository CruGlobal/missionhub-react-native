import 'react-native';
import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { EDIT_JOURNEY_STEP, EDIT_JOURNEY_ITEM } from '../../../constants';
import { JourneyEditFlowScreens } from '../journeyEditFlow';
import { navigateBack } from '../../../actions/navigation';
import { getJourney } from '../../../actions/journey';
import { updateChallengeNote } from '../../../actions/steps';
import { editComment } from '../../../actions/interactions';
import { ADD_STEP_SCREEN } from '../../../containers/AddStepScreen';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/journey');
jest.mock('../../../actions/steps');
jest.mock('../../../actions/interactions');

const personId = '111';
const orgId = '222';
const interationId = '1';
const text = 'Text';

const navigateBackResult = { type: 'navigated back' };
const updateChallengeNoteResult = { type: 'update challenge note' };
const editCommentResult = { type: 'edit comment' };
const getJourneyResult = { type: 'get journey' };

const initialState = {
  auth: { person: { id: personId } },
  drawer: {},
  analytics: {},
  onboarding: { currentlyOnboarding: false },
};

beforeEach(() => {
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResult);
  (updateChallengeNote as jest.Mock).mockReturnValue(updateChallengeNoteResult);
  (editComment as jest.Mock).mockReturnValue(editCommentResult);
  (getJourney as jest.Mock).mockReturnValue(getJourneyResult);
});

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const renderScreen = (navParams: any = {}) => {
  const Component = JourneyEditFlowScreens[ADD_STEP_SCREEN];

  const { store, getByType } = renderWithContext(<Component />, {
    initialState,
    navParams,
  });

  const originalComponent = getByType(Component).children[0];

  if (typeof originalComponent === 'string') {
    throw "Can't access component props";
  }

  const next = originalComponent.props.next;

  return { store, next };
};

describe('AddStepScreen next', () => {
  it('updates step and navigates back', async () => {
    const nextProps = {
      type: EDIT_JOURNEY_STEP,
      id: interationId,
      text,
      isEdit: true,
      personId,
      orgId,
    };

    const { store, next } = renderScreen(nextProps);

    await store.dispatch(next(nextProps));

    expect(navigateBack).toHaveBeenCalledWith();
    expect(updateChallengeNote).toHaveBeenCalledWith(interationId, text);
    expect(getJourney).toHaveBeenCalledWith(personId);
  });

  it('updates interaction and navigates back', async () => {
    const nextProps = {
      type: EDIT_JOURNEY_ITEM,
      id: interationId,
      text,
      isEdit: true,
      personId,
      orgId,
    };

    const { store, next } = renderScreen(nextProps);

    await store.dispatch(next(nextProps));

    expect(navigateBack).toHaveBeenCalledWith();
    expect(editComment).toHaveBeenCalledWith(interationId, text);
    expect(getJourney).toHaveBeenCalledWith(personId);
  });
});
