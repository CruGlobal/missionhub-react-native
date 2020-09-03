import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import { DrawerActions } from 'react-navigation-drawer';

import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { EditPersonFlowScreens } from '../editPersonFlow';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { trackAction } from '../../../actions/analytics';
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
jest.mock('../../../actions/selectStage');
jest.mock('../../../actions/stages');
jest.mock('react-native-device-info');
jest.mock('react-navigation-drawer');
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const me = { id: '1' };
const next = jest.fn();
const navigateBackResponse = { type: 'navigate back' };
const navigatePushResponse = { type: 'navigate push' };
const getPersonDetailsResponse = { type: 'get person details' };
const trackActionResponse = { type: 'track action' };
const selectPersonStageResult = { type: 'update select person stage' };
const closeDrawerResults = { type: 'drawer closed' };

const baseStage: Stage = {
  id: '1',
  name: 'stage',
  description: 'description',
  self_followup_description: 'description',
  position: 1,
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
  (trackAction as jest.Mock).mockReturnValue(trackActionResponse);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
  (getStages as jest.Mock).mockReturnValue(getStagesResult);
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResponse);
  (selectPersonStage as jest.Mock).mockReturnValue(selectPersonStageResult);
  (next as jest.Mock).mockReturnValue({ type: 'next' });
  (DrawerActions.closeDrawer as jest.Mock).mockReturnValue(closeDrawerResults);
});

describe('AddContactScreen next', () => {
  it('navigates back if user hits back button', async () => {
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    const { store, getByTestId } = renderWithContext(
      <WrappedAddContactScreen />,
      {
        initialState: {
          drawer: { isOpen: false },
        },
        navParams: {},
      },
    );

    await fireEvent.press(getByTestId('BackButton'));
    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      closeDrawerResults,
      navigateBackResponse,
    ]);
  });

  it('navigates back if edited and current user is the one being edited', async () => {
    (useIsMe as jest.Mock).mockReturnValue(true);
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    const { store, getByTestId } = renderWithContext(
      <WrappedAddContactScreen />,
      {
        initialState: {
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
      closeDrawerResults,
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
      closeDrawerResults,
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
    jest.useFakeTimers();
    const onComplete = jest.fn();
    const WrappedSelectStageScreen =
      EditPersonFlowScreens[SELECT_STAGE_SCREEN].screen;

    const { store, getAllByTestId } = renderWithContext(
      <WrappedSelectStageScreen next={next} />,
      {
        initialState: {
          drawer: { isOpen: false },
          people: { people: {} },
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
        mocks: { User: () => ({ person: () => ({ id: me.id }) }) },
      },
    );

    await flushMicrotasksQueue();

    fireEvent.press(getAllByTestId('stageSelectButton')[1]);
    jest.runAllTimers();
    expect(selectPersonStage).toHaveBeenCalledWith(
      '2',
      me.id,
      stages[1].id,
      undefined,
    );
    expect(onComplete).toHaveBeenCalledWith(stages[1]);
    expect(store.getActions()).toEqual([
      selectPersonStageResult,
      navigateBackResponse,
      trackActionResponse,
    ]);
  });
});
