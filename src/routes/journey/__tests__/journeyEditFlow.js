import 'react-native';
import React from 'react';

import { renderShallow, createThunkStore } from '../../../../testUtils';
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

let store;

beforeEach(() => {
  navigateBack.mockReturnValue(navigateBackResult);
  updateChallengeNote.mockReturnValue(updateChallengeNoteResult);
  editComment.mockReturnValue(editCommentResult);
  getJourney.mockReturnValue(getJourneyResult);
  store = createThunkStore({ auth: { person: { id: personId } } });
});

describe('AddStepScreen next', () => {
  it('updates step and navigates back', async () => {
    const stepParams = {
      type: EDIT_JOURNEY_STEP,
      id: interationId,
      text,
      isEdit: true,
      personId,
      orgId,
    };

    const Component = JourneyEditFlowScreens[ADD_STEP_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: stepParams,
            },
          }}
        />,
        store,
      )
        .instance()
        .props.next(stepParams),
    );

    expect(updateChallengeNote).toHaveBeenCalledWith(interationId, text);
    expect(getJourney).toHaveBeenCalledWith(personId, orgId);
    expect(navigateBack).toHaveBeenCalledWith();
  });

  it('updates interaction and navigates back', async () => {
    const interactionParams = {
      type: EDIT_JOURNEY_ITEM,
      id: interationId,
      text,
      isEdit: true,
      personId,
      orgId,
    };

    const Component = JourneyEditFlowScreens[ADD_STEP_SCREEN];

    await store.dispatch(
      renderShallow(
        <Component
          navigation={{
            state: {
              params: interactionParams,
            },
          }}
        />,
        store,
      )
        .instance()
        .props.next(interactionParams),
    );

    expect(editComment).toHaveBeenCalledWith(interationId, text);
    expect(getJourney).toHaveBeenCalledWith(personId, orgId);
    expect(navigateBack).toHaveBeenCalledWith();
  });
});
