import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

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
    this.props.dispatch(navigatePush('AddStep', {
      onComplete: (newStepText) => {
        const addedSteps = this.state.addedSteps;

        const newStep = {
          id: `${addedSteps.length}`,
          body: newStepText,
          selected: true,
        };

        this.setState({
          steps: this.state.steps.concat([newStep]),
          addedSteps: addedSteps.concat([newStep]),
        });
        this.stepsList.onScrollToEnd();
      },
    }));
  }

  saveAllSteps() {
    const selectedSteps = this.state.steps.filter((s) => s.selected);

    LOG('selectedSteps', selectedSteps);
    this.props.dispatch(addSteps(selectedSteps, this.props.receiverId)).then(()=>{
      // LOG(r);
    });
    // TODO: Save selected steps with some kind of API call,
    if (this.state.contact || this.props.contact) {
      this.props.dispatch(navigatePush('Contact', { person: this.props.contact ? this.props.contact : this.state.contact }));
    } else {
      this.props.dispatch(navigatePush(this.props.nextScreen));
    }
  }

  renderTitle() {
    return (
      <Flex value={1.5} align="center" justify="start">
        <Text type="header" style={styles.headerTitle}>Steps of Faith</Text>
        <Text style={styles.headerText}>
          {this.props.headerText}
        </Text>
      </Flex>
    );
  }

  render() {
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
            text="ADD TO MY STEPS"
            style={styles.addButton}
          />
        </Flex>
      </Flex>
    );
  }
}


export default connect()(SelectStepScreen);
