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
    const { t, item, onEdit } = this.props;
    const {
      title,
      end_date,
      accepted_count,
      completed_count,
      accepted_at, // TODO: Still waiting on the API to give a field like this
      isPast,
      created_at,
      completed_at,
    } = item;

    // Total days or days remaining
    const days = isPast
      ? moment(end_date).diff(moment(created_at), 'days')
      : moment(end_date).diff(moment(), 'days');

    const canEdit = !isPast && onEdit;
    const canJoin = !isPast && !accepted_at;
    const showCheck = accepted_at;

    let daysText = t(isPast ? 'totalDays' : 'daysRemaining', { count: days });
    if (days <= 0) {
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
  onEdit: PropTypes.func,
};

export default ChallengeItem;
