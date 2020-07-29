/* eslint-disable max-lines */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  DEFAULT_PAGE_LIMIT,
  RESET_CHALLENGE_PAGINATION,
  RESET_CELEBRATION_PAGINATION,
} from '../../constants';
import callApi from '../../actions/api';
import { REQUESTS } from '../../api/routes';
import { organizationSelector } from '../../selectors/organizations';
import { getFeed, reloadFeed, CELEBRATE, CHALLENGE } from '../actions';

jest.mock('../../selectors/organizations');
jest.mock('../../actions/api');

const orgId = '111';
const organizations = { all: { id: orgId } };
const callApiResponse = { type: 'call API' };

// @ts-ignore
let store;
// @ts-ignore
let type;

beforeEach(() => {
  store = configureStore([thunk])({ organizations });
  // @ts-ignore
  callApi.mockReturnValue(callApiResponse);
});

describe('getFeed', () => {
  // @ts-ignore
  const testGetFeed = () => store.dispatch(getFeed(type, orgId));

  describe('Celebration Feed', () => {
    beforeEach(() => {
      type = CELEBRATE;
    });

    describe('org without pagination', () => {
      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({ id: orgId });
        testGetFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CELEBRATE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: 0,
            },
            orgId,
            include:
              'subject_person.organizational_permissions,subject_person.contact_assignments',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([callApiResponse]);
      });
    });

    describe('org with pagination, next page', () => {
      const celebratePagination = { page: 1, hasNextPage: true };

      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({
          id: orgId,
          celebratePagination,
        });
        testGetFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CELEBRATE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: DEFAULT_PAGE_LIMIT * celebratePagination.page,
            },
            orgId,
            include:
              'subject_person.organizational_permissions,subject_person.contact_assignments',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([callApiResponse]);
      });
    });

    describe('org with pagination, no next page', () => {
      const celebratePagination = { page: 1, hasNextPage: false };

      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({
          id: orgId,
          celebratePagination,
        });
        testGetFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('does not call API', () => {
        expect(callApi).not.toHaveBeenCalled();
      });

      it('does not dispatch actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([]);
      });
    });
  });

  describe('Challenge Feed', () => {
    beforeEach(() => {
      type = CHALLENGE;
    });

    describe('org without pagination', () => {
      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({ id: orgId });
        testGetFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CHALLENGE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: 0,
            },
            filters: {
              organization_ids: orgId,
            },
            sort: '-active,-created_at',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([callApiResponse]);
      });
    });

    describe('org with pagination, next page', () => {
      const challengePagination = { page: 1, hasNextPage: true };

      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({
          id: orgId,
          challengePagination,
        });
        testGetFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CHALLENGE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: DEFAULT_PAGE_LIMIT * challengePagination.page,
            },
            filters: {
              organization_ids: orgId,
            },
            sort: '-active,-created_at',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([callApiResponse]);
      });
    });

    describe('org with pagination, no next page', () => {
      const challengePagination = { page: 1, hasNextPage: false };

      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({
          id: orgId,
          challengePagination,
        });
        testGetFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('does not call API', () => {
        expect(callApi).not.toHaveBeenCalled();
      });

      it('does not dispatch actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([]);
      });
    });
  });
});

describe('reloadFeed', () => {
  // @ts-ignore
  const testReloadFeed = () => store.dispatch(reloadFeed(type, orgId));

  describe('Celebration Feed', () => {
    beforeEach(() => {
      type = CELEBRATE;
    });

    describe('org not found', () => {
      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue(undefined);
        testReloadFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('does not call API', () => {
        expect(callApi).not.toHaveBeenCalled();
      });

      it('does not dispatch additional actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([]);
      });
    });

    describe('org without pagination', () => {
      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({ id: orgId });
        testReloadFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(2);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CELEBRATE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: 0,
            },
            orgId,
            include:
              'subject_person.organizational_permissions,subject_person.contact_assignments',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([callApiResponse]);
      });
    });

    describe('org with pagination', () => {
      const celebratePagination = { page: 1, hasNextPage: true };

      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({
          id: orgId,
          celebratePagination,
        });
        testReloadFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(2);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CELEBRATE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: DEFAULT_PAGE_LIMIT * celebratePagination.page,
            },
            orgId,
            include:
              'subject_person.organizational_permissions,subject_person.contact_assignments',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([
          { type: RESET_CELEBRATION_PAGINATION, orgId },
          callApiResponse,
        ]);
      });
    });
  });

  describe('Challenge Feed', () => {
    beforeEach(() => {
      type = CHALLENGE;
    });

    describe('org not found', () => {
      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue(undefined);
        testReloadFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(1);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('does not call API', () => {
        expect(callApi).not.toHaveBeenCalled();
      });

      it('does not dispatch additional actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([]);
      });
    });

    describe('org without pagination', () => {
      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({ id: orgId });
        testReloadFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(2);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CHALLENGE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: 0,
            },
            filters: {
              organization_ids: orgId,
            },
            sort: '-active,-created_at',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([callApiResponse]);
      });
    });

    describe('org with pagination', () => {
      const challengePagination = { page: 1, hasNextPage: true };

      beforeEach(() => {
        // @ts-ignore
        organizationSelector.mockReturnValue({
          id: orgId,
          challengePagination,
        });
        testReloadFeed();
      });

      it('calls organizationSelector', () => {
        expect(organizationSelector).toHaveBeenCalledTimes(2);
        expect(organizationSelector).toHaveBeenCalledWith(
          { organizations },
          { orgId },
        );
      });

      it('calls API to get feed', () => {
        expect(callApi).toHaveBeenCalledWith(
          REQUESTS.GET_GROUP_CHALLENGE_FEED,
          {
            page: {
              limit: DEFAULT_PAGE_LIMIT,
              offset: DEFAULT_PAGE_LIMIT * challengePagination.page,
            },
            filters: {
              organization_ids: orgId,
            },
            sort: '-active,-created_at',
          },
        );
      });

      it('dispatches actions', () => {
        // @ts-ignore
        expect(store.getActions()).toEqual([
          { type: RESET_CHALLENGE_PAGINATION, orgId },
          callApiResponse,
        ]);
      });
    });
  });
});
