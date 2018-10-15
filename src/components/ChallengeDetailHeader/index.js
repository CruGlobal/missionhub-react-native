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
          <Flex style={styles.section} direction="row" justify="between">
            <Flex direction="column" justify="start">
              <Text style={styles.subHeader}>{t('daysLeft')}</Text>
              <Text style={styles.number}>5</Text>
            </Flex>
            <Flex direction="column" justify="start">
              <Text style={styles.subHeader}>{t('joined')}</Text>
              <Text style={styles.number}>4</Text>
            </Flex>
            <Flex direction="column" justify="start">
              <Text style={styles.subHeader}>{t('completed')}</Text>
              <Text style={styles.number}>3</Text>
            </Flex>
          </Flex>
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
  acceptedChallenge: PropTypes.object,
};

export default ChallengeDetailHeader;
