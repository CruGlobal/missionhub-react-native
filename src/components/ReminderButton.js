import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import theme from '../theme';

import { Flex, Touchable, Icon, Text } from './common';

@translate()
class ReminderButton extends Component {
  render() {
    const { t } = this.props;

    return (
      <Touchable>
        <Flex
          align="center"
          justify="start"
          style={{
            borderColor: theme.extraLightGrey,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            paddingHorizontal: 30,
          }}
          direction="row"
        >
          <Icon
            name="bellIcon"
            type="MissionHub"
            style={{
              padding: 10,
              fontSize: 35,
              color: theme.secondaryColor,
            }}
          />
          <Text
            style={{
              color: theme.secondaryColor,
              fontSize: 16,
            }}
          >
            {t('addStep:setReminder')}
          </Text>
        </Flex>
      </Touchable>
    );
  }
}

export default connect()(ReminderButton);
