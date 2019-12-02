import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import i18next from 'i18next';

import { getStagesIfNotExists, getStages } from '../stages';
import { UPDATE_STAGES } from '../../constants';
import { REQUESTS } from '../../api/routes';
import callApi from '../api';

jest.mock('../api');

const locale = 'en_TEST';
i18next.language = locale;

const mockStore = configureStore([thunk]);
let store;

const stage = { id: '1', name: 'Name', locale };

const stages = {
  stages: [stage],
  stagesObj: { [stage.id]: stage },
};
const emptyStages = {
  stages: [],
  stagesObj: null,
};

const callApiResponse = { type: 'call API' };

beforeEach(() => {
  callApi.mockReturnValue(callApiResponse);
});

describe('getStagesIfNotExists', () => {
  it('dispatches update action if stages exist', () => {
    store = mockStore({ stages });

    store.dispatch(getStagesIfNotExists());

    expect(store.getActions()).toEqual([
      { type: UPDATE_STAGES, stages: stages.stages },
    ]);
  });

  it('gets stages if stages exist', () => {
    store = mockStore({ stages: emptyStages });

    store.dispatch(getStagesIfNotExists());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_STAGES, {
      include: 'localized_pathway_stages',
    });
    expect(store.getActions()).toEqual([callApiResponse]);
  });
});

describe('getStages', () => {
  it('gets stages', () => {
    store = mockStore({ stages });

    store.dispatch(getStages());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_STAGES, {
      include: 'localized_pathway_stages',
    });
    expect(store.getActions()).toEqual([callApiResponse]);
  });
});
