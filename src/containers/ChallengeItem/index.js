import React, { Component, Fragment } from 'react';
// import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Card, Text, Flex, Button } from '../../components/common';
// import { trackActionWithoutData } from '../../actions/analytics';
// import GREY_HEART from '../../../assets/images/heart-grey.png';
// import BLUE_HEART from '../../../assets/images/heart-blue.png';

import styles from './styles';

@translate('challengeFeeds')
class ChallengeItem extends Component {
  handleEdit = () => {
    const { item, onEdit, dispatch } = this.props;
    onEdit(item);
    // !event.liked && dispatch(trackActionWithoutData(ACTIONS.ITEM_LIKED));
  };

  render() {
    const { item } = this.props;
    const {
      title,
      // end_date,
      accepted,
      completed,
      days_remaining,
    } = item;

    const canEdit = true;

    // TODO: Translations
    return (
      <Card style={styles.card}>
        <Flex value={1} direction="column">
          <Text style={styles.title}>{title}</Text>
          <Flex direction="row" align="center">
            {canEdit ? (
              <Fragment>
                <Button
                  key="infoEdit"
                  type="transparent"
                  text="Edit"
                  onPress={this.handleEdit}
                  style={styles.icon}
                />
                <Dot />
              </Fragment>
            ) : null}
            <Text style={styles.info}>{days_remaining} Days Left</Text>
            <Dot />
            <Text style={styles.info}>{accepted} Accepted</Text>
            <Dot />
            <Text style={styles.info}>{completed} Completed</Text>
          </Flex>
        </Flex>
      </Card>
    );
  }
}

function Dot() {
  return <Text style={styles.dot}>{'  ·  '}</Text>;
}

ChallengeItem.propTypes = {
  item: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onJoin: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default connect()(ChallengeItem);
