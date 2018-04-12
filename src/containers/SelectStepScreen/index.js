import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';
import i18next from 'i18next';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';
import { trackState } from '../../actions/analytics';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack } from '../../utils/common';
import { CUSTOM_STEP_TYPE } from '../../constants';
import theme from '../../theme';
import uuidv4 from 'uuid/v4';

@translate('selectStep')
class SelectStepScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      steps: props.steps,
      addedSteps: [],
      contact: null,
    };

    this.handleSelectStep = this.handleSelectStep.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
    this.saveAllSteps = this.saveAllSteps.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ steps: [].concat(nextProps.steps, this.state.addedSteps) });
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

  filterSelected() {
    return this.state.steps.filter((s) => s.selected);
  }

  handleSelectStep(item) {
    const steps = this.state.steps.map((s) => s.id === item.id ? { ...s, selected: !s.selected } : s);
    this.setState({ steps });
  }

  handleCreateStep() {
    if (this.props.contact) {
      this.setState({ contact: this.props.contact });
    }
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
    this.props.dispatch(navigatePush(ADD_STEP_SCREEN, {
      onComplete: (newStepText) => {
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
          steps: this.state.steps.concat([ newStep ]),
          addedSteps: addedSteps.concat([ newStep ]),
        });
        if (this.stepsList && this.stepsList.onScrollToEnd) {
          this.stepsList.onScrollToEnd();
        }
      },
    }));

    this.props.dispatch(trackState(this.props.createStepTracking));
  }

  saveAllSteps() {
    const selectedSteps = this.filterSelected();

    this.props.dispatch(addSteps(selectedSteps, this.props.receiverId, this.props.organization))
      .then(() => this.props.onComplete());
  }

  renderBackButton() {
    const { enableBackButton, contact } = this.props;
    return enableBackButton ?
      (<BackButton customNavigate={contact || this.state.contact ? undefined : () => this.props.dispatch(navigateBack(2))} absolute={true} />)
      : null;
  }

  renderTitle() {
    const { t } = this.props;

    return (
      <Flex value={1.5} align="center" justify="center">
        <Text type="header" style={styles.headerTitle}>{t('stepsOfFaith')}</Text>
        <Text style={styles.headerText}>
          {this.props.headerText}
        </Text>
      </Flex>
    );
  }

  renderSaveButton() {
    const { t } = this.props;
    return this.filterSelected().length > 0 ?
      (<Flex align="center" justify="end">
        <Button
          type="secondary"
          onPress={this.saveAllSteps}
          text={t('addStep').toUpperCase()}
          style={styles.addButton}
        />
      </Flex>)
      : null;
  }

  render() {
    const { t } = this.props;

    return (
      <Flex style={styles.container}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          parallaxHeaderHeight={215}
          renderForeground={() =>
            <Flex value={1} align="center" justify="center">
              {this.renderTitle()}
              {this.renderBackButton()}
            </Flex>
          }
          stickyHeaderHeight={theme.headerHeight}
          renderStickyHeader={() =>
            <Flex align="center" justify="center" style={styles.collapsedHeader}>
              <Text style={styles.collapsedHeaderTitle}>
                {t('stepsOfFaith').toUpperCase()}
              </Text>
            </Flex>
          }
        >
          <StepsList
            ref={(c) => this.stepsList = c}
            personFirstName={this.props.personFirstName}
            items={this.state.steps}
            createStepText={t('createStep')}
            onSelectStep={this.handleSelectStep}
            onCreateStep={this.handleCreateStep}
          />
        </ParallaxScrollView>
        {this.renderSaveButton()}
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
};

const mapStateToProps = ({ auth }) => ({
  myId: auth.personId,
});

export default connect(mapStateToProps)(SelectStepScreen);
