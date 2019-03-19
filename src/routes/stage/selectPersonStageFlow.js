import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddPersonStepFlowScreens } from '../steps/addPersonStepFlow';

export const SelectPersonStageFlowScreens = {
  [PERSON_STAGE_SCREEN]: wrapNextAction(
    PersonStageScreen,
    ({ stage, contactId, name, orgId, isAlreadySelected }) => dispatch => {
      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId, orgId })
          : navigatePush(PERSON_SELECT_STEP_SCREEN, {
              contactStage: stage,
              contactId,
              organization: { id: orgId },
              contactName: name,
              createStepTracking: buildTrackingObj(
                'people : person : steps : create',
                'people',
                'person',
                'steps',
              ),
            }),
      );
    },
  ),
  ...AddPersonStepFlowScreens,
};

export const SelectPersonStageFlowNavigator = createStackNavigator(
  SelectPersonStageFlowScreens,
  {
    navigationOptions: {
      header: null,
    },
  },
);
