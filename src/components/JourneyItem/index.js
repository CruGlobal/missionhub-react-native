import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Text, Icon, DateComponent } from '../common';
import styles from './styles';
import { INTERACTION_TYPES } from '../../constants';

const interactionsArr = Object.keys(INTERACTION_TYPES).map((key) => INTERACTION_TYPES[key]);

export default class JourneyItem extends Component {
  setNativeProps(nProps) { this._view.setNativeProps(nProps); }
  renderIcon() {
    const { item, type } = this.props;
    let iconType;
    if (type === 'step') {
      iconType = 'stepsIcon';
    } else if (type === 'stage') {
      iconType = 'journeyIcon';
    } else if (type === 'survey') {
      // TODO: Get correct icon
      iconType = 'notesIcon';
    } else if (type === 'comment') {
      // TODO: Get correct icon
      iconType = 'stepsIcon';
    } else if (type === 'interaction') {
      const interaction = interactionsArr.find((i) => i.id === item.id);
      if (interaction) {
        iconType = interaction.iconName;
      }
      // TODO: Figure out if there is a default icon
    }

    if (!iconType) return null;

    return (
      <Icon
        name={iconType}
        type="MissionHub"
        size={32}
        style={styles.icon}
      />      
    );
  }

  renderContent() {
    const { item } = this.props;
    return (
      <Flex value={1} direction="column" style={styles.textWrap}>
        <DateComponent date={item.completed_at} style={styles.date} format="LL" />
        {
          item.title ? (
            <Text style={styles.title}>
              {item.title}
            </Text>
          ) : null
        }
        <Text style={styles.text}>
          {item.text}
        </Text>
      </Flex>
    );
  }
  render() {
    const { type } = this.props;
    return (
      <Flex
        ref={(c) => this._view = c}
        direction="row"
        align="center"
        style={[
          styles.row,
          type && styles[type] ? styles[type] : null,
        ]}
      >
        {this.renderIcon()}
        {this.renderContent()}
      </Flex>
    );
  }

}

JourneyItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    completed_at: PropTypes.date,
  }).isRequired,
  type: PropTypes.oneOf(['step', 'stage', 'survey', 'comment' ]),
};
