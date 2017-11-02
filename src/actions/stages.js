import {STAGES} from '../constants';
import axios from 'axios';
import {JsonApiDataStore} from 'jsonapi-datastore';

export function getStages() {
  return (dispatch) => {
    axios.get('https://api-stage.missionhub.com/apis/v4/pathway_stages/')
      .then(result => {
        const jsonApiStore = new JsonApiDataStore();
        jsonApiStore.sync(result.data);

        return dispatch({type: STAGES, payload: jsonApiStore.findAll('pathway_stage')});
      })
      .catch(error => console.log('error getting stages: ' + error));
  };
}