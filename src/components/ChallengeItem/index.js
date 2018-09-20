import React, { Component, Fragment } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card, Text, Flex, Button, Dot } from '../../components/common';
import GREY_CHECK from '../../../assets/images/check-grey.png';
import BLUE_CHECK from '../../../assets/images/check-blue.png';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeItem extends Component {
  handleEdit = () => {
    const { item, onEdit } = this.props;
    onEdit && onEdit(item);
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
    const { t, item, acceptedChallenge, onEdit } = this.props;
    const {
      title,
      end_date,
      accepted_count,
      completed_count,
      isPast,
      created_at,
    } = item;

    // Total days or days remaining
    const endDate = moment(end_date).endOf('day');
    const today = moment().endOf('day');
    // If it's past, make sure it shows "1 day challenge instead of 0 day challenge"
    const days = isPast
      ? endDate.diff(moment(created_at).endOf('day'), 'days') + 1
      : endDate.diff(today, 'days');

    const canEdit = !isPast && onEdit;
    const canJoin = !isPast && !acceptedChallenge;
    const showCheck = !!acceptedChallenge;
    const completed =
      acceptedChallenge && acceptedChallenge.completed_at ? true : false;

    let daysText = t(isPast ? 'totalDays' : 'daysRemaining', { count: days });
    if (!isPast && days <= 0) {
      daysText = t('dates.today');
    }

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
              <Text style={styles.info}>{daysText}</Text>
              <Dot style={styles.dot} />
              <Text style={styles.info}>
                {t('accepted', { count: accepted_count })}
              </Text>
              {completed_count ? (
                <Fragment>
                  <Dot style={styles.dot} />
                  <Text style={styles.info}>
                    {t('completed', { count: completed_count })}
                  </Text>
                </Fragment>
              ) : null}
            </Flex>
          </Flex>
          {showCheck ? (
            <Button
              disabled={isPast || completed}
              onPress={this.handleComplete}
              style={styles.completeIcon}
            >
              <Image source={completed ? BLUE_CHECK : GREY_CHECK} />
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
  onEdit: PropTypes.func,
  acceptedChallenge: PropTypes.object,
};

export default ChallengeItem;
