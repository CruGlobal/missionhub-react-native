import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable } from '../common';

import styles from './styles';

@translate('groupItem')
class ContactItem extends Component {
  handleSelect = () => {
    this.props.onSelect(this.props.contact);
  };
  render() {
    const { contact, t } = this.props;
    return (
      <Touchable onPress={this.handleSelect} highlight={true}>
        <Flex align="center" direction="row" style={styles.row}>
          <Flex value={1} justify="center" direction="column">
            <Text style={styles.name}>{contact.full_name}</Text>
          </Flex>
          {contact.isAssigned ? null : (
            <Text style={styles.unassigned}>{t('unassigned')}</Text>
          )}
        </Flex>
      </Touchable>
    );
  }
}

ContactItem.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    isAssigned: PropTypes.bool,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ContactItem;
