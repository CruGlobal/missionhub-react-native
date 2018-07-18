import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Icon, DateComponent } from '../common';
import { INTERACTION_TYPES } from '../../constants';
import { getAssignedByName, getAssignedToName } from '../../utils/common';

import styles from './styles';

const interactionsArr = Object.keys(INTERACTION_TYPES).map(
  key => INTERACTION_TYPES[key],
);

@translate('journeyItem')
export default class JourneyItem extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }

  renderDate() {
    const { item } = this.props;
    return (
      <DateComponent
        date={
          item._type === 'accepted_challenge'
            ? item.completed_at
            : item.created_at
        }
        style={styles.date}
        format="LL"
      />
    );
  }

  oldStage(item) {
    return item.old_pathway_stage && item.old_pathway_stage.name;
  }

  translatableStage(item) {
    return {
      personName: item.person.first_name,
      oldStage: this.oldStage(item),
      newStage: item.new_pathway_stage.name,
    };
  }

  isSelfPathwayProgressionAudit(item) {
    return this.props.myId === item.person.id;
  }

  renderTitle() {
    const {
      t,
      item,
      myId,
      personFirstName,
      item: { _type },
    } = this.props;
    let title;
    if (_type === 'accepted_challenge') {
      const pathwayStage =
        item.challenge_suggestion &&
        item.challenge_suggestion.pathway_stage &&
        item.challenge_suggestion.pathway_stage.name
          ? ` ${item.challenge_suggestion.pathway_stage.name} `
          : ' ';
      title = t('stepTitle', { stageName: pathwayStage });
    } else if (_type === 'pathway_progression_audit') {
      if (this.oldStage(item)) {
        title = t('stageTitle', this.translatableStage(item));
      } else {
        title = item.new_pathway_stage.name;
      }
    } else if (_type === 'answer_sheet' && item.survey) {
      title = item.survey.title;
    } else if (_type === 'interaction') {
      const interaction = interactionsArr.find(
        i => i.id === item.interaction_type_id,
      );
      if (interaction) {
        title = t(interaction.translationKey);
      }
    } else if (_type === 'contact_assignment') {
      const assignedToName = getAssignedToName(myId, item);
      const assignedByName = getAssignedByName(myId, item);

      title = t('contactAssignment', {
        assignedByName,
        assignedContactName: personFirstName,
        assignedToName,
      });
    } else if (_type === 'contact_unassignment') {
      const assignedToName = getAssignedToName(myId, item);

      title = t('contactUnassignment', {
        assignedContactName: personFirstName,
        assignedToName,
      });
    }

    if (!title) return null;

    return <Text style={styles.title}>{title}</Text>;
  }

  renderText() {
    const {
      t,
      item,
      item: { _type },
    } = this.props;
    let text;
    if (_type === 'accepted_challenge') {
      text = item.title;
      if (item.note) {
        text = `${text}\n\n${item.note}`;
      }
    } else if (_type === 'pathway_progression_audit') {
      if (this.oldStage(item)) {
        if (this.isSelfPathwayProgressionAudit(item)) {
          text = t('stageTextSelf', this.translatableStage(item));
        } else {
          text = t('stageText', this.translatableStage(item));
        }
      } else {
        if (this.isSelfPathwayProgressionAudit(item)) {
          text = t('stageStartSelf', this.translatableStage(item));
        } else {
          text = t('stageStart', this.translatableStage(item));
        }
      }
    } else if (_type === 'interaction') {
      text = item.comment;
    }

    if (!text) {
      return null;
    }

    return <Text style={styles.text}>{text}</Text>;
  }

  renderIcon() {
    const {
      item,
      item: { _type },
    } = this.props;
    let iconType;
    if (_type === 'accepted_challenge') {
      iconType = 'stepsIcon';
    } else if (_type === 'pathway_progression_audit') {
      iconType = 'journeyIcon';
    } else if (_type === 'answer_sheet') {
      iconType = 'surveyIcon';
    } else if (_type === 'interaction') {
      const interaction = interactionsArr.find(
        i => i.id === item.interaction_type_id,
      );
      if (interaction) {
        iconType = interaction.iconName;
      }
    } else if (
      _type === 'contact_assignment' ||
      _type === 'contact_unassignment'
    ) {
      iconType = 'journeyWarning';
    }

    if (!iconType) return null;

    return (
      <Flex value={1}>
        <Icon
          name={iconType}
          type="MissionHub"
          size={32}
          style={[
            styles.icon,
            iconType === 'commentIcon' ? styles.commentIcon : {},
          ]}
        />
      </Flex>
    );
  }

  renderContent() {
    if (this.props.item._type === 'answer_sheet') return this.renderSurvey();
    return (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {this.renderText()}
      </Flex>
    );
  }

  renderSurvey() {
    const { answers } = this.props.item;
    return (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {answers.map(a => (
          <Flex direction="column" key={a.id}>
            <Text style={styles.question}>{a.question.label}</Text>
            <Text style={styles.text}>{a.value}</Text>
          </Flex>
        ))}
      </Flex>
    );
  }

  render() {
    return (
      <Flex
        ref={c => (this._view = c)}
        direction="row"
        align="center"
        style={styles.row}
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
    _type: PropTypes.oneOf([
      'accepted_challenge',
      'pathway_progression_audit',
      'answer_sheet',
      'interaction',
      'contact_assignment',
      'contact_unassignment',
    ]),
    text: PropTypes.string,
    title: PropTypes.string,
    completed_at: PropTypes.date,
  }).isRequired,
  myId: PropTypes.string.isRequired,
  personFirstName: PropTypes.string.isRequired,
};
