import 'react-native';
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CelebrateDetailScreen from '..';

import { renderShallow } from '../../../../testUtils';
import { celebrationItemSelector } from '../../../selectors/celebration';

jest.mock('../../../selectors/celebration');

const mockStore = configureStore([thunk]);
let store;

const organizationId = '24234234';
const event = { id: '90001', organization: { id: organizationId } };
const organizations = [event.organization];

let screen;

celebrationItemSelector.mockReturnValue(event);

beforeEach(() => {
  jest.clearAllMocks();

  store = mockStore({ organizations });

  screen = renderShallow(
    <CelebrateDetailScreen
      navigation={{
        state: {
          params: { event },
        },
      }}
    />,
    store,
  );
});

it('renders correctly', () => {
  expect(screen).toMatchSnapshot();
});

it('should call celebrationItemSelector', () => {
  expect(celebrationItemSelector).toHaveBeenCalledWith(
    { organizations },
    { eventId: event.id, organizationId },
  );
});
