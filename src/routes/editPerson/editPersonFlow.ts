import { createStackNavigator } from 'react-navigation-stack';

import { navigateBack, navigatePush } from '../../actions/navigation';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
  PersonType,
} from '../../containers/AddContactScreen';
import { GetPerson_person_stage as StageType } from '../../containers/AddContactScreen/__generated__/GetPerson';
import { buildTrackedScreen, wrapNextAction } from '../helpers';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from '../../containers/SelectStageScreen';

export const EditPersonFlowScreens = {
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    wrapNextAction(
      AddContactScreen,
      ({
        orgId,
        navigateToStageSelection,
        person,
        updatePerson,
      }: {
        orgId: string;
        navigateToStageSelection: boolean;
        person: PersonType;
        updatePerson: (person: PersonType) => void;
      }) => dispatch => {
        if (navigateToStageSelection) {
          dispatch(
            navigatePush(SELECT_STAGE_SCREEN, {
              enableBackButton: false,
              personId: person.id,
              section: 'people',
              subsection: 'person',
              orgId,
              onComplete: (stage: StageType) => {
                updatePerson({ ...person, stage });
              },
            }),
          );
        } else {
          dispatch(navigateBack());
        }
      },
    ),
  ),
  [SELECT_STAGE_SCREEN]: buildTrackedScreen(
    wrapNextAction(SelectStageScreen, () => dispatch => {
      dispatch(navigateBack());
    }),
  ),
};

export const EditPersonFlowNavigator = createStackNavigator(
  EditPersonFlowScreens,
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);
