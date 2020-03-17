import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent } from 'react-native-testing-library';

import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { PERSON_CATEGORY_SCREEN } from '../../../containers/PersonCategoryScreen';
import { EditPersonFlowScreens } from '../editPersonFlow';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { updatePerson } from '../../../actions/person';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { UPDATE_PERSON } from '../../../containers/SetupScreen/queries';
import {
  trackScreenChange,
  trackActionWithoutData,
} from '../../../actions/analytics';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/person');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/analytics');

const me = { id: '1' };
const navigateBackResponse = { type: 'navigate back' };
const navigatePushResponse = { type: 'navigate push' };
const updatePersonResponse = { type: 'update person', response: me };
const trackActionResponse = { type: 'track action' };
const trackScreenChangeResponse = { type: 'track screen change' };

beforeEach(() => {
  (trackScreenChange as jest.Mock).mockReturnValue(trackScreenChangeResponse);
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResponse);
});

describe('AddContactScreen next', () => {
  it('navigates back if user hits back button', async () => {
    (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);

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
    (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);
    (updatePerson as jest.Mock).mockReturnValue(updatePersonResponse);

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
      },
    );

    await fireEvent.press(getByTestId('continueButton'));
    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      updatePersonResponse,
      navigateBackResponse,
    ]);
  });

  it('navigates to person category screen if edited and current user is not being edited', async () => {
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;
    (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);
    (updatePerson as jest.Mock).mockReturnValue({
      ...updatePersonResponse,
      response: {
        id: '2',
      },
    });

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
          },
        },
      },
    );

    await fireEvent.press(getByTestId('continueButton'));
    expect(navigatePush).toHaveBeenCalledWith(PERSON_CATEGORY_SCREEN, {
      person: {
        id: '2',
      },
      orgId: undefined,
    });
    expect(store.getActions()).toEqual([
      {
        ...updatePersonResponse,
        response: {
          id: '2',
        },
      },
      navigatePushResponse,
    ]);
  });
});

describe('PersonCategoryScreen next', () => {
  it('navigates back twice when next fires', async () => {
    (navigateBack as jest.Mock).mockReturnValue(navigateBackResponse);

    const WrappedAddContactScreen =
      EditPersonFlowScreens[PERSON_CATEGORY_SCREEN].screen;

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
          },
        },
      },
    );

    await fireEvent.press(getByTestId('familyButton'));
    expect(navigateBack).toHaveBeenCalledTimes(2);
    expect(store.getActions()).toEqual([
      navigateBackResponse,
      navigateBackResponse,
    ]);
    expect(useMutation).toHaveBeenMutatedWith(UPDATE_PERSON, {
      variables: {
        input: {
          id: '2',
          relationshipType: RelationshipTypeEnum.family,
        },
      },
    });
  });
});
