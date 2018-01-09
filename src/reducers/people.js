import { REHYDRATE } from 'redux-persist/constants';

import { REQUESTS } from '../actions/api';
import { LOGOUT } from '../constants';
import { useFirstExists } from '../utils/common';

const initialState = {
  all: [],
  allByOrg: [],
};

function peopleReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.people;
      if (incoming) {
        return {
          all: useFirstExists(incoming.all, state.all),
          allByOrg: useFirstExists(incoming.allByOrg, state.allByOrg),
        };
      }
      return state;
    case REQUESTS.GET_PEOPLE_LIST.SUCCESS:
      const people = action.results.findAll('person') || [];
      // let peopleByOrg = people.reduce((p, n) => {
      //   const orgId = n.organization_id;
      //   if (p[orgId]) {
      //     p[orgId].data.push(n);
      //   } else {
      //     p[orgId] = { key: orgId, data: [n] };
      //   }
      // }, {});
      // peopleByOrg = Object.keys(peopleByOrg).map((key) => peopleByOrg[key]);
      return {
        ...state,
        all: people,
        // allByOrg: peopleByOrg,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export default peopleReducer;