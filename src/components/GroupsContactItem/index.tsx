import React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { Flex, Text, Icon, DateComponent, Card } from '../../components/common';
import {
  getAssignmentText,
  getUnassignmentText,
  getIconName,
} from '../../utils/common';
import { INTERACTION_TYPES } from '../../constants';
import { localizedStageSelector } from '../../selectors/stages';
import { Stage } from '../../reducers/stages';

import styles from './styles';

type Person = { first_name?: string; last_name?: string };

type GroupsContactItemType = {
  id: string;
  _type: string;
  interaction_type_id?: string;
  person: Person;
  old_pathway_stage?: Stage;
  new_pathway_stage: Stage;
  created_at: string;
  comment: string;
  unassignment_reason?: string;
  initiators: { full_name?: string }[];
  receiver: Person;
  text?: string;
  survey?: { title?: string };
  answers?: { id: string; question: { label: string }; value: string }[];
};

interface GroupsContactItemProps {
  item: GroupsContactItemType;
  person: Person;
  myId: string;
}

const GroupsContactItem = ({ item, person, myId }: GroupsContactItemProps) => {
  const { t } = useTranslation('groupsContactItem');
  function generateInteractionTitle(interaction: GroupsContactItemType) {
    const data = {
      initiator: (interaction.initiators[0] || {}).full_name,
      receiver: interaction.receiver.first_name,
    };
    switch (`${interaction.interaction_type_id}`) {
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

  function renderContent() {
    if (item._type === 'contact_unassignment' && item.unassignment_reason) {
      return <Text style={styles.comment}>{item.unassignment_reason}</Text>;
    } else if (item.comment) {
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
  const iconType =
    getIconName(item._type, item.interaction_type_id) || 'surveyIcon';
  let title = item.text;
  if (item.survey && item.survey.title) {
    title = item.survey.title;
  } else if (item._type === 'contact_assignment') {
    title = getAssignmentText(myId, person.first_name, item);
  } else if (item._type === 'contact_unassignment') {
    title = getUnassignmentText(myId, person.first_name, item);
  } else if (item._type === 'pathway_progression_audit') {
    if (item.old_pathway_stage) {
      title = t('stageChange', {
        personName: item.person.first_name,
        oldStage: localizedStageSelector(
          item.old_pathway_stage,
          i18next.language,
        ).name,
        newStage: localizedStageSelector(
          item.new_pathway_stage,
          i18next.language,
        ).name,
      });
    } else {
      title = t('stageStart', {
        personName: item.person.first_name,
        newStage: localizedStageSelector(
          item.new_pathway_stage,
          i18next.language,
        ).name,
      });
    }
  } else if (item._type === 'interaction') {
    title = generateInteractionTitle(item);
  }
  return (
    <Card style={styles.row}>
      <Flex value={1} align="center">
        <Icon name={iconType} type="MissionHub" size={32} style={styles.icon} />
      </Flex>
      <Flex value={5} style={styles.rowContent}>
        <DateComponent
          date={item.created_at}
          style={styles.date}
          format="LLL"
        />
        <Text style={styles.title}>{title}</Text>
        {renderContent()}
      </Flex>
    </Card>
  );
};

export default GroupsContactItem;
