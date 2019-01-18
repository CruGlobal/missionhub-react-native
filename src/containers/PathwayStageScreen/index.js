import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Keyboard } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';

import { Flex, Text, Button } from '../../components/common';
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
import { buildTrackingObj, disableBack } from '../../utils/common';
import { ACTIONS } from '../../constants';

import styles, {
  sliderWidth,
  stageWidth,
  stageMargin,
  overScrollMargin,
  getLandscapeWidth,
} from './styles';

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING, NOTSURE];

const fallbackIndex = 0;

class PathwayStageScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollPosition: 0,
    };

    this.renderStage = this.renderStage.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleSnapToItem = this.handleSnapToItem.bind(this);
  }

  async componentWillMount() {
    await this.props.dispatch(getStages());

    const initialIndex = this.props.firstItem
      ? this.props.firstItem
      : fallbackIndex;
    this.trackStageState(this.props.stages[initialIndex].id);
    Keyboard.dismiss();
  }

  componentDidMount() {
    if (!this.props.enableBackButton) {
      disableBack.add();
    }
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  setStage = (stage, isAlreadySelected) => {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
    this.props.onSelect(stage, isAlreadySelected);

    const action = this.props.isSelf
      ? ACTIONS.SELF_STAGE_SELECTED
      : ACTIONS.PERSON_STAGE_SELECTED;
    this.props.dispatch(
      trackAction(action.name, {
        [action.key]: stage.id,
        [ACTIONS.STAGE_SELECTED.key]: null,
      }),
    );
  };

  handleScroll(e) {
    this.setState({ scrollPosition: e.nativeEvent.contentOffset.x });
  }

  handleSnapToItem(index) {
    this.trackStageState(this.props.stages[index].id);
  }

  trackStageState(number) {
    const { section, subsection, dispatch, onScrollToStage } = this.props;
    const trackingObj = buildTrackingObj(
      `${section} : ${subsection} : stage : ${number}`,
      section,
      subsection,
      'stage',
    );

    onScrollToStage(trackingObj);
    dispatch(trackState(trackingObj));
  }

  renderStage({ item, index }) {
    const { firstItem, activeButtonText, buttonText } = this.props;
    const isActive = firstItem >= 0 && firstItem === index;
    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={stageIcons[index]} />
          <Text type="header" style={styles.cardHeader}>
            {item.name.toLowerCase()}
          </Text>
          <Text style={styles.cardText}>{item.description}</Text>
        </View>
        <Button
          type="primary"
          pressProps={[item, isActive]}
          onPress={this.setStage}
          text={isActive && activeButtonText ? activeButtonText : buttonText}
        />
      </View>
    );
  }

  render() {
    const { enableBackButton, questionText, stages, firstItem } = this.props;
    const leftMargin = this.state.scrollPosition / -1 - overScrollMargin;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
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
            firstItem={firstItem || fallbackIndex}
            data={stages}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            renderItem={this.renderStage}
            sliderWidth={sliderWidth + 75}
            itemWidth={stageWidth + stageMargin * 2}
            onScroll={this.handleScroll}
            scrollEventThrottle={5}
            onSnapToItem={this.handleSnapToItem}
            containerCustomStyle={{ height: 400, flex: 0, flexGrow: 0 }}
          />
        ) : null}
      </Flex>
    );
  }
}

PathwayStageScreen.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onScrollToStage: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  subsection: PropTypes.string.isRequired,
  questionText: PropTypes.string,
  buttonText: PropTypes.string,
  activeButtonText: PropTypes.string,
  firstItem: PropTypes.number,
  enableBackButton: PropTypes.bool,
  isSelf: PropTypes.bool,
};

const mapStateToProps = ({ stages }) => ({
  stages: stages.stages,
});

export default connect(mapStateToProps)(PathwayStageScreen);
