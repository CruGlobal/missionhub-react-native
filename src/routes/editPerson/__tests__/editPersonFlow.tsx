import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ADD_CONTACT_SCREEN } from '../../../containers/AddContactScreen';
import { EditPersonFlowScreens } from '../editPersonFlow';
import { renderShallow } from '../../../../testUtils';
import { navigateBack } from '../../../actions/navigation';

jest.mock('../../../actions/navigation');

const store = configureStore([thunk])({
  auth: { person: { id: '1' }, isJean: true },
});
const navigation = { state: { params: {} } };

const navigateBackResponse = { type: 'navigate back' };

beforeEach(() => {
  store.clearActions();
});

describe('AddContactScreen next', () => {
  it('should fire required next actions', () => {
    navigateBack.mockReturnValue(navigateBackResponse);

    const WrappedAddContactScreen =
      EditPersonFlowScreens[ADD_CONTACT_SCREEN].screen;

    store.dispatch(
      renderShallow(<WrappedAddContactScreen navigation={navigation} />, store)
        .instance()
        .props.next(),
    );

    expect(navigateBack).toHaveBeenCalledWith();
    expect(store.getActions()).toEqual([navigateBackResponse]);
  });
});
