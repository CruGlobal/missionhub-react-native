import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';

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
import { trackAction, trackState } from '../../actions/analytics';
import { buildTrackingObj } from '../../utils/common';
import { ACTIONS } from '../../constants';
import { useDisableBack } from '../../utils/hooks/useDisableBack';

import styles, {
  sliderWidth,
  stageWidth,
  stageMargin,
  overScrollMargin,
  getLandscapeWidth,
} from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

interface PathwayStageScreenProps {
  dispatch: ThunkDispatch<any, null, never>;
  onSelect: (stage: any, isAlreadySelected: boolean) => Promise<void>;
  onScrollToStage: (props?: any) => void;
  section: string;
  subsection: string;
  questionText: string;
  buttonText: string;
  activeButtonText: string;
  firstItem?: number;
  enableBackButton: boolean;
  isSelf: boolean;
  stages: any;
}

const PathwayStageScreen = ({
  dispatch,
  onSelect,
  onScrollToStage,
  section,
  subsection,
  questionText,
  buttonText,
  activeButtonText,
  firstItem = -1,
  enableBackButton,
  isSelf,
  stages,
}: PathwayStageScreenProps) => {
  const enableBack: false | (() => void) =
    !enableBackButton && useDisableBack();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    async function loadStagesAndScrollToId() {
      console.log('here');
      await loadStages();
      console.log('there');
      handleSnapToItem(firstItem);
    }

    loadStagesAndScrollToId();

    jest.mock('../../../actions/analytics');
  }, []);

  const loadStages = dispatch(getStages());

  const setStage = (stage: any, isAlreadySelected: boolean) => {
    enableBack && enableBack();

    onSelect(stage, isAlreadySelected);

    const action: any = isSelf
      ? ACTIONS.SELF_STAGE_SELECTED
      : ACTIONS.PERSON_STAGE_SELECTED;

    dispatch(
      trackAction(action.name, {
        [action.key]: stage.id,
        [ACTIONS.STAGE_SELECTED.key]: null,
      }),
    );
  };

  const handleScroll = (e: any) =>
    setScrollPosition(e.nativeEvent.contentOffset.x);

  const handleSnapToItem = (index: number) => {
    if (stages[index]) {
      const trackingObj = buildTrackingObj(
        `${section} : ${subsection} : stage : ${stages[index].id}`,
        section,
        subsection,
        'stage',
      );

      onScrollToStage(trackingObj);
      dispatch(trackState(trackingObj));
    }
  };

  const renderStage = ({ item, index }: { item: any; index: number }) => {
    const isActive = firstItem === index;
    const handlePress = () => setStage(item, isActive);

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
          testID={`StageButton${index}`}
          type="primary"
          onPress={handlePress}
          text={isActive ? activeButtonText : buttonText}
        />
      </View>
    );
  };

  const leftMargin = scrollPosition / -1 - overScrollMargin;

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
      <Text style={styles.title}>{questionText}</Text>
      {stages ? (
        <Carousel
          firstItem={firstItem}
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

const mapStateToProps = ({ stages }: { stages: any }) => ({
  stages: stages.stages,
});

export default connect(mapStateToProps)(PathwayStageScreen);
