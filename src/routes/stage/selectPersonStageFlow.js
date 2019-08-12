import { createStackNavigator } from 'react-navigation';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { updatePersonAttributes, getPersonDetails } from '../../actions/person';
import { loadStepsAndJourney } from '../../actions/misc';
import { personSelector } from '../../selectors/people';
import SelectPersonStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectPersonStageScreen';
import { PERSON_SELECT_STEP_SCREEN } from '../../containers/PersonSelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddPersonStepFlowScreens } from '../steps/addPersonStepFlow';

export const SelectPersonStageFlowScreens = {
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectPersonStageScreen,
    ({
      stage,
      personId,
      firstName,
      orgId,
      isAlreadySelected,
      contactAssignmentId,
    }) => (dispatch, getState) => {
      const { people } = getState();
      const person = personSelector({ people }, { personId, orgId });

      dispatch(
        contactAssignmentId
          ? updatePersonAttributes(personId, {
              reverse_contact_assignments: person.reverse_contact_assignments.map(
                assignment =>
                  assignment.id === contactAssignmentId
                    ? { ...assignment, pathway_stage_id: stage.id }
                    : assignment,
              ),
            })
          : getPersonDetails(personId, orgId),
      );
      dispatch(loadStepsAndJourney(personId, orgId));

      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { contactId: personId, orgId })
          : navigatePush(PERSON_SELECT_STEP_SCREEN, {
              contactStage: stage,
              contactId: personId,
              organization: { id: orgId },
              contactName: firstName,
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
