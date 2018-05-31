import React, { Fragment, Component } from 'react';
import { translate } from 'react-i18next';

import Card from '../Card';
import { Text, Flex } from '../common';

import styles from './styles';

@translate('groupCardItem')
export default class GroupCardItem extends Component {
  handlePress = () => {
    const { onPress, group } = this.props;
    onPress(group);
  };

  render() {
    const { t, group } = this.props;
    return (
      <Card onPress={this.handlePress}>
        <Flex style={styles.container}>
          <Text style={styles.groupName}>{group.name.toUpperCase()}</Text>
          <Flex align="center" direction="row" style={styles.contactRow}>
            <Text style={styles.contacts}>
              {t('contacts', { number: group.contacts })}
            </Text>
            {group.unassigned ? (
              <Fragment>
                <Text style={styles.contact}>{'  ·  '}</Text>
                <Text style={styles.unassigned}>
                  {t('unassigned', { number: group.unassigned })}
                </Text>
              </Fragment>
            ) : null}
            {group.uncontacted ? (
              <Fragment>
                <Text style={styles.contact}>{'  ·  '}</Text>
                <Text style={styles.unassigned}>
                  {t('uncontacted', { number: group.uncontacted })}
                </Text>
              </Fragment>
            ) : null}
          </Flex>
        </Flex>
      </Card>
    );
  }
}
