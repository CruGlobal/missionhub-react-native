import React, { Fragment, Component } from 'react';
import { translate } from 'react-i18next';

import Card from '../Card';
import { Text, Flex } from '../common';

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
        <Flex>
          <Text style={{ fontSize: 20 }}>{group.name}</Text>
          <Flex align="center" direction="row">
            <Text>{t('contacts', { number: group.contacts })}</Text>
            {group.unassigned ? (
              <Fragment>
                <Text>{'  ·  '}</Text>
                <Text>{t('unassigned', { number: group.unassigned })}</Text>
              </Fragment>
            ) : null}
            {group.uncontacted ? (
              <Fragment>
                <Text>{'  ·  '}</Text>
                <Text>{t('uncontacted', { number: group.uncontacted })}</Text>
              </Fragment>
            ) : null}
          </Flex>
        </Flex>
      </Card>
    );
  }
}
