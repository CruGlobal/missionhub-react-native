import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import ContactHeader from '../src/components/ContactHeader';
import { testSnapshot } from '../testUtils';
import { Provider } from 'react-redux';
import { createMockStore } from '../testUtils/index';
import { CASEY, JEAN } from '../src/constants';

const mockState = {
  steps: {
    mine: [],
  },
  swipe: {
    stepsContact: true,
  },
};

const store = createMockStore(mockState);

const mockPerson = { first_name: 'ben', id: 1 };

jest.mock('NativeAnimatedHelper');

it('renders casey', () => {
  testContactHeader(mockPerson, CASEY);
});

it('renders jean', () => {
  testContactHeader(mockPerson, JEAN);
});

it('renders jean with a missionhub user as contact', () => {
  testContactHeader({ ...mockPerson, userId: 123 }, JEAN);
});

const testContactHeader = (person, type) => {
  testSnapshot(
    <Provider store={store}>
      <ContactHeader person={person} type={type} onChangeStage={() => {}} />
    </Provider>,
  );
};
