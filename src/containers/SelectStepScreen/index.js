import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';
import { trackAction, trackState } from '../../actions/analytics';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack } from '../../utils/common';

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
          id: `${addedSteps.length}`,
          body: newStepText,
          selected: true,
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
    const selectedSteps = this.state.steps.filter((s) => s.selected);

    selectedSteps.forEach((step) => this.props.dispatch(trackAction('cru.stepoffaithdetail',
      {
        'Step ID': step.id,
        'Stage': step.pathway_stage ? step.pathway_stage.id : undefined,
        'Challenge Type': step.challenge_type,
        'Self Step': step.self_step ? 'Y' : 'N',
        'Locale': step.locale,
      })));

    this.props.dispatch(trackAction('cru.stepoffaithadded', { 'steps': selectedSteps.length }));

    this.props.dispatch(addSteps(selectedSteps, this.props.receiverId, this.props.organization))
      .then(() => this.props.onComplete());
  }

  renderBackButton() {
    const { enableBackButton, contact } = this.props;
    return enableBackButton ?
      (<BackButton customNavigate={contact || this.state.contact ? undefined : 'backToStages'} absolute={true} />)
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

  render() {
    const { t } = this.props;

    return (
      <Flex style={styles.container}>
        <Flex value={1.5} align="center" justify="center" style={styles.headerWrap}>
          {this.renderTitle()}
          {this.renderBackButton()}
        </Flex>
        <Flex value={2}>
          <StepsList
            ref={(c) => this.stepsList = c}
            personFirstName={this.props.personFirstName}
            items={this.state.steps}
            createStepText={t('createStep')}
            onSelectStep={this.handleSelectStep}
            onCreateStep={this.handleCreateStep}
          />
        </Flex>
        <Flex align="center" justify="end">
          <Button
            type="secondary"
            onPress={this.saveAllSteps}
            text={t('addStep').toUpperCase()}
            style={styles.addButton}
          />
        </Flex>
      </Flex>
    );
  }
}

SelectStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  createStepTracking: PropTypes.object.isRequired,
  contact: PropTypes.object,
  enableBackButton: PropTypes.bool,
  organization: PropTypes.object,
};


export default connect()(SelectStepScreen);
