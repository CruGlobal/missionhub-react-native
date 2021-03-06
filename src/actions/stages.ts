import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UPDATE_STAGES } from '../constants';
import { REQUESTS } from '../api/routes';
import { StagesState, Stage } from '../reducers/stages';
import { RootState } from '../reducers';

import callApi from './api';

export function getStagesIfNotExists() {
  return (
    dispatch: ThunkDispatch<RootState, never, AnyAction>,
    getState: () => { stages: StagesState },
  ) => {
    const { stages } = getState().stages;

    if (stages && stages[0]) {
      dispatch({
        type: UPDATE_STAGES,
        stages,
      });
      return Promise.resolve();
    }
    return dispatch(getStages());
  };
}

export function getStages() {
  return async (dispatch: ThunkDispatch<RootState, never, AnyAction>) => {
    return ((await dispatch(
      callApi(REQUESTS.GET_STAGES, {
        include: 'localized_pathway_stages',
      }),
    )) as unknown) as { response: Stage[] };
  };
}
