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

const callApiResponse = { type: 'call API', response: stages.stages };

beforeEach(() => {
  (callApi as jest.Mock).mockReturnValue(callApiResponse);
});

describe('getStagesIfNotExists', () => {
  it('dispatches update action if stages exist', () => {
    store = mockStore({ stages });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store.dispatch<any>(getStagesIfNotExists());

    expect(store.getActions()).toEqual([
      { type: UPDATE_STAGES, stages: stages.stages },
    ]);
  });

  it('gets stages if stages exist', async () => {
    store = mockStore({ stages: emptyStages });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await store.dispatch<any>(getStagesIfNotExists());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_STAGES, {
      include: 'localized_pathway_stages',
    });
    expect(store.getActions()).toEqual([callApiResponse]);
    expect(result).toEqual(callApiResponse);
  });
});

describe('getStages', () => {
  it('gets stages', async () => {
    store = mockStore({ stages });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await store.dispatch<any>(getStages());

    expect(callApi).toHaveBeenCalledWith(REQUESTS.GET_STAGES, {
      include: 'localized_pathway_stages',
    });
    expect(store.getActions()).toEqual([callApiResponse]);
    expect(result).toEqual(callApiResponse);
  });
});
