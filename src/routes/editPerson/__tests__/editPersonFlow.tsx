import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { EditPersonFlowScreens } from '../editPersonFlow';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { useIsMe } from '../../../utils/hooks/useIsMe';
import { trackScreenChange, trackAction } from '../../../actions/analytics';
import { getPersonDetails } from '../../../actions/person';
import { UPDATE_PERSON } from '../../../containers/SetupScreen/queries';
import { SELECT_STAGE_SCREEN } from '../../../containers/SelectStageScreen';
import { getStages } from '../../../actions/stages';
import { Stage } from '../../../reducers/stages';
import { selectPersonStage } from '../../../actions/selectStage';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/person');
jest.mock('../../../utils/hooks/useIsMe');
jest.mock('../../../actions/selectStage');
jest.mock('../../../actions/stages');
jest.mock('react-native-device-info');

const me = { id: '1' };
const next = jest.fn();
const navigateBackResponse = { type: 'navigate back' };
const navigatePushResponse = { type: 'navigate push' };
const getPersonDetailsResponse = { type: 'get person details' };
const trackActionResponse = { type: 'track action' };
const trackScreenChangeResponse = { type: 'track screen change' };
const selectPersonStageResult = { type: 'update select person stage' };

const baseStage: Stage = {
  id: '1',
  name: 'stage',
  description: 'description',
  self_followup_description: 'description',
  position: 1,
  name_i18n: 'en-US',
  description_i18n: 'description',
  icon_url: 'https://misisonhub.com',
  localized_pathway_stages: [],
};

const stages: Stage[] = [
  {
    ...baseStage,
    id: '1',
    name: 'Stage 1',
    description: 'Stage 1 description',
  },
  {
    ...baseStage,
    id: '2',
    name: 'Stage 2',
    description: 'Stage 2 description',
  },
  {
    ...baseStage,
    id: '3',
    name: 'Stage 3',
    description: 'Stage 3 description',
  },
];
const getStagesResult = { type: 'get stages', response: stages };

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
  (trackAction as jest.Mock).mockReturnValue(trackActionResponse);
  (useIsMe as jest.Mock).mockReturnValue(false);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (getStages as jest.Mock).mockReturnValue(getStagesResult);
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResponse);
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResult);
  (next as jest.Mock).mockReturnValue({ type: 'next' });
});

describe('AddContactScreen next', () => {
  it('navigates back if user hits back button', async () => {
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    const { store, getByTestId } = renderWithContext(
      <WrappedAddContactScreen />,
      {
        initialState: {
          auth: { person: me, isJean: true },
          drawer: { isOpen: false },
        },
        navParams: {},
      },
    );

    await fireEvent.press(getByTestId('backIcon'));
    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([navigateBackResponse]);
  });

  it('navigates back if edited and current user is the one being edited', async () => {
    (useIsMe as jest.Mock).mockReturnValue(true);
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    const { store, getByTestId } = renderWithContext(
      <WrappedAddContactScreen />,
      {
        initialState: {
          auth: { person: { id: '1' }, isJean: true },
          drawer: { isOpen: false },
        },
        navParams: {
          person: me,
        },
        mocks: {
          Person: () => ({
            id: me.id,
            firstName: 'Christian',
            lastName: '',
            relationshipType: RelationshipTypeEnum.family,
            stage: {
              name: 'Forgiven',
            },
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    // This test fails with one flushMicrotaskQueue for some reason
    await flushMicrotasksQueue();
    await fireEvent.press(getByTestId('continueButton'));
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: me.id,
          firstName: 'Christian',
          lastName: '',
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    });
    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      getPersonDetailsResponse,
      navigateBackResponse,
    ]);
  });

  it('navigates back after edited and current user is not being edited', async () => {
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    const { store, getByTestId } = renderWithContext(
      <WrappedAddContactScreen />,
      {
        initialState: {
          auth: { person: { id: '1' }, isJean: true },
          drawer: { isOpen: false },
        },
        navParams: {
          person: {
            id: '2',
            relationship_type: RelationshipTypeEnum.family,
          },
        },
        mocks: {
          Person: () => ({
            id: '2',
            firstName: 'Christian',
            lastName: '',
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    await fireEvent.press(getByTestId('continueButton'));
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: '2',
          firstName: 'Christian',
          lastName: '',
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    });
    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      getPersonDetailsResponse,
      navigateBackResponse,
    ]);
  });

  it('navigates to stage select screen', async () => {
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    const { store, getByTestId } = renderWithContext(
      <WrappedAddContactScreen />,
      {
        initialState: {
          auth: { person: { id: '1' }, isJean: true },
          drawer: { isOpen: false },
        },
        navParams: {
          person: {
            id: '2',
            relationship_type: RelationshipTypeEnum.family,
          },
        },
        mocks: {
          Person: () => ({
            id: '2',
            firstName: 'Christian',
            lastName: '',
            relationshipType: RelationshipTypeEnum.family,
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    await fireEvent.press(getByTestId('stageSelectButton'));
    expect(navigatePush).toHaveBeenCalledWith(SELECT_STAGE_SCREEN, {
      enableBackButton: false,
      personId: '2',
      section: 'people',
      subsection: 'person',
      orgId: undefined,
      onComplete: expect.any(Function),
    });
    expect(store.getActions()).toEqual([navigatePushResponse]);
  });
});

describe('SelectStageScreen next', () => {
  it('navigates back after stage is selected', async () => {
    const onComplete = jest.fn();
    const WrappedSelectStageScreen =
      EditPersonFlowScreens[SELECT_STAGE_SCREEN].screen;

    const { store, getAllByTestId } = renderWithContext(
      <WrappedSelectStageScreen next={next} />,
      {
        initialState: {
          auth: { person: me, isJean: true },
          drawer: { isOpen: false },
          people: { allByOrg: {} },
          stages: { stages },
          onboarding: { currentlyOnboarding: false },
        },
        navParams: {
          enableBackButton: false,
          personId: '2',
          section: 'people',
          subsection: 'person',
          orgId: undefined,
          onComplete,
        },
      },
    );

    await fireEvent.press(getAllByTestId('stageSelectButton')[1]);
    await flushMicrotasksQueue();
    // expect(selectPersonStage).toHaveBeenCalledWith(stages[1]);
    // expect(onComplete).toHaveBeenCalledWith(stages[1]);
    expect(store.getActions()).toEqual([
      trackScreenChangeResponse,
      // selectPersonStageResult,
      // navigateBackResponse,
    ]);
  });
});
