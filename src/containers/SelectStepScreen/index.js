import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import i18next from 'i18next';
import uuidv4 from 'uuid/v4';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';
import { Flex, Text, Button, Icon } from '../../components/common';
import BackButton from '../BackButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack, getFourRandomItems } from '../../utils/common';
import {
  CREATE_STEP,
  CUSTOM_STEP_TYPE,
  REMOVE_MY_SUGGESTIONS,
  REMOVE_OTHER_SUGGESTIONS,
} from '../../constants';
import theme from '../../theme';

import styles from './styles';

@translate('selectStep')
class SelectStepScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      addedSteps: [],
      contact: null,
    };
  }

  componentDidMount() {
    const { dispatch, isMe, contactStage } = this.props;
    dispatch(getStepSuggestions(isMe, contactStage.id));
    if (!this.props.enableBackButton) {
      disableBack.add();
    }
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  handleLoadSteps = () => {};

  filterSelected() {
    return this.state.steps.filter(s => s.selected);
  }

  handleSelectStep = item => {
    const steps = this.state.steps.map(
      s => (s.id === item.id ? { ...s, selected: !s.selected } : s),
    );
    this.setState({ steps });
  };

  handleCreateStep = () => {
    if (this.props.contact) {
      this.setState({ contact: this.props.contact });
    }
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
    this.props.dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: this.props.createStepTracking,
        onComplete: newStepText => {
          const addedSteps = this.state.addedSteps;

          const newStep = {
            id: uuidv4(),
            body: newStepText,
            selected: true,
            locale: i18next.language,
            challenge_type: CUSTOM_STEP_TYPE,
            self_step: this.props.myId === this.props.receiverId,
          };

          this.setState({
            steps: this.state.steps.concat([newStep]),
            addedSteps: addedSteps.concat([newStep]),
          });
          if (this.stepsList && this.stepsList.onScrollToEnd) {
            this.stepsList.onScrollToEnd();
          }
        },
      }),
    );
  };

  saveAllSteps = async () => {
    const { dispatch, receiverId, organization, onComplete } = this.props;
    const selectedSteps = this.filterSelected();

    await dispatch(addSteps(selectedSteps, receiverId, organization));
    onComplete();
  };

  renderBackButton() {
    const { enableBackButton, contact } = this.props;
    return enableBackButton ? (
      <BackButton
        customNavigate={
          contact || this.state.contact
            ? undefined
            : () => this.props.dispatch(navigateBack(2))
        }
        absolute={true}
      />
    ) : null;
  }

  renderTitle() {
    const { t } = this.props;

    return (
      <Flex
        value={1}
        align="center"
        justify="center"
        style={{ marginTop: theme.notchHeight }}
      >
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text type="header" style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{this.props.headerText}</Text>
      </Flex>
    );
  }

  renderSaveButton() {
    const { t } = this.props;
    return this.filterSelected().length > 0 ? (
      <Flex align="center" justify="end">
        <Button
          type="secondary"
          onPress={this.saveAllSteps}
          text={t('addStep').toUpperCase()}
          style={styles.addButton}
        />
      </Flex>
    ) : null;
  }

  render() {
    const { t } = this.props;

    return (
      <Flex style={styles.container}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          parallaxHeaderHeight={215 + theme.notchHeight}
          renderForeground={() => (
            <Flex value={1} align="center" justify="center">
              {this.renderTitle()}
            </Flex>
          )}
          stickyHeaderHeight={theme.headerHeight}
          renderStickyHeader={() => (
            <Flex
              align="center"
              justify="center"
              style={styles.collapsedHeader}
            >
              <Text style={styles.collapsedHeaderTitle}>
                {t('stepsOfFaith').toUpperCase()}
              </Text>
            </Flex>
          )}
        >
          <StepsList
            ref={c => (this.stepsList = c)}
            personFirstName={this.props.personFirstName}
            items={this.state.steps}
            createStepText={t('createStep')}
            loadMoreStepsText={t('loadMoreSteps')}
            onSelectStep={this.handleSelectStep}
            onCreateStep={this.handleCreateStep}
            onLoadMoreSteps={this.handleLoadSteps}
          />
        </ParallaxScrollView>
        {this.renderSaveButton()}
        {this.renderBackButton()}
      </Flex>
    );
  }
}

SelectStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  createStepTracking: PropTypes.object.isRequired,
  contact: PropTypes.object,
  receiverId: PropTypes.string,
  enableBackButton: PropTypes.bool,
  organization: PropTypes.object,
  contactStage: PropTypes.object.isRequired,
  isMe: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ auth, steps }, { isMe }) => ({
  myId: auth.person.id,
  suggestions: isMe ? steps.suggestedForMe : steps.suggestedForOthers,
});

export default connect(mapStateToProps)(SelectStepScreen);
