import { REQUESTS } from '../api/routes';
import { LOGOUT, LogoutAction } from '../constants';

export interface LocalizedPathwayStage {
  locale: string;
  name: string;
  description: string;
  self_followup_description: string;
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  self_followup_description: string;
  position: number;
  icon_url: string;
  localized_pathway_stages: LocalizedPathwayStage[];
}

export type StagesObj = Record<string, Stage>;

export interface StagesState {
  stages: Stage[];
  stagesObj?: StagesObj;
}

const initialStagesState: StagesState = {
  stages: [],
  stagesObj: undefined,
};

function stagesReducer(
  state = initialStagesState,
  action:
    | {
        type: typeof REQUESTS.GET_STAGES.SUCCESS;
        results: { response: Stage[] };
      }
    | LogoutAction,
) {
  switch (action.type) {
    case REQUESTS.GET_STAGES.SUCCESS: {
      const stages = action.results.response as Stage[];
      const stagesObj = stages.reduce(
        (stagesObj, stage) => ({
          ...stagesObj,
          [stage.id]: stage,
        }),
        {},
      );
      return {
        ...state,
        stages,
        stagesObj,
      };
    }
    case LOGOUT:
      return initialStagesState;
    default:
      return state;
  }
}

export default stagesReducer;
