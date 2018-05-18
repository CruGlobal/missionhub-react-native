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
import { getStages } from '../../actions/stages';
import theme from '../../theme';
import { trackAction, trackState } from '../../actions/analytics';
import { buildTrackingObj, disableBack } from '../../utils/common';
import { ACTIONS } from '../../constants';

import styles from './styles';

const screenMargin = 60;
const sliderWidth = theme.fullWidth;
const stageWidth = theme.fullWidth - screenMargin * 2;
const stageMargin = theme.fullWidth / 30;
const overScrollMargin = 120;

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING];

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

  setStage(stage, isAlreadySelected) {
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
  }

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
    const isActive = firstItem && firstItem === index;
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
          onPress={() => this.setStage(item, isActive, index)}
          text={isActive && activeButtonText ? activeButtonText : buttonText}
        />
      </View>
    );
  }

  render() {
    let leftMargin = this.state.scrollPosition / -1 - overScrollMargin;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        {this.props.enableBackButton ? <BackButton absolute={true} /> : null}
        <Text style={styles.title}>{this.props.questionText}</Text>
        {this.props.stages ? (
          <Carousel
            firstItem={this.props.firstItem || fallbackIndex}
            data={this.props.stages}
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
        <Image
          resizeMode="contain"
          source={LANDSCAPE}
          style={[styles.footerImage, { left: leftMargin }]}
        />
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
