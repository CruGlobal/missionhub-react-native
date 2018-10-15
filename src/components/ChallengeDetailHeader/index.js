import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';

import { Flex, Button, Text, DateComponent } from '../common';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeDetailHeader extends Component {
  handleEdit = () => {
    const { challenge, onEdit } = this.props;
    onEdit && onEdit(challenge);
  };

  render() {
    const { t, challenge, canEditChallenges } = this.props;
    const { isPast, title, end_date } = challenge;

    const canEdit = canEditChallenges && !isPast;

    return (
      <Flex direction="row" style={styles.wrap}>
        <Flex value={5} direction="column" justify="start">
          {canEdit ? (
            <Button
              type="transparent"
              text={t('Edit')}
              onPress={this.handleEdit}
              buttonTextStyle={styles.editButtonText}
            />
          ) : null}
          <Text style={styles.title}>{title}</Text>
          <Text>{t('endDate')}</Text>
          <DateComponent date={end_date} />
          <Flex direction="row" align="stretch">
            <Flex direction="column" justify="start">
              <Text>{t('daysLeft')}</Text>
              <Text>5</Text>
            </Flex>
            <Flex direction="column" justify="start">
              <Text>{t('joined')}</Text>
              <Text>4</Text>
            </Flex>
            <Flex direction="column" justify="start">
              <Text>{t('completed')}</Text>
              <Text>3</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex value={2} />
      </Flex>
    );
  }
}

ChallengeDetailHeader.propTypes = {
  challenge: PropTypes.object.isRequired,
  canEditChallenges: PropTypes.bool.isRequired,
  onEdit: PropTypes.func,
  acceptedChallenge: PropTypes.object,
};

export default ChallengeDetailHeader;
