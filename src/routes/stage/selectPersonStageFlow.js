import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { updatePersonAttributes, getPersonDetails } from '../../actions/person';
import { loadStepsAndJourney } from '../../actions/misc';
import { personSelector } from '../../selectors/people';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddPersonStepFlowScreens } from '../steps/addPersonStepFlow';

export const SelectPersonStageFlowScreens = {
  [PERSON_STAGE_SCREEN]: wrapNextAction(
    PersonStageScreen,
    ({
      stage,
      contactId,
      name,
      orgId,
      isAlreadySelected,
      contactAssignmentId,
    }) => (dispatch, getState) => {
      const { people } = getState();
      const person = personSelector({ people }, { personId: contactId, orgId });

      dispatch(
        contactAssignmentId
          ? updatePersonAttributes(contactId, {
              reverse_contact_assignments: person.reverse_contact_assignments.map(
                assignment =>
                  assignment.id === contactAssignmentId
                    ? { ...assignment, pathway_stage_id: stage.id }
                    : assignment,
              ),
            })
          : getPersonDetails(contactId, orgId),
      );
      dispatch(loadStepsAndJourney(contactId, orgId));

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
    defaultNavigationOptions: {
      header: null,
    },
  },
);
