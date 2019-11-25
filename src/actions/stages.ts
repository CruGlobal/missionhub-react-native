import i18next from 'i18next';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { UPDATE_STAGES } from '../constants';
import { REQUESTS } from '../api/routes';
import { StagesState } from '../reducers/stages';

import callApi from './api';

export function getStagesIfNotExists() {
  return (
    dispatch: ThunkDispatch<{}, {}, AnyAction>,
    getState: () => { stages: StagesState },
  ) => {
    const { stages } = getState().stages;

    const localeNotChanged =
      stages && stages[0] && i18next.language === stages[0].locale;

    if (localeNotChanged) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (dispatch: ThunkDispatch<{}, {}, any>) => {
    return dispatch(
      callApi(REQUESTS.GET_STAGES, {
        include: 'localized_pathway_stages',
      }),
    );
  };
}
