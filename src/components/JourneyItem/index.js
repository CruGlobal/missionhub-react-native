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
    const { item } = this.props;

    return <DateComponent date={item.date} style={styles.date} format="LL" />;
  }

  hasOldStage(item) {
    return item.old_pathway_stage.name;
  }

  translatableStage(item) {
    return { personName: item.personName, oldStage: item.old_pathway_stage.name, newStage: item.new_pathway_stage.name };
  }

  renderTitle() {
    const { t, item, type } = this.props;
    let title;
    if (type === 'step') {
      title = t('stepTitle');
    } else if (type === 'stage') {
      if (item.old_pathway_stage.name) {
        title = t('stageTitle', this.translatableStage(item));
      } else {
        title = item.new_pathway_stage.name;
      }
    } else if (type === 'survey' && item.survey) {
      title = item.survey.title;
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
    const { t, item, type } = this.props;
    let text;
    if (type === 'step') {
      text = item.title;
      if (item.note) {
        text = `${text}\n\n${item.note}`;
      }
    } else if (type === 'stage') {
      if (this.hasOldStage(item)) {
        text = t('stageText', this.translatableStage(item));
      } else {
        text = t('stageStart', this.translatableStage(item));
      }
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
      iconType = 'surveyIcon';
    } else if (type === 'interaction') {
      const interaction = interactionsArr.find((i) => i.id === item.interaction_type_id);
      if (interaction) {
        iconType = interaction.iconName;
      }
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
    if (this.props.type === 'survey') return this.renderSurvey();
    return (
      <Flex value={1} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {this.renderText()}
      </Flex>
    );
  }

  renderSurvey() {
    const { answers } = this.props.item;
    return (
      <Flex value={1} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {
          answers.map((a) => (
            <Flex direction="column" key={a.id}>
              <Text style={styles.question}>{a.question.label}</Text>
              <Text style={styles.text}>{a.value}</Text>
            </Flex>
          ))
        }
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
  type: PropTypes.oneOf([ 'step', 'stage', 'survey', 'interaction' ]),
};
