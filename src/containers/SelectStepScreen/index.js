import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navigateBack } from '../../actions/navigation';
import { getStepSuggestions } from '../../actions/steps';
import StepsList from '../../components/StepsList';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

class SelectStepScreen extends Component {
  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }
  
  renderTitle() {
    return (
      <Flex value={1.5} align="center" justify="start">
        <Text type="header" style={styles.headerTitle}>Steps of Faith</Text>
        <Text style={styles.headerText}>
          How do you want to move forward on your spiritual journey?  
        </Text>
      </Flex>
    );
  }
  render() {
    // const { id } = this.props;
    return (
      <Flex style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.headerWrap}>
          <BackButton />
          {this.renderTitle()}
        </Flex>
        <Flex value={2}>
          <StepsList items={this.props.suggestedForMe} />
        </Flex>
        <Flex align="center" justify="end">
          <Button
            type="secondary"
            onPress={() => this.props.dispatch(navigateBack())}
            text="ADD TO MY STEPS"
            style={styles.addButton}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ steps }, { navigation }) => ({
  suggestedForMe: steps.suggestedForMe,
  suggestedForOthers: steps.suggestedForOthers,
  id: navigation.state.params ? navigation.state.params.id : '',
});

export default connect(mapStateToProps)(SelectStepScreen);
