import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Flex, Button, Text, DateComponent } from '../common';
import ChallengeStats from '../ChallengeStats';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeDetailHeader extends Component {
  handleEdit = () => {
    const { challenge, onEdit } = this.props;
    onEdit && onEdit(challenge);
  };

  render() {
    const { t, challenge, canEditChallenges, onEdit, isPast } = this.props;
    const { title, end_date } = challenge;

    const canEdit = canEditChallenges && onEdit && !isPast;

    return (
      <Flex direction="row" style={styles.wrap}>
        <Flex value={5} direction="column" justify="start">
          <Flex style={styles.section}>
            {canEdit ? (
              <Flex direction="row">
                <Button
                  type="transparent"
                  text={t('Edit')}
                  onPress={this.handleEdit}
                  buttonTextStyle={styles.editButtonText}
                />
              </Flex>
            ) : null}
            <Text style={styles.title}>{title}</Text>
          </Flex>
          <Flex style={styles.section}>
            <Text style={styles.subHeader}>{t('endDate')}</Text>
            <DateComponent
              date={end_date}
              format={'dddd, LL'}
              style={styles.dateText}
            />
          </Flex>
          <ChallengeStats challenge={challenge} style={styles.section} />
        </Flex>
        <Flex value={1} />
      </Flex>
    );
  }
}

ChallengeDetailHeader.propTypes = {
  challenge: PropTypes.object.isRequired,
  canEditChallenges: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  isPast: PropTypes.bool,
};

export default ChallengeDetailHeader;
