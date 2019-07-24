import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

import { selectMyStage } from '../actions/selectStage';
import { SELF_VIEWED_STAGE_CHANGED } from '../constants';

import PathwayStageScreen from './PathwayStageScreen';

interface SelectMyStageScreenProps {
  dispatch: ThunkDispatch<any, null, never>;
  next: (props?: {
    stage: any;
    contactId: string;
    orgId?: string;
    isAlreadySelected: boolean;
  }) => ThunkAction<void, any, null, never>; // TODO: make next required when only used in flows
  orgId?: string;
  questionText?: string;
  firstItem?: number;
  section: string;
  subsection: string;
  enableBackButton?: boolean;
  firstName: string;
  contactId: string;
}

const SelectMyStageScreen = ({
  dispatch,
  next,
  orgId,
  questionText,
  firstItem = 0,
  section,
  subsection,
  enableBackButton = false,
  firstName,
  contactId,
}: SelectMyStageScreenProps) => {
  const { t } = useTranslation('selectStage');

  const handleScrollToStage = (trackingObj: any) => {
    dispatch({
      type: SELF_VIEWED_STAGE_CHANGED,
      newActiveTab: trackingObj,
    });
  };

  const handleSelectStage = async (
    stage: any,
    isAlreadySelected: boolean = false,
  ) => {
    !isAlreadySelected && (await dispatch(selectMyStage(stage.id)));

    dispatch(next({ stage, contactId, orgId, isAlreadySelected }));
  };

  return (
    <PathwayStageScreen
      buttonText={t('iAmHere').toUpperCase()}
      activeButtonText={t('stillHere').toUpperCase()}
      questionText={questionText || t('meQuestion', { name: firstName })}
      onSelect={handleSelectStage}
      onScrollToStage={handleScrollToStage}
      firstItem={firstItem}
      section={section}
      subsection={subsection}
      enableBackButton={enableBackButton}
      isSelf={true}
    />
  );
};

const mapStateToProps = (
  {
    auth,
    profile,
  }: {
    auth: AuthState;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any},
    profile: any;
  },
  {
    navigation: {
      state: {
        params: {
          orgId,
          questionText,
          firstItem,
          section,
          subsection,
          enableBackButton,
        },
      },
    },
    next,
  },
) => ({
  next,
  orgId,
  questionText,
  firstItem,
  section,
  subsection,
  enableBackButton,
  firstName: profile.firstName,
  contactId: auth.person.id,
});

export default connect(mapStateToProps)(SelectMyStageScreen);
export const SELECT_MY_STAGE_SCREEN = 'nav/SELECT_MY_STAGE';
