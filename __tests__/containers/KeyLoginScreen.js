import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import KeyLoginScreen from '../../src/containers/KeyLoginScreen';
import Adapter from 'enzyme-adapter-react-16/build/index';
import Enzyme, { shallow } from 'enzyme/build/index';
import { createMockStore, testSnapshot } from '../../testUtils';
import { Provider } from 'react-redux';
import * as auth from '../../src/actions/auth';
import * as navigation from '../../src/actions/navigation';
import * as people from '../../src/actions/people';

let store;

jest.mock('react-native-device-info');
jest.mock('../../src/actions/auth');
jest.mock('../../src/actions/navigation');

beforeEach(() => {
  store = createMockStore();
  Enzyme.configure({ adapter: new Adapter() });
});

it('renders correctly', () => {
  testSnapshot(
    <Provider store={store}>
      <KeyLoginScreen />
    </Provider>
  );
});

describe('when login button is clicked', () => {
  let user;
  let person;
  let screen;

  const click = () => screen.dive().dive().dive().find('Button').simulate('press');

  const setupUserAndPerson = (userStage, personStage) => {
    user = { pathway_stage_id: userStage };
    person = {
      reverse_contact_assignments: [ { pathway_stage_id: personStage }],
    };
  };

  beforeEach(() => {
    screen = shallow(
      <KeyLoginScreen />,
      { context: { store: store } }
    );

    navigation.navigatePush = (screen) => screen;

    auth.keyLogin = jest.fn().mockReturnValue(Promise.resolve({
      findAll: () => [user],
    }));

    people.getPeopleList = jest.fn().mockReturnValue(Promise.resolve({
      findAll: () => [person],
    }));
  });

  it('user navigates to GetStarted screen if stage is not set', async() => {
    setupUserAndPerson(null, 3);

    await click();

    expect(store.dispatch).toHaveBeenLastCalledWith('GetStarted');
  });

  it('user navigates to MainTabs if stage is set and has a contact with stage set', async() => {
    setupUserAndPerson(5, 3);

    await await click();

    expect(store.dispatch).toHaveBeenLastCalledWith('MainTabs');
  });

  it('user navigates to AddSomeone screen if stage is set but does not have a contact with stage set', async() => {
    setupUserAndPerson(5, null);

    await await click();

    expect(store.dispatch).toHaveBeenLastCalledWith('AddSomeone');
  });
});

