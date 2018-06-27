import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Icon, DateComponent, Card } from '../../components/common';
import { getIconName } from '../../utils/common';

import styles from './styles';

@translate('groupsContactItem')
class GroupsContactItem extends Component {
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
    const { t, item, person } = this.props;
    let iconType =
      getIconName(item._type, item.interaction_type_id) || 'surveyIcon';
    let title = item.text;
    if (item.survey && item.survey.title) {
      title = item.survey.title;
    } else if (item._type === 'contact_assignment') {
      // TODO: Fill in the correct names
      title = t('assigned', {
        assigner: 'Name 1',
        assignedContact: person.full_name,
        assignedTo: 'Name 3',
      });
    } else if (item._type === 'contact_unassignment') {
      // TODO: Fill in the correct names
      title = t('unassigned', {
        unassignedContact: 'Name 1',
        unassignedBy: person.full_name,
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
};

export default GroupsContactItem;
