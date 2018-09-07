import React, { Component, Fragment } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Card, Text, Flex, Button, Dot } from '../../components/common';
import GREY_CHECK from '../../../assets/images/check-grey.png';
import BLUE_CHECK from '../../../assets/images/check-blue.png';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeItem extends Component {
  handleEdit = () => {
    const { item, onEdit } = this.props;
    onEdit(item);
  };
  handleJoin = () => {
    const { item, onJoin } = this.props;
    onJoin(item);
  };
  handleComplete = () => {
    const { item, onComplete } = this.props;
    onComplete(item);
  };

  render() {
    const { t, item } = this.props;
    const {
      title,
      // end_date,
      accepted,
      completed,
      days_remaining,
      accepted_at,
      isPast,
      total_days,
      completed_at,
    } = item;

    // TODO: Find out how to determine this
    const canEdit = !isPast;
    const canJoin = !isPast && !accepted_at;
    const showCheck = accepted_at;

    return (
      <Card style={[styles.card, canJoin ? styles.joinCard : null]}>
        <Flex value={1} style={styles.content} direction="row" align="center">
          <Flex value={1} direction="column">
            <Text style={styles.title}>{title}</Text>
            <Flex direction="row" align="center" wrap="wrap">
              {canEdit ? (
                <Fragment>
                  <Button
                    type="transparent"
                    text={t('edit')}
                    onPress={this.handleEdit}
                    buttonTextStyle={styles.editButtonText}
                  />
                  <Dot style={styles.dot} />
                </Fragment>
              ) : null}
              <Text style={styles.info}>
                {t(isPast ? 'totalDays' : 'daysRemaining', {
                  days: isPast ? total_days : days_remaining,
                })}
              </Text>
              <Dot style={styles.dot} />
              <Text style={styles.info}>
                {t('accepted', { count: accepted })}
              </Text>
              {completed ? (
                <Fragment>
                  <Dot style={styles.dot} />
                  <Text style={styles.info}>
                    {t('completed', { count: completed })}
                  </Text>
                </Fragment>
              ) : null}
            </Flex>
          </Flex>
          {showCheck ? (
            <Button
              disabled={!!completed_at}
              onPress={this.handleComplete}
              style={styles.completeIcon}
            >
              <Image source={completed_at ? BLUE_CHECK : GREY_CHECK} />
            </Button>
          ) : null}
        </Flex>
        {canJoin ? (
          <Button
            type="primary"
            style={styles.joinButton}
            buttonTextStyle={styles.joinButtonText}
            text={t('join').toUpperCase()}
            onPress={this.handleJoin}
          />
        ) : null}
      </Card>
    );
  }
}

ChallengeItem.propTypes = {
  item: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ChallengeItem;
