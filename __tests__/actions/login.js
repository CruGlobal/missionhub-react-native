import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Crashlytics } from 'react-native-fabric';
import * as RNOmniture from 'react-native-omniture';

import * as person from '../../src/actions/person';
import * as navigation from '../../src/actions/navigation';
import { onSuccessfulLogin } from '../../src/actions/login';
import { mockFnWithParams } from '../../testUtils';
import * as analytics from '../../src/actions/analytics';
import { ADD_SOMEONE_SCREEN } from '../../src/containers/AddSomeoneScreen';
import { GET_STARTED_SCREEN } from '../../src/containers/GetStartedScreen';
import { MAIN_TABS } from '../../src/constants';
import * as onboardingProfile from '../../src/actions/onboardingProfile';

const mockStore = configureStore([ thunk ]);
const personId = '593348';
const global_registry_mdm_id = 'c6e4fdcf-d638-46b7-a02b-8c6c1cc4af23';
let store;
let user;
let myContact;
let myPerson;
const updateStatusResult = { type: 'now logged in' };

jest.mock('react-native-omniture');

describe('onSuccessfulLogin', () => {
  beforeEach(() => {
    store = mockStore({
      auth: {
        person: {
          id: personId,
        },
      },
    });

    user = {};
    myContact = {};
    myPerson = { user, contact_assignments: [ myContact ], global_registry_mdm_id };

    mockFnWithParams(analytics, 'logInAnalytics', updateStatusResult);

    mockFnWithParams(person, 'getMe', () => Promise.resolve(myPerson), 'contact_assignments');
    navigation.navigateReset = (screen) => ({ type: screen });
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

  it('should complete onboarding and navigate to Main Tabs', async() => {
    const onboardingCompleteAction = { type: 'onboarding done' };
    mockFnWithParams(onboardingProfile, 'completeOnboarding', onboardingCompleteAction);
    user.pathway_stage_id = 5;
    myContact.pathway_stage_id = 2;

    await store.dispatch(onSuccessfulLogin());

    expect(store.getActions()).toEqual([ updateStatusResult, onboardingCompleteAction, { type: MAIN_TABS } ]);
  });

  it('should set Fabric user id', async() => {
    await store.dispatch(onSuccessfulLogin());

    expect(Crashlytics.setUserIdentifier).toHaveBeenCalledWith(`${personId}`);
  });

  it('should track global registry master person id', async() => {
    await store.dispatch(onSuccessfulLogin());

    expect(RNOmniture.syncIdentifier).toHaveBeenCalledWith(global_registry_mdm_id);
  });
});
