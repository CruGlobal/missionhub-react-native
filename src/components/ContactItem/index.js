import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable } from '../common';

import styles from './styles';

@translate('groupItem')
class ContactItem extends Component {
  handleSelect = () => {
    const { onSelect, contact } = this.props;
    onSelect && onSelect(contact);
  };

  renderContent() {
    const {
      contact,
      organization,
      t,
      hideUnassigned,
      nameTextStyle = {},
      lastNameAccentStyle = {},
    } = this.props;
    const isAssigned = (contact.reverse_contact_assignments || []).find(
      c => c.organization && c.organization.id === organization.id,
    );

    return (
      <Flex align="center" direction="row" style={styles.row}>
        <Flex value={1} justify="start" direction="row">
          <Fragment>
            <Text style={[styles.name, nameTextStyle]}>
              {contact.first_name}
            </Text>
            {contact.last_name ? (
              <Text style={[styles.name, nameTextStyle, lastNameAccentStyle]}>
                {` ${contact.last_name}`}
              </Text>
            ) : null}
          </Fragment>
        </Flex>
        {isAssigned || hideUnassigned ? null : (
          <Text style={styles.unassigned}>{t('unassigned')}</Text>
        )}
      </Flex>
    );
  }

  render() {
    const { onSelect } = this.props;

    return onSelect ? (
      <Touchable onPress={this.handleSelect} highlight={true}>
        {this.renderContent()}
      </Touchable>
    ) : (
      this.renderContent()
    );
  }
}

ContactItem.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string,
    reverse_contact_assignments: PropTypes.array.isRequired,
  }).isRequired,
  organization: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  hideUnassigned: PropTypes.bool,
  nameTextStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  lastNameAccentStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
};

export default ContactItem;
