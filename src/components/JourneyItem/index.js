import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Icon, DateComponent } from '../common';
import styles from './styles';
import { INTERACTION_TYPES } from '../../constants';

const interactionsArr = Object.keys(INTERACTION_TYPES).map((key) => INTERACTION_TYPES[key]);

@translate('journeyItem')
export default class JourneyItem extends Component {
  setNativeProps(nProps) { this._view.setNativeProps(nProps); }
  renderDate() {
    const { item, type } = this.props;
    let date;
    if (type === 'step') {
      date = item.completed_at;
    // } else if (type === 'survey') {
    //   date = item.title;
    } else {
      date = item.created_at;
    }

    return <DateComponent date={date} style={styles.date} format="LL" />;
  }
  renderTitle() {
    const { t, item, type } = this.props;
    let title;
    if (type === 'step') {
      title = t('stepTitle');
    } else if (type === 'stage') {
      title = t('stageTitle');
    } else if (type === 'survey') {
      title = item.title;
    } else if (type === 'interaction') {
      const interaction = interactionsArr.find((i) => i.id === item.interaction_type_id);
      if (interaction) {
        title = t(interaction.translationKey);
      }
    }

    if (!title) return null;

    return (
      <Text style={styles.title}>
        {title}
      </Text>
    );
  }
  renderText() {
    const { item, type } = this.props;
    let text;
    if (type === 'step') {
      text = item.title;
    } else {
      text = item.text;
    }

    return (
      <Text style={styles.text}>
        {text}
      </Text>
    );
  }

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
    } else if (type === 'interaction') {
      const interaction = interactionsArr.find((i) => i.id === item.interaction_type_id);
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
    return (
      <Flex value={1} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {this.renderText()}
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
    text: PropTypes.string,
    title: PropTypes.string,
    completed_at: PropTypes.date,
  }).isRequired,
  type: PropTypes.oneOf(['step', 'stage', 'survey', 'interaction' ]),
};
