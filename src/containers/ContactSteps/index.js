import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';
import PropTypes from 'prop-types';

import { getStepsByFilter, completeStep, addSteps, deleteStep } from '../../actions/steps';

import styles from './styles';
import { Flex, Button, Text } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/footprints.png';

class ContactSteps extends Component {

  constructor(props) {
    super(props);

    this.state = {
      steps: [],
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
  }

  componentWillMount() {
    this.getSteps();
  }

  getSteps() {
    this.props.dispatch(getStepsByFilter({completed: false, receiver_ids: this.props.person.id})).then((results) => {
      const steps = results.findAll('accepted_challenge') || [];
      let newSteps = steps.filter((s) => !s._placeHolder);
      this.setState({steps: newSteps});
    });
  }

  handleRemove(step) {
    this.props.dispatch(deleteStep(step.id)).then(() => {
      this.getSteps();
    });
  }

  handleComplete(step) {
    this.props.dispatch(completeStep(step)).then(() => {
      this.getSteps();
    });
  }

  handleCreateStep() {
    this.props.dispatch(navigatePush('AddStep', {
      onComplete: (newStepText) => {
        let newStep = {
          id: 1,
          body: newStepText,
        };
        this.props.dispatch(addSteps([newStep], this.props.person.id)).then(()=> {
          this.getSteps();
        });
      },
    }));
  }


  renderRow({item}) {
    return (
      <RowSwipeable
        key={item.id}
        onDelete={() => this.handleRemove(item)}
        onComplete={() => this.handleComplete(item)}
      >
        <StepItem step={item} type="listSwipeable" />
      </RowSwipeable>
    );
  }

  renderList() {
    const { steps } = this.state;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={steps}
        keyExtractor={(i) => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
      />
    );
  }

  renderNull() {
    const name = 'Ben';
    return (
      <Flex align="center" justify="center">
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>STEPS OF FAITH</Text>
        <Text style={styles.nullText}>Your Steps of Faith with {name} appear here.</Text>
      </Flex>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {
            this.state.steps.length > 0 ? this.renderList() : this.renderNull()
          }
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateStep}
            text="ADD A STEP OF FAITH"
          />
        </Flex>
      </View>
    );
  }
}


ContactSteps.propTypes = {
  person: PropTypes.object,
};

export default connect()(ContactSteps);
