import {STAGES} from '../constants';
import axios from 'axios';

export function getStages() {
  return (dispatch) => {
    axios.get('https://api-stage.missionhub.com/apis/v4/pathway_stages/')
      .then(result => dispatch({type: STAGES, payload: result.data.data}))
      .catch(() => console.log('error getting stages'));
  };
}