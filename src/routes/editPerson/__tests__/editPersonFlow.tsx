import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { fireEvent } from 'react-native-testing-library';

import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { PERSON_CATEGORY_SCREEN } from '../../../containers/PersonCategoryScreen';
import { EditPersonFlowScreens } from '../editPersonFlow';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { RelationshipTypeEnum } from '../../../../__generated__/globalTypes';
import { UPDATE_PERSON } from '../../../containers/SetupScreen/queries';
import { LOAD_PERSON_DETAILS } from '../../../constants';
import {
  trackScreenChange,
  trackActionWithoutData,
} from '../../../actions/analytics';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/organizations');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/analytics');

const me = { id: '1' };
const navigateBackResponse = { type: 'navigate back' };
const navigatePushResponse = { type: 'navigate push' };
const loadPersonResults = {
  person: {
    first_name: 'Christian',
    last_name: '',
    id: '2',
  },
  type: LOAD_PERSON_DETAILS,
};
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
          }),
        },
      },
    );

    await fireEvent.press(getByTestId('continueButton'));
    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([
      {
        ...loadPersonResults,
        person: {
          ...loadPersonResults.person,
          id: me.id,
        },
      },
      navigateBackResponse,
    ]);
  });

  it('navigates to person category screen if edited and current user is not being edited', async () => {
    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;
    (navigatePush as jest.Mock).mockReturnValue(navigatePushResponse);

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

    await fireEvent.press(getByTestId('continueButton'));
    expect(navigatePush).toHaveBeenCalledWith(PERSON_CATEGORY_SCREEN, {
      personId: '2',
      relationshipType: RelationshipTypeEnum.family,
      orgId: undefined,
    });
    expect(store.getActions()).toEqual([
      loadPersonResults,
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
          personId: '2',
          relationshipType: undefined,
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
