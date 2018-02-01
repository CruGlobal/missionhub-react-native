import React, { Component } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Separator, Touchable, Icon } from '../common';
import styles from './styles';

@translate('selectStep')
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
          <Icon type="MissionHub" name={item.selected ? 'removeStepIcon' : 'addStepIcon'} style={styles.addIcon} />
          <Text style={styles.stepName}>{item.body}</Text>
        </Flex>
      </Touchable>
    );
  }

  renderCreateStep() {
    const { t } = this.props;
    return (
      <Touchable onPress={this.props.onCreateStep}>
        <Flex direction="row" align="center" justify="start" value={1} style={styles.separatorWrap}>
          <Icon name="createStepIcon" type="MissionHub" style={styles.addIcon} />
          <Text style={styles.stepName}>{t('createStep')}</Text>
        </Flex>
      </Touchable>
    );
  }

  onScrollToEnd() {
    setTimeout(() => this.listView.scrollToEnd(), 200);
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
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    selected: PropTypes.bool,
  })).isRequired,
  onSelectStep: PropTypes.func.isRequired,
  onCreateStep: PropTypes.func.isRequired,
};
