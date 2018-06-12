import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable } from '../common';

import styles from './styles';

@translate('groupItem')
class GroupMemberItem extends Component {
  handleSelect = () => {
    this.props.onSelect(this.props.person);
  };

  render() {
    const { person, t } = this.props;
    return (
      <Touchable onPress={this.handleSelect} highlight={true}>
        <Flex justify="center" style={styles.row}>
          <Text style={styles.name}>{person.full_name.toUpperCase()}</Text>
          <Flex align="center" direction="row" style={styles.detailsWrap}>
            <Text style={styles.assigned}>
              {t('numAssigned', { number: person.assignedNum })}
            </Text>
            {person.uncontactedNum ? (
              <Fragment>
                <Text style={styles.assigned}>{'  ·  '}</Text>
                <Text style={styles.uncontacted}>
                  {t('numUncontacted', { number: person.uncontactedNum })}
                </Text>
              </Fragment>
            ) : null}
          </Flex>
        </Flex>
      </Touchable>
    );
  }
}

GroupMemberItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    assignedNum: PropTypes.number,
    uncontactedNum: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default GroupMemberItem;
