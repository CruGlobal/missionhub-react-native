import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { Flex, Icon, DateComponent } from '../common';
import { INTERACTION_TYPES, ACCEPTED_STEP } from '../../constants';
import { getAssignedByName, getAssignedToName } from '../../utils/common';
import { localizedStageSelector } from '../../selectors/stages';

import styles from './styles';

const interactionsArr = Object.keys(INTERACTION_TYPES).map(
  // @ts-ignore
  key => INTERACTION_TYPES[key],
);

// @ts-ignore
@withTranslation('journeyItem')
export default class JourneyItem extends Component {
  // @ts-ignore
  setNativeProps(nProps) {
    // @ts-ignore
    this._view.setNativeProps(nProps);
  }

  renderDate() {
    // @ts-ignore
    const { item } = this.props;
    return (
      <DateComponent
        date={
          item._type === ACCEPTED_STEP ? item.completed_at : item.created_at
        }
        style={styles.date}
        format="LL"
      />
    );
  }

  // @ts-ignore
  oldStage(item) {
    return localizedStageSelector(item.old_pathway_stage, i18next.language)
      .name;
  }

  // @ts-ignore
  translatableStage(item) {
    return {
      personName: item.person.first_name,
      oldStage: this.oldStage(item),
      newStage: localizedStageSelector(item.new_pathway_stage, i18next.language)
        .name,
    };
  }

  // @ts-ignore
  isSelfPathwayProgressionAudit(item) {
    // @ts-ignore
    return this.props.myId === item.person.id;
  }

  renderTitle() {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      item,
      // @ts-ignore
      myId,
      // @ts-ignore
      personFirstName,
      // @ts-ignore
      item: { _type },
    } = this.props;
    let title;
    if (_type === ACCEPTED_STEP) {
      const pathwayStage =
        (item.challenge_suggestion &&
          item.challenge_suggestion.pathway_stage &&
          ` ${
            localizedStageSelector(
              item.challenge_suggestion.pathway_stage,
              i18next.language,
            ).name
          } `) ||
        ' ';
      title = t('stepTitle', { stageName: pathwayStage });
    } else if (_type === 'pathway_progression_audit') {
      if (this.oldStage(item)) {
        title = t('stageTitle', this.translatableStage(item));
      } else {
        title = localizedStageSelector(item.new_pathway_stage, i18next.language)
          .name;
      }
    } else if (_type === 'answer_sheet' && item.survey) {
      title = item.survey.title;
    } else if (_type === 'interaction') {
      const interaction = interactionsArr.find(
        i => i.id === `${item.interaction_type_id}`,
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

    if (!title) {
      return null;
    }

    return <Text style={styles.title}>{title}</Text>;
  }

  renderText() {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      item,
      // @ts-ignore
      item: { _type },
    } = this.props;
    let text;
    if (_type === ACCEPTED_STEP) {
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
      // @ts-ignore
      item,
      // @ts-ignore
      item: { _type },
    } = this.props;
    let iconType;
    if (_type === ACCEPTED_STEP) {
      iconType = 'stepsIcon';
    } else if (_type === 'pathway_progression_audit') {
      iconType = 'journeyIcon';
    } else if (_type === 'answer_sheet') {
      iconType = 'surveyIcon';
    } else if (_type === 'interaction') {
      const interaction = interactionsArr.find(
        i => i.id === `${item.interaction_type_id}`,
      );
      if (interaction) {
        iconType = interaction.iconName;
      }
    } else if (
      _type === 'contact_assignment' ||
      _type === 'contact_unassignment'
    ) {
      iconType = 'statusIcon';
    }

    if (!iconType) {
      return null;
    }

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
    // @ts-ignore
    if (this.props.item._type === 'answer_sheet') {
      return this.renderSurvey();
    }
    return (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {this.renderText()}
      </Flex>
    );
  }

  renderSurvey() {
    // @ts-ignore
    const { answers } = this.props.item;
    return (
      <Flex value={3.5} direction="column" style={styles.textWrap}>
        {this.renderDate()}
        {this.renderTitle()}
        {/* 
        // @ts-ignore */}
        {answers.map(a => (
          <Flex direction="column" key={a.id}>
            <Text style={styles.question}>{a.question.label}</Text>
            <Text style={styles.text}>{a.value}</Text>
          </Flex>
        ))}
      </Flex>
    );
  }

  // @ts-ignore
  ref = c => (this._view = c);

  render() {
    return (
      <Flex ref={this.ref} direction="row" align="center" style={styles.row}>
        {this.renderIcon()}
        {this.renderContent()}
      </Flex>
    );
  }
}

// @ts-ignore
JourneyItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    _type: PropTypes.oneOf([
      ACCEPTED_STEP,
      'pathway_progression_audit',
      'answer_sheet',
      'interaction',
      'contact_assignment',
      'contact_unassignment',
    ]),
    text: PropTypes.string,
    title: PropTypes.string,
    // @ts-ignore
    completed_at: PropTypes.date,
  }).isRequired,
  myId: PropTypes.string.isRequired,
  personFirstName: PropTypes.string.isRequired,
};
