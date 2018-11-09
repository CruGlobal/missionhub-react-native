import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Keyboard } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

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
import {
  ACTIONS,
  PERSON_VIEWED_STAGE_CHANGED,
  SELF_VIEWED_STAGE_CHANGED,
} from '../../constants';
import { selectMyStage } from '../../actions/selectStage';
import {
  contactAssignmentSelector,
  isMeSelector,
  personSelector,
} from '../../selectors/people';
import { stageSelector } from '../../selectors/stages';

import styles from './styles';

const screenMargin = 60;
const sliderWidth = theme.fullWidth;
const stageWidth = theme.fullWidth - screenMargin * 2;
const stageMargin = theme.fullWidth / 30;
const overScrollMargin = 120;

const stageIcons = [UNINTERESTED, CURIOUS, FORGIVEN, GROWING, GUIDING];

@translate('selectStage')
class StageScreen extends Component {
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

    this.trackStageState(this.props.currentStage.id);
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

  setStage = async (stage, isAlreadySelected) => {
    const {
      dispatch,
      next,
      enableBackButton,
      person,
      isMe,
      orgId,
    } = this.props;

    if (!enableBackButton) {
      disableBack.remove();
    }

    if (!isAlreadySelected) {
      if (isMe) {
        await dispatch(selectMyStage(stage.id));
      } else {
        debugger;
        // TODO: obliterate
        this.props.onSelect(stage, isAlreadySelected);
      }
    }
    dispatch(next({ personId: person.id, isMe, stageId: stage.id, orgId }));

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

  handleScroll(e) {
    this.setState({ scrollPosition: e.nativeEvent.contentOffset.x });
  }

  handleSnapToItem(index) {
    this.trackStageState(this.props.stages[index].id);
  }

  trackStageState(number) {
    const { dispatch, trackAsOnboarding, isMe } = this.props;

    const section = trackAsOnboarding ? 'onboarding' : 'people';
    const subsection = isMe ? 'self' : 'person';

    const trackingObj = buildTrackingObj(
      `${section} : ${subsection} : stage : ${number}`,
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

  renderStage({ item, index }) {
    const { t, currentStage, isMe } = this.props;
    const isActive = item === currentStage;
    const buttonText = isMe ? t('iAmHere') : t('here');

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
          text={
            isActive ? t('stillHere').toUpperCase() : buttonText.toUpperCase()
          }
        />
      </View>
    );
  }

  render() {
    const {
      t,
      person,
      isMe,
      stages,
      currentStage,
      enableBackButton,
    } = this.props;

    const leftMargin = this.state.scrollPosition / -1 - overScrollMargin;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Image
          resizeMode="contain"
          source={LANDSCAPE}
          style={[styles.footerImage, { left: leftMargin }]}
        />
        {enableBackButton ? <BackButton absolute={true} /> : null}
        <Text style={styles.title}>
          {isMe
            ? t('meQuestion', { name: person.first_name })
            : t('personQuestion', { name: person.first_name })}
        </Text>
        {this.props.stages ? (
          <Carousel
            firstItem={stages.indexOf(currentStage)}
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

StageScreen.propTypes = {
  next: PropTypes.func.isRequired,
  trackAsOnboarding: PropTypes.bool,
  stages: PropTypes.array.isRequired,
  person: PropTypes.object.isRequired,
  isMe: PropTypes.bool.isRequired,
  currentStage: PropTypes.object,
};

const mapStateToProps = ({ people, stages, auth }, { navigation }) => {
  const { personId, orgId } = navigation.state.params || {};

  const person = personSelector({ people }, { personId, orgId });
  const { pathway_stage_id } =
    contactAssignmentSelector({ auth }, { person, orgId }) || {};

  return {
    stages: stages.stages,
    person,
    isMe: isMeSelector({ auth }, { personId }),
    orgId,
    currentStage: stageSelector({ stages }, { stageId: pathway_stage_id }),
  };
};

export default connect(mapStateToProps)(StageScreen);
export const STAGE_SCREEN = 'nav/STAGE';
