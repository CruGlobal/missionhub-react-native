import { createStackNavigator } from 'react-navigation-stack';

import { wrapNextAction } from '../helpers';
import { navigatePush } from '../../actions/navigation';
import { updatePersonAttributes, getPersonDetails } from '../../actions/person';
import { reloadJourney } from '../../actions/journey';
import { personSelector } from '../../selectors/people';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';
import { SELECT_STEP_SCREEN } from '../../containers/SelectStepScreen';
import { CELEBRATION_SCREEN } from '../../containers/CelebrationScreen';
import { AddPersonStepFlowScreens } from '../steps/addPersonStepFlow';

export const SelectPersonStageFlowScreens = {
  [SELECT_STAGE_SCREEN]: wrapNextAction(
    SelectStageScreen,
    ({ stage, personId, orgId, isAlreadySelected, contactAssignmentId }) => (
      dispatch,
      getState,
    ) => {
      const { people } = getState();
      const person = personSelector({ people }, { personId });

      dispatch(
        // @ts-ignore
        contactAssignmentId
          ? updatePersonAttributes(personId, {
              reverse_contact_assignments: person.reverse_contact_assignments.map(
                // @ts-ignore
                assignment =>
                  assignment.id === contactAssignmentId
                    ? { ...assignment, pathway_stage_id: stage.id }
                    : assignment,
              ),
            })
          : getPersonDetails(personId, orgId),
      );
      dispatch(reloadJourney(personId, orgId));

      dispatch(
        isAlreadySelected
          ? navigatePush(CELEBRATION_SCREEN, { personId, orgId })
          : navigatePush(SELECT_STEP_SCREEN, {
              personId,
              orgId,
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
