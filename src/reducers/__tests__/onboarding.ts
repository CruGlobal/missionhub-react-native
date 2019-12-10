import { onboardingReducer } from '../onboarding';
import {
  SET_ONBOARDING_PERSON_ID,
  SET_ONBOARDING_COMMUNITY,
  SKIP_ONBOARDING_ADD_PERSON,
} from '../../actions/onboarding';
import { LOGOUT } from '../../constants';

it('should set person id', () => {
  expect(
    onboardingReducer(undefined, {
      type: SET_ONBOARDING_PERSON_ID,
      personId: '1',
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "community": null,
      "personId": "1",
      "skippedAddingPerson": false,
    }
  `);
});

it('should set community', () => {
  expect(
    onboardingReducer(undefined, {
      type: SET_ONBOARDING_COMMUNITY,
      community: {
        id: '10',
        community_code: '123abc',
        community_url: 'asdf123asdf123',
      },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "community": Object {
        "community_code": "123abc",
        "community_url": "asdf123asdf123",
        "id": "10",
      },
      "personId": "",
      "skippedAddingPerson": false,
    }
  `);
});

it('should set skippedAddingPerson', () => {
  expect(
    onboardingReducer(undefined, {
      type: SKIP_ONBOARDING_ADD_PERSON,
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "community": null,
      "personId": "",
      "skippedAddingPerson": true,
    }
  `);
});

it('should handle logout', () => {
  expect(
    onboardingReducer(
      {
        community: {
          community_code: '123abc',
          community_url: '123sadf123sadf',
          id: '10',
        },
        personId: '1',
        skippedAddingPerson: true,
      },
      {
        type: LOGOUT,
      },
    ),
  ).toMatchInlineSnapshot(`
    Object {
      "community": null,
      "personId": "",
      "skippedAddingPerson": false,
    }
  `);
});
