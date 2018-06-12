import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Icon } from '../common';

import styles from './styles';

@translate('groupItem')
class GroupSurveyItem extends Component {
  handleSelect = () => {
    this.props.onSelect(this.props.survey);
  };

  render() {
    const { survey, t } = this.props;
    return (
      <Touchable onPress={this.handleSelect} highlight={true}>
        <Flex direction="row" align="center" style={styles.row}>
          <Flex value={1}>
            <Icon
              name="surveyIcon"
              type="MissionHub"
              size={32}
              style={styles.icon}
            />
          </Flex>
          <Flex value={3.5} style={styles.content}>
            <Text style={styles.title}>
              {(survey.title || '').toUpperCase()}
            </Text>
            <Text direction="row" align="center">
              <Text style={[styles.text, styles.contacts]}>
                {t('numContacts', { number: survey.contacts_count })}
              </Text>
              {survey.unassigned_contacts_count ? (
                <Text>
                  <Text style={styles.text}>{'  ·  '}</Text>
                  <Text style={[styles.text, styles.unassigned]}>
                    {t('numUnassigned', {
                      number: survey.unassigned_contacts_count,
                    })}
                  </Text>
                </Text>
              ) : null}
              {survey.uncontacted_contacts_count ? (
                <Text>
                  <Text style={styles.text}>{'  ·  '}</Text>
                  <Text style={[styles.text, styles.uncontacted]}>
                    {t('numUncontacted', {
                      number: survey.uncontacted_contacts_count,
                    })}
                  </Text>
                </Text>
              ) : null}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }
}

GroupSurveyItem.propTypes = {
  survey: PropTypes.shape({
    id: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    contacts_count: PropTypes.number,
    unassigned_contacts_count: PropTypes.number,
    uncontacted_contacts_count: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default GroupSurveyItem;
