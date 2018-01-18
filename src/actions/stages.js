import callApi, { REQUESTS } from './api';

export function getStages() {
  return (dispatch) => {

    return dispatch(callApi(REQUESTS.GET_STAGES));
  };
}

export function getStageById(id) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const stages = getState().stages.stages || [];
      
      const stagesExist = stages.length > 0;
      if (stagesExist) {
        const stage = stages.find((s) => `${s.id}` === `${id}`);
        if (stage) {
          resolve(stage);
          return;
        }
      }

      // Stages either don't exist or that id doesn't match any stage
      dispatch(getStages()).then((results) => {
        const pathwayStages = results.findAll('pathway_stage') || [];
        const pathwayStage = pathwayStages.find((s) => `${s.id}` === `${id}`);
        if (pathwayStage) {
          resolve(pathwayStage);
        } else {
          reject('NoMatchingStage');
        }
      }).catch((error) => {
        reject(error);
      });
    });

  };
}