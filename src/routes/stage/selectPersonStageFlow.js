import { createStackNavigator, StackActions } from 'react-navigation';

import { wrapNextAction, wrapNextScreen } from '../helpers';
import { buildTrackingObj } from '../../utils/common';
import { navigatePush } from '../../actions/navigation';
import { reloadJourney } from '../../actions/journey';
import { loadStepsAndJourney } from '../../actions/misc';
import { updatePersonAttributes, getPersonDetails } from '../../actions/person';
import { personSelector } from '../../selectors/people';
import PersonStageScreen, {
  PERSON_STAGE_SCREEN,
} from '../../containers/PersonStageScreen';
import PersonSelectStepScreen, {
  PERSON_SELECT_STEP_SCREEN,
} from '../../containers/PersonSelectStepScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../../containers/CelebrationScreen';

export const SelectPersonStageFlowScreens = onFlowComplete => ({
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

      contactAssignmentId
        ? dispatch(
            updatePersonAttributes(contactId, {
              reverse_contact_assignments: person.reverse_contact_assignments.map(
                assignment =>
                  assignment.id === contactAssignmentId
                    ? { ...assignment, pathway_stage_id: stage.id }
                    : assignment,
              ),
            }),
          )
        : dispatch(getPersonDetails(contactId, orgId));
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
  [PERSON_SELECT_STEP_SCREEN]: wrapNextScreen(
    PersonSelectStepScreen,
    CELEBRATION_SCREEN,
  ),
  [CELEBRATION_SCREEN]: wrapNextAction(
    CelebrationScreen,
    ({ contactId, orgId }) => dispatch => {
      dispatch(reloadJourney(contactId, orgId));
      dispatch(StackActions.popToTop());

      dispatch(StackActions.pop({ immediate: true }));
      onFlowComplete && dispatch(onFlowComplete());
    },
  ),
});

export const SelectPersonStageFlowNavigator = createStackNavigator(
  SelectPersonStageFlowScreens(),
  {
    navigationOptions: {
      header: null,
    },
  },
);
