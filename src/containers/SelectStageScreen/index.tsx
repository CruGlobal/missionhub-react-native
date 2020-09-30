import React, { useState, useCallback } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux-legacy';
import { useDispatch } from 'react-redux';
import {
  View,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
} from 'react-native';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigationState, useFocusEffect } from 'react-navigation-hooks';
import Carousel from 'react-native-snap-carousel';

import { Button } from '../../components/common';
import DeprecatedBackButton from '../DeprecatedBackButton';
import LANDSCAPE from '../../../assets/images/landscapeStagesImage.png';
import UNINTERESTED from '../../../assets/images/uninterestedIcon.png';
import CURIOUS from '../../../assets/images/curiousIcon.png';
import FORGIVEN from '../../../assets/images/forgivenIcon.png';
import GROWING from '../../../assets/images/growingIcon.png';
import GUIDING from '../../../assets/images/guidingIcon.png';
import NOTSURE from '../../../assets/images/notsureIcon.png';
import { getStages } from '../../actions/stages';
import {
  selectMyStage,
  selectPersonStage,
  updateUserStage,
} from '../../actions/selectStage';
import { trackAction } from '../../actions/analytics';
import { updatePersonGQL } from '../../actions/person';
import { ACTIONS } from '../../constants';
import { useAndroidBackButton } from '../../utils/hooks/useAndroidBackButton';
import { Stage } from '../../reducers/stages';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../selectors/people';
import { localizedStageSelector } from '../../selectors/stages';
import Header from '../../components/Header';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { RootState } from '../../reducers';
import { useMyId, useIsMe } from '../../utils/hooks/useIsMe';
import { useAuthPerson } from '../../auth/authHooks';
import { loadAuthPerson } from '../../auth/authUtilities';

import styles, {
  sliderWidth,
  stageWidth,
  stageMargin,
  overScrollMargin,
  getLandscapeWidth,
} from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

export interface SelectStageScreenProps {
  next: (props: {
    isMe: boolean;
    personId: string;
    stage: Stage;
    isAlreadySelected: boolean;
    skipSelectSteps?: boolean;
    orgId?: string;
  }) => ThunkAction<void, RootState, never, AnyAction>;
  personFirstName: string;
  contactAssignmentId?: string;
  stages: Stage[];
  testID?: string;
}

export interface SelectStageNavParams {
  selectedStageId?: number;
  enableBackButton: boolean;
  skipSelectSteps?: boolean;
  personId: string;
  orgId?: string;
  questionText?: string;
  onComplete?: (stage: Stage) => void;
}

const SelectStageScreen = ({
  next,
  personFirstName,
  contactAssignmentId,
  stages,
}: SelectStageScreenProps) => {
  const {
    selectedStageId,
    enableBackButton = true,
    personId,
    orgId,
    questionText,
    onComplete,
    skipSelectSteps,
  } = useNavigationState().params as SelectStageNavParams;
  const dispatch = useDispatch<ThunkDispatch<RootState, never, AnyAction>>();
  useAndroidBackButton(enableBackButton);
  const { t } = useTranslation('selectStage');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [stageIndex, setStageIndex] = useState(selectedStageId || 0);

  const authPerson = useAuthPerson();
  const myId = useMyId();
  const isMe = useIsMe(personId);

  const handleScreenChange = useAnalytics('', {
    sectionType: true,
    assignmentType: { personId },
    editMode: { isEdit: !!selectedStageId },
    triggerTracking: false,
  });

  const handleSnapToItem = (index: number) => setStageIndex(index);

  const trackPanelChange = async () => {
    const stage =
      stages[stageIndex] || (await dispatch(getStages())).response[stageIndex];

    stage && handleScreenChange(['stage', stage.name.toLowerCase()]);
  };

  useFocusEffect(
    useCallback(() => {
      trackPanelChange();
    }, [stageIndex]),
  );
  const setStage = async (stage: Stage, isAlreadySelected: boolean) => {
    if (!isAlreadySelected) {
      await dispatch(
        isMe
          ? selectMyStage(stage.id)
          : contactAssignmentId
          ? updateUserStage(contactAssignmentId, stage.id)
          : selectPersonStage(personId, myId, stage.id, orgId),
      );
      isMe && (await loadAuthPerson('network-only'));
      updatePersonGQL(personId);
    }

    if (onComplete) {
      onComplete(stage);
    }

    dispatch(
      next({
        isMe,
        personId,
        stage,
        isAlreadySelected,
        orgId,
        skipSelectSteps,
      }),
    );

    const action = isMe
      ? ACTIONS.SELF_STAGE_SELECTED
      : ACTIONS.PERSON_STAGE_SELECTED;

    dispatch(
      trackAction(action.name, {
        [action.key]: stage.id,
        [ACTIONS.STAGE_SELECTED.key]: null,
      }),
    );
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setScrollPosition(e.nativeEvent.contentOffset.x);

  const renderStage = ({ item, index }: { item: Stage; index: number }) => {
    const isActive = selectedStageId === index;
    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={stageIcons[index]} />
          <Text style={styles.cardHeader}>
            {localizedStageSelector(item, i18next.language).name.toLowerCase()}
          </Text>
          <Text style={styles.cardText}>
            {localizedStageSelector(item, i18next.language).description}
          </Text>
        </View>
        <Button
          testID="stageSelectButton"
          type="primary"
          onPress={() => setStage(item, isActive)}
          text={isActive ? activeButtonText : buttonText}
        />
      </View>
    );
  };

  const leftMargin = scrollPosition / -1 - overScrollMargin;

  const buttonText = t(isMe ? 'iAmHere' : 'here').toUpperCase();
  const activeButtonText = t('stillHere').toUpperCase();
  const headerText =
    questionText ||
    t(isMe ? 'meQuestion' : 'personQuestion', {
      name: isMe ? authPerson.firstName : personFirstName,
    });

  return (
    <View style={styles.backgroundWrapper}>
      <Image
        source={LANDSCAPE}
        style={[
          styles.footerImage,
          {
            left: leftMargin,
            width: getLandscapeWidth((stages || []).length),
          },
        ]}
      />
      <View style={styles.container}>
        <Header left={enableBackButton ? <DeprecatedBackButton /> : null} />
        <View style={styles.content}>
          <Text style={styles.title}>{headerText}</Text>
          {stages ? (
            <Carousel
              firstItem={stageIndex}
              data={stages}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              renderItem={renderStage}
              sliderWidth={sliderWidth + 75}
              itemWidth={stageWidth + stageMargin * 2}
              onScroll={handleScroll}
              scrollEventThrottle={5}
              onSnapToItem={handleSnapToItem}
              removeClippedSubviews={false}
              containerCustomStyle={{ height: 400, flex: 0, flexGrow: 0 }}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (
  state: RootState,
  {
    navigation: {
      state: {
        params: { personId, onComplete },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const person = personSelector(state, { personId }) || {};
  const contactAssignment = contactAssignmentSelector({ person }) || {};

  return {
    personFirstName: person.first_name,
    contactAssignmentId: contactAssignment.id,
    onComplete,
    stages: state.stages.stages,
  };
};

export default connect(mapStateToProps)(SelectStageScreen);
export const SELECT_STAGE_SCREEN = 'nav/SELECT_STAGE';
