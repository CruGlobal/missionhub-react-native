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
import { trackAction } from '../../actions/analytics';
import { ADD_STEP_SCREEN } from '../AddStepScreen';

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
    if (nextProps.steps.length !== this.props.steps.length) {
      this.setState({ steps: [].concat(nextProps.steps, this.state.addedSteps) });
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
        this.stepsList.onScrollToEnd();
      },
    }));
  }

  saveAllSteps() {
    const selectedSteps = this.state.steps.filter((s) => s.selected);

    LOG('selectedSteps', selectedSteps);

    selectedSteps.forEach((step) => this.props.dispatch(trackAction('cru.stepoffaithdetail',
      {
        'Step ID': step.id,
        'Stage': step.pathway_stage.id,
        'Challenge Type': step.challenge_type,
        'Self Step': step.self_step ? 'Y' : 'N',
        'Locale': step.locale,
      })));

    this.props.dispatch(trackAction('cru.stepoffaithadded', { 'steps': selectedSteps.length }));

    this.props.dispatch(addSteps(selectedSteps, this.props.receiverId))
      .then(() => this.props.onComplete());
  }

  renderTitle() {
    const { t } = this.props;

    return (
      <Flex value={1.5} align="center" justify="start">
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
          <BackButton customNavigate={this.props.contact || this.state.contact ? undefined : 'backToStages'} />
          {this.renderTitle()}
        </Flex>
        <Flex value={2}>
          <StepsList
            ref={(c) => this.stepsList = c}
            personFirstName={this.props.personFirstName}
            items={this.state.steps}
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

SelectStepScreen.PropTypes = {
  onComplete: PropTypes.func.isRequired,
};


export default connect()(SelectStepScreen);
