import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Icon, DateComponent, Card } from '../../components/common';
import {
  getAssignedByName,
  getAssignedToName,
  getIconName,
} from '../../utils/common';
import { INTERACTION_TYPES } from '../../constants';

import styles from './styles';

@translate('groupsContactItem')
class GroupsContactItem extends Component {
  generateInteractionTitle(interaction) {
    const { t } = this.props;
    const data = {
      initiator: (interaction.initiators[0] || {}).full_name,
      receiver: interaction.receiver.first_name,
    };
    switch (interaction.interaction_type_id) {
      case INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id:
        return t('spiritualConversation', data);
      case INTERACTION_TYPES.MHInteractionTypeGospelPresentation.id:
        return t('gospelPresentation', data);
      case INTERACTION_TYPES.MHInteractionTypePersonalDecision.id:
        return t('personalDecision', data);
      case INTERACTION_TYPES.MHInteractionTypeHolySpiritConversation.id:
        return t('holySpiritConversation', data);
      case INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id:
        return t('discipleshipConversation', data);
      case INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id:
        return t('somethingCoolHappened', data);
      case INTERACTION_TYPES.MHInteractionTypeNote.id:
        return t('note', data);
    }
  }

  renderContent() {
    const { item } = this.props;
    if (item.comment) {
      return <Text style={styles.comment}>{item.comment}</Text>;
    } else if (item.survey && item.answers) {
      return item.answers.map(a => (
        <Flex direction="column" key={a.id}>
          <Text style={styles.question}>{a.question.label}</Text>
          <Text style={styles.text}>{a.value}</Text>
        </Flex>
      ));
    }
    return null;
  }

  render() {
    const { t, item, person, myId } = this.props;
    let iconType =
      getIconName(item._type, item.interaction_type_id) || 'surveyIcon';
    let title = item.text;
    if (item.survey && item.survey.title) {
      title = item.survey.title;
    } else if (item._type === 'contact_assignment') {
      const assignedToName = getAssignedToName(myId, item);
      const assignedByName = getAssignedByName(myId, item);

      title = t('contactAssignment', {
        assignedByName,
        assignedContactName: person.first_name,
        assignedToName,
      });
    } else if (item._type === 'contact_unassignment') {
      const assignedToName = getAssignedToName(myId, item);

      title = t('contactUnassignment', {
        assignedContactName: person.first_name,
        assignedToName,
      });
    } else if (item._type === 'pathway_progression_audit') {
      if (item.old_pathway_stage) {
        title = t('stageChange', {
          personName: item.person.first_name,
          oldStage: item.old_pathway_stage.name,
          newStage: item.new_pathway_stage.name,
        });
      } else {
        title = t('stageStart', {
          personName: item.person.first_name,
          newStage: item.new_pathway_stage.name,
        });
      }
    } else if (item._type === 'interaction') {
      title = this.generateInteractionTitle(item);
    }
    return (
      <Card style={styles.row}>
        <Flex value={1} align="center">
          <Icon
            name={iconType}
            type="MissionHub"
            size={32}
            style={styles.icon}
          />
        </Flex>
        <Flex value={5} style={styles.rowContent}>
          <DateComponent
            date={item.created_at}
            style={styles.date}
            format="LLL"
          />
          <Text style={styles.title}>{title}</Text>
          {this.renderContent()}
        </Flex>
      </Card>
    );
  }
}

GroupsContactItem.propTypes = {
  item: PropTypes.object.isRequired,
  person: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
};

export default GroupsContactItem;
