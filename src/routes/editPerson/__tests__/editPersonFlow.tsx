import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { EditPersonFlowScreens } from '../editPersonFlow';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { useIsMe } from '../../../utils/hooks/useIsMe';
import {
  trackScreenChange,
  trackActionWithoutData,
} from '../../../actions/analytics';
import { getPersonDetails } from '../../../actions/person';
import { UPDATE_PERSON } from '../../../containers/SetupScreen/queries';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/person');
jest.mock('../../../utils/hooks/useIsMe');

const me = { id: '1' };
const navigateBackResponse = { type: 'navigate back' };
const getPersonDetailsResponse = { type: 'get person details' };
const trackActionResponse = { type: 'track action' };
const trackScreenChangeResponse = { type: 'track screen change' };

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
  (useIsMe as jest.Mock).mockReturnValue(false);
  (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);
  (getPersonDetails as jest.Mock).mockReturnValue(getPersonDetailsResponse);
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
});
