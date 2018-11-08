import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Card, Text, Flex, Button, Icon } from '../../components/common';
import ChallengeStats from '../ChallengeStats';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeItem extends Component {
  handleJoin = () => {
    const { item, onJoin } = this.props;
    onJoin(item);
  };
  handleComplete = () => {
    const { item, onComplete } = this.props;
    onComplete(item);
  };
  handleSelect = () => {
    const { item, onSelect } = this.props;
    onSelect(item);
  };

  render() {
    const { t, item, acceptedChallenge } = this.props;
    const { title, isPast } = item;

    const joined = !!acceptedChallenge;
    const completed = !!(acceptedChallenge && acceptedChallenge.completed_at);
    const showButton = !isPast && !completed;

    return (
      <Card style={styles.card}>
        <Button
          type="transparent"
          style={styles.detailButton}
          onPress={this.handleSelect}
        >
          <Flex value={1} style={styles.content} direction="row" align="center">
            <Flex value={5} direction="column">
              <Text style={styles.title}>{title}</Text>
              <ChallengeStats
                challenge={item}
                small={true}
                style={styles.statsSection}
              />
            </Flex>
            <Flex value={1} align="end" justify="center">
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
            text={t(joined ? 'iDidIt' : 'join').toUpperCase()}
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
  onSelect: PropTypes.func,
  acceptedChallenge: PropTypes.object,
};

export default ChallengeItem;
