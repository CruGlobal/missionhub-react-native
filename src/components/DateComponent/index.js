import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isString, momentUtc } from '../../utils/common';
import Text from '../Text';

export default class DateComponent extends Component {
  render() {
    const { date, format, ...rest } = this.props;
    let text;
    if (isString(date) && date.indexOf('UTC') >= 0) {
      text = momentUtc(date).local().format(format);
    } else {
      text = moment(date).format(format);
    }
    return (
      <Text {...rest}>
        {text}
      </Text>
    );
  }
}

DateComponent.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  format: PropTypes.string,
};

DateComponent.defaultProps = {
  format: 'ddd, lll',
};
