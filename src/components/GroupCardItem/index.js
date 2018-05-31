import React, { Fragment, Component } from 'react';
import { translate } from 'react-i18next';

import Card from '../Card';
import { Text, Flex } from '../common';

@translate('groupCardItem')
export default class GroupCardItem extends Component {
  render() {
    const { t, name, contacts, unassigned, uncontacted } = this.props;
    return (
      <Card>
        <Flex>
          <Text style={{ fontSize: 20 }}>{name}</Text>
          <Flex align="center" direction="row">
            <Text>{t('contacts', { number: contacts })}</Text>
            {unassigned ? (
              <Fragment>
                <Text>{'  ·  '}</Text>
                <Text>{t('unassigned', { number: unassigned })}</Text>
              </Fragment>
            ) : null}
            {uncontacted ? (
              <Fragment>
                <Text>{'  ·  '}</Text>
                <Text>{t('uncontacted', { number: uncontacted })}</Text>
              </Fragment>
            ) : null}
          </Flex>
        </Flex>
      </Card>
    );
  }
}
