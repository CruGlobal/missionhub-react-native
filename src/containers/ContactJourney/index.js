import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
// import { navigatePush } from '../../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

// import { getStepsByFilter, completeStep, deleteStep } from '../../actions/steps';

import styles from './styles';
import { Flex, Button, Text } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';

@translate('contactJourney')
class ContactJourney extends Component {

  constructor(props) {
    super(props);

    this.state = {
      interactions: [],
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleCreateStep = this.handleCreateStep.bind(this);
  }

  componentWillMount() {
    // this.getSteps();
  }

  // getSteps() {
  //   this.props.dispatch(getStepsByFilter({ completed: false, receiver_ids: this.props.person.id })).then((results) => {
  //     const steps = results.findAll('accepted_challenge') || [];
  //     let newSteps = steps.filter((s) => !s._placeHolder);
  //     // this.setState({ steps: newSteps });
  //   });
  // }
  //
  // handleRemove(step) {
  //   // this.props.dispatch(deleteStep(step.id)).then(() => {
  //   //   this.getSteps();
  //   // });
  // }
  //
  // handleComplete(step) {
  //   // this.props.dispatch(completeStep(step)).then(() => {
  //   //   this.getSteps();
  //   // });
  // }

  handleCreateStep() {
    // this.props.dispatch(navigatePush('PersonStep', {
    //   contactName: this.props.person.first_name,
    //   contactId: this.props.person.id,
    //   contact: this.props.person,
    // }));
  }


  renderRow({ item }) {
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
    const { interactions } = this.state;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={interactions}
        keyExtractor={(i) => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
      />
    );
  }

  renderNull() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>{t('ourJourney').toUpperCase()}</Text>
        <Text style={styles.nullText}>{t('journeyNull')}</Text>
      </Flex>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {
            this.state.interactions.length > 0 ? this.renderList() : this.renderNull()
          }
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateStep}
            text={t('addJourney').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}


ContactJourney.propTypes = {
  person: PropTypes.object,
};

export default connect()(ContactJourney);
