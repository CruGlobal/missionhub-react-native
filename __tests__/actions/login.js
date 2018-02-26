import * as person from '../../src/actions/person';
import * as navigation from '../../src/actions/navigation';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { onSuccessfulLogin } from '../../src/actions/login';
import { mockFnWithParams } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import { ADD_SOMEONE_SCREEN } from '../../src/containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../src/containers/GetStartedScreen';
import { MAIN_TABS } from '../../src/constants';

const mockStore = configureStore([ thunk ]);
const personId = 593348;
let store;
let user;
let myContact;
let myPerson;
const updateStatusResult = { type: 'now logged in' };

describe('onSuccessfulLogin', () => {
  beforeEach(() => {
    store = mockStore({ auth: { personId: personId } });

    user = {};
    myContact = {};
    myPerson = { contact_assignments: [ myContact ] };

    mockFnWithParams(analytics, 'logInAnalytics', updateStatusResult);

    const getPersonResult = {};
    mockFnWithParams(getPersonResult, 'findAll', [ user ], 'user');
    mockFnWithParams(getPersonResult, 'find', myPerson, 'person', personId);

    mockFnWithParams(person, 'getPerson', () => Promise.resolve(getPersonResult), personId);
    navigation.navigatePush = (screen) => ({ type: screen });
  });

  it('should navigate to Get Started', async() => {
    user.pathway_stage_id = null;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([ updateStatusResult, { type: GET_STARTED_SCREEN } ]);
  });

  it('should navigate to Add Someone', async() => {
    user.pathway_stage_id = 4;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([ updateStatusResult, { type: ADD_SOMEONE_SCREEN } ]);
  });

  it('should navigate to Main Tabs', async() => {
    user.pathway_stage_id = 5;
    myContact.pathway_stage_id = 2;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([ updateStatusResult, { type: MAIN_TABS } ]);
  });
});
