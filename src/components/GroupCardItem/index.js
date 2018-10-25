import React, { Fragment, Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text, Flex, Dot, Card } from '../common';

import styles from './styles';

@translate('groupItem')
export default class GroupCardItem extends Component {
  handlePress = () => {
    const { onPress, group } = this.props;
    onPress(group);
  };

  render() {
    const { t, group } = this.props;
    const { contactsCount, unassignedCount, uncontactedCount } =
      group.contactReport || {};
    const { user_created } = group;

    return (
      <Card onPress={this.handlePress} style={styles.card}>
        <Flex>
          <Text style={styles.groupName}>{group.name.toUpperCase()}</Text>
          <Flex align="center" direction="row" style={styles.contactRow}>
            {user_created ? (
              <Text style={styles.contacts}>
                {t('numMembers', { number: contactsCount })}
              </Text>
            ) : contactsCount ? (
              <Fragment>
                <Text style={styles.contacts}>
                  {t('numContacts', { number: contactsCount })}
                </Text>
                {unassignedCount ? (
                  <Fragment>
                    <Dot />
                    <Text style={styles.unassigned}>
                      {t('numUnassigned', {
                        number: unassignedCount,
                      })}
                    </Text>
                  </Fragment>
                ) : null}
                {uncontactedCount ? (
                  <Fragment>
                    <Dot />
                    <Text style={styles.unassigned}>
                      {t('numUncontacted', {
                        number: uncontactedCount,
                      })}
                    </Text>
                  </Fragment>
                ) : null}
              </Fragment>
            ) : null}
          </Flex>
        </Flex>
      </Card>
    );
  }
}

GroupCardItem.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    contactReport: PropTypes.object.isRequired,
    user_created: PropTypes.bool,
  }).isRequired,
};
