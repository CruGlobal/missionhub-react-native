import React, { Component } from 'react';
import { FlatList, Image } from 'react-native';
import PropTypes from 'prop-types';
import ADD_STEP from '../../../assets/images/addStep.png';

import { Flex, Text, Separator, Touchable } from '../common';
import styles from './styles';

export default class StepsList extends Component {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderCreateStep = this.renderCreateStep.bind(this);
  }

  renderRow({ item }) {
    return (
      <Touchable onPress={() => this.props.onSelectStep(item)}>
        <Flex direction="row" align="center" justify="start" value={1}>
          <Image source={ADD_STEP} style={styles.addIcon} />
          <Text style={styles.stepName}>{item.body}</Text>
        </Flex>
      </Touchable>
    );
  }

  renderCreateStep() {
    return (
      <Touchable onPress={this.props.onCreateStep}>
        <Flex direction="row" align="center" justify="start" value={1} style={styles.separatorWrap}>
          <Image source={ADD_STEP} style={styles.addIcon} />
          <Text style={styles.stepName}>Create your own step...</Text>
        </Flex>
      </Touchable>
    );
  }

  render() {
    return (
      <FlatList
        ref={(c) => this.listView = c}
        keyExtractor={(item) => item.id}
        data={this.props.items}
        renderItem={this.renderRow}
        scrollEnabled={true}
        ListFooterComponent={this.renderCreateStep}
        ItemSeparatorComponent={(sectionID, rowID) => <Separator key={rowID} />}
      />
    );
  }
}

StepsList.propTypes = {
  items: PropTypes.array.isRequired,
  onSelectStep: PropTypes.func.isRequired,
  onCreateStep: PropTypes.func.isRequired,
};
