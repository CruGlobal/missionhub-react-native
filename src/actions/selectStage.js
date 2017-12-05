import {REQUESTS} from './api';
import callApi from './api';

export function selectStage(id) {
  const data = {
    data: {
      attributes: {
        pathway_stage_id: id,
      },
    },
  };

  return (dispatch) => {
    return dispatch(callApi(REQUESTS.UPDATE_MY_USER, {}, data)).catch((error) => {
      LOG('error updating user', error);
    });
  };
}