import React, { useState, useEffect, useCallback } from 'react';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
import { useNavigationState } from 'react-navigation-hooks';
import Carousel from 'react-native-snap-carousel';

import { Text, Button } from '../../components/common';
import BackButton from '../BackButton';
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
import { trackAction, trackState } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import {
  ACTIONS,
  SELF_VIEWED_STAGE_CHANGED,
  PERSON_VIEWED_STAGE_CHANGED,
} from '../../constants';
import { useDisableBack } from '../../utils/hooks/useDisableBack';
import { AuthState } from '../../reducers/auth';
import { Stage, StagesState } from '../../reducers/stages';
import { PeopleState } from '../../reducers/people';
import {
  personSelector,
  contactAssignmentSelector,
} from '../../selectors/people';

import styles, {
  sliderWidth,
  stageWidth,
  stageMargin,
  overScrollMargin,
  getLandscapeWidth,
} from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface SelectStageScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
  next: (props?: {
    stage: Stage;
    firstName: string;
    personId: string;
    contactAssignmentId: string;
    orgId?: string;
    isAlreadySelected: boolean;
    isMe: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) => ThunkAction<void, any, {}, never>; // TODO: make next required when only used in flows
  myId: string;
  firstName: string;
  contactAssignmentId: string;
  isMe: boolean;
  stages: Stage;
  testID?: string;
}

interface SelectStageNavParams {
  selectedStageId?: number;
  enableBackButton: boolean;
  personId: string;
  orgId?: string;
  section: string;
  subsection: string;
  questionText?: string;
}

const SelectStageScreen = ({
  dispatch,
  next,
  myId,
  firstName,
  contactAssignmentId,
  isMe,
  stages,
}: SelectStageScreenProps) => {
  const {
    selectedStageId,
    enableBackButton = true,
    personId,
    orgId,
    section,
    subsection,
    questionText,
  } = useNavigationState().params as SelectStageNavParams;

  const enableBack = useDisableBack(enableBackButton);
  const { t } = useTranslation('selectStage');
  const [scrollPosition, setScrollPosition] = useState(0);

  const startIndex = selectedStageId || 0;

  const loadStages = useCallback(() => dispatch(getStages()), [dispatch]);

  const handleSnapToItem = useCallback(
    (index: number) => {
      if (stages[index]) {
        const trackingObj = buildTrackingObj(
          `${section} : ${subsection} : stage : ${stages[index].id}`,
          section,
          subsection,
          'stage',
        );

        dispatch({
          type: isMe ? SELF_VIEWED_STAGE_CHANGED : PERSON_VIEWED_STAGE_CHANGED,
          newActiveTab: trackingObj,
        });
        dispatch(trackState(trackingObj));
      }
    },
    [dispatch, stages, section, subsection, isMe],
  );

  useEffect(() => {
    async function loadStagesAndScrollToId() {
      await loadStages();
      handleSnapToItem(startIndex);
    }

    loadStagesAndScrollToId();
  }, [dispatch, loadStages, handleSnapToItem, startIndex]);

  const setStage = async (stage: Stage, isAlreadySelected: boolean) => {
    enableBack();

    !isAlreadySelected &&
      (await dispatch(
        isMe
          ? selectMyStage(stage.id)
          : contactAssignmentId
          ? updateUserStage(contactAssignmentId, stage.id)
          : selectPersonStage(personId, myId, stage.id, orgId),
      ));

    dispatch(
      next({
        stage,
        firstName,
        personId,
        contactAssignmentId,
        orgId,
        isAlreadySelected,
        isMe,
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action: any = isMe
      ? ACTIONS.SELF_STAGE_SELECTED
      : ACTIONS.PERSON_STAGE_SELECTED;

    dispatch(
      trackAction(action.name, {
        [action.key]: stage.id,
        [ACTIONS.STAGE_SELECTED.key]: null,
      }),
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = (e: any) =>
    setScrollPosition(e.nativeEvent.contentOffset.x);

  const renderStage = ({ item, index }: { item: Stage; index: number }) => {
    const isActive = selectedStageId === index;

    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={stageIcons[index]} />
          <Text header={true} style={styles.cardHeader}>
            {item.name.toLowerCase()}
          </Text>
          <Text style={styles.cardText}>{item.description}</Text>
        </View>
        <Button
          testID={'stageSelectButton'}
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
    t(isMe ? 'meQuestion' : 'personQuestion', { name: firstName });

  return (
    <View style={styles.container}>
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
      {enableBackButton ? <BackButton absolute={true} /> : null}
      <Text style={styles.title}>{headerText}</Text>
      {stages ? (
        <Carousel
          firstItem={startIndex}
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
  );
};

const mapStateToProps = (
  {
    auth,
    people,
    stages,
  }: { auth: AuthState; people: PeopleState; stages: StagesState },
  {
    navigation: {
      state: {
        params: { personId, orgId },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
  const myId = auth.person.id;
  const person = personSelector({ people }, { personId, orgId }) || {};
  const contactAssignment =
    contactAssignmentSelector({ auth }, { person, orgId }) || {};
  console.log(person);
  return {
    myId,
    firstName: person.first_name,
    contactAssignmentId: contactAssignment.id,
    isMe: personId === myId,
    stages: stages.stages,
  };
};

export default connect(mapStateToProps)(SelectStageScreen);
export const SELECT_STAGE_SCREEN = 'nav/Select_STAGE';
