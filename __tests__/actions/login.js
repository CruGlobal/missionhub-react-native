import * as people from '../../src/actions/people';
import * as navigation from '../../src/actions/navigation';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { onSuccessfulLogin } from '../../src/actions/login';

const mockStore = configureStore([thunk]);
let store;
let user;
let myContact;
let myPerson;

describe('onSuccessfulLogin', () => {
  beforeEach(() => {
    store = mockStore({ auth: { personId: 5 } });

    user = {};
    myContact = {};
    myPerson = { pathway_stage_id: null, contact_assignments: [myContact] };

    people.getPerson = () => {
      return () => Promise.resolve({ findAll: () => [user], find: () => myPerson });
    };
    navigation.navigatePush = (screen) => ({ type: screen });
  });

  it('should navigate to Get Started', async() => {
    user.pathway_stage_id = null;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([{ type: 'GetStarted' }]);
  });

  it('should navigate to Add Someone', async() => {
    user.pathway_stage_id = 4;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([{ type: 'AddSomeone' }]);
  });

  it('should navigate to Main Tabs', async() => {
    user.pathway_stage_id = 5;
    myContact.pathway_stage_id = 2;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([{ type: 'MainTabs' }]);
  });
});