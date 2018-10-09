import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Card, Text, Flex, Button, Dot, Icon } from '../../components/common';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeItem extends Component {
  handleEdit = () => {
    const { item, onEdit } = this.props;
    onEdit && onEdit(item);
  };
  handleSelect = () => {
    const { item, onSelect } = this.props;
    onSelect(item);
  };
  handleJoin = () => {
    const { item, onJoin } = this.props;
    onJoin(item);
  };
  handleComplete = () => {
    const { item, onComplete } = this.props;
    onComplete(item);
  };

  cardStyle = (completed, isPast, joined) => {
    const additionalStyle = completed
      ? styles.joinedCard
      : isPast
        ? null
        : joined
          ? styles.joinedCard
          : styles.unjoinedCard;
    return [styles.card, additionalStyle];
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
    const joined = !!acceptedChallenge;
    const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);
    const showButton = !isPast && !completed;

    let daysText = t(isPast ? 'totalDays' : 'daysRemaining', { count: days });
    if (!isPast && days <= 0) {
      daysText = t('dates.today');
    }

    return (
      <Card style={this.cardStyle(completed, isPast, joined)}>
        <Button
          type="transparent"
          style={styles.detailButton}
          onPress={this.handleSelect}
        >
          <Flex value={1} style={styles.content} direction="row" align="center">
            <Flex value={5} direction="column">
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
            <Flex value={1} align="center" justify="center">
              {completed ? (
                <Flex value={0}>
                  <Icon
                    style={styles.checkIcon}
                    name={'checkIcon'}
                    type={'MissionHub'}
                  />
                </Flex>
              ) : null}
            </Flex>
          </Flex>
        </Button>
        {showButton ? (
          <Button
            type="primary"
            style={joined ? styles.completeButton : styles.joinButton}
            buttonTextStyle={styles.joinCompleteButtonText}
            text={t(joined ? 'complete' : 'join').toUpperCase()}
            onPress={joined ? this.handleComplete : this.handleJoin}
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
  onSelect: PropTypes.func,
  acceptedChallenge: PropTypes.object,
};

export default ChallengeItem;
