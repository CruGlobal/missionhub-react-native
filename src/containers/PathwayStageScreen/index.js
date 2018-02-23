import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Keyboard } from 'react-native';
import { getStages } from '../../actions/stages';

import Carousel from 'react-native-snap-carousel';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';
import LANDSCAPE from '../../../assets/images/landscape.png';
import UNINTERESTED from '../../../assets/images/uninterestedIcon.png';
import CURIOUS from '../../../assets/images/curiousIcon.png';
import FORGIVEN from '../../../assets/images/forgivenIcon.png';
import GROWING from '../../../assets/images/growingIcon.png';
import GUIDING from '../../../assets/images/guidingIcon.png';
import PropTypes from 'prop-types';

import theme from '../../theme';
import { trackAction, trackState } from '../../actions/analytics';
import { buildTrackingObj, disableBack } from '../../utils/common';
import { ACTIONS } from '../../constants';

const sliderWidth = theme.fullWidth;
const stageWidth = theme.fullWidth - 120;
const stageMargin = theme.fullWidth / 30;

const stageIcons = [
  UNINTERESTED,
  CURIOUS,
  FORGIVEN,
  GROWING,
  GUIDING,
];

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

  componentWillMount() {
    this.props.dispatch(getStages());
    this.trackStageState(1); //todo this should be updated to get the id of the first stage
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

    const action = this.props.isSelf ? ACTIONS.SELF_STAGE_SELECTED : ACTIONS.PERSON_STAGE_SELECTED;
    this.props.dispatch(trackAction(action, { [ACTIONS.STAGE_SELECTED]: stage.id }));
  }

  handleScroll(e) {
    this.setState({ scrollPosition: e.nativeEvent.contentOffset.x });
  }

  handleSnapToItem(index) {
    this.trackStageState(this.props.stages[index].id);
  }

  trackStageState(number) {
    const trackingObj = buildTrackingObj(`${this.props.section} : ${this.props.subsection} : stage : ${number}`,
      this.props.section,
      this.props.subsection,
      'stage');
    this.props.dispatch(trackState(trackingObj));
  }

  renderStage({ item, index }) {
    const { firstItem, activeButtonText, buttonText } = this.props;
    const isActive = firstItem && firstItem === index;
    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={stageIcons[index]} />
          <Text type="header" style={styles.cardHeader}>{item.name.toLowerCase()}</Text>
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
    let leftMargin;

    if (this.state.scrollPosition < 0) {
      leftMargin = -30;
    } else {
      leftMargin = (this.state.scrollPosition / -1) -30;
    }

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Image
          resizeMode="contain"
          source={LANDSCAPE}
          style={[
            styles.footerImage,
            { left: leftMargin },
          ]}
        />
        <Flex value={1} align="center" justify="center">
          <Text style={styles.title}>
            {this.props.questionText}
          </Text>
          {
            this.props.stages ? (
              <Carousel
                firstItem={this.props.firstItem || 0}
                data={this.props.stages}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                renderItem={this.renderStage}
                sliderWidth={sliderWidth + 75}
                itemWidth={stageWidth + stageMargin * 2}
                onScroll={this.handleScroll}
                scrollEventThrottle={5}
                onSnapToItem={this.handleSnapToItem}
              />
            ) : null
          }
        </Flex>
        {this.props.enableBackButton ? <BackButton absolute={true} /> : null}
      </Flex>
    );
  }

}

PathwayStageScreen.propTypes = {
  onSelect: PropTypes.func.isRequired,
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
