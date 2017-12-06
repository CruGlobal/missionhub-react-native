import callApi, { REQUESTS } from './api';


export function getPeopleList() {
  return (dispatch) => {
    const query = {
      // filters: {}
    };
    return dispatch(callApi(REQUESTS.GET_PEOPLE_LIST, query));
  };
}