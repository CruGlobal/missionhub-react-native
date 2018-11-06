import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Dot } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';

import styles from './styles';

@translate('groupItem')
export default class GroupMemberItem extends Component {
  handleSelect = () => this.props.onSelect(this.props.person);

  renderContent() {
    const { person, t, isUserCreatedOrg } = this.props;

    return (
      <Flex justify="center" direction="row" style={styles.row}>
        <Flex value={1} direction="column">
          <Text style={styles.name}>{person.full_name.toUpperCase()}</Text>
          {!isUserCreatedOrg ? (
            <Flex align="center" direction="row" style={styles.detailsWrap}>
              <Text style={styles.assigned}>
                {t('numAssigned', { number: person.contact_count || 0 })}
              </Text>
              {person.uncontacted_count ? (
                <Fragment>
                  <Dot style={styles.assigned} />
                  <Text style={styles.uncontacted}>
                    {t('numUncontacted', { number: person.uncontacted_count })}
                  </Text>
                </Fragment>
              ) : null}
            </Flex>
          ) : null}
        </Flex>
        <MemberOptionsMenu />
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

GroupMemberItem.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string.isRequired,
    contact_count: PropTypes.number,
    uncontacted_count: PropTypes.number,
  }).isRequired,
  myOrgPermissions: PropTypes.object.isRequired,
  personOrgPermissions: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  isUserCreatedOrg: PropTypes.bool,
};

const mapStateToProps = (_, { person, organization })({
  personOrgPermissions: orgPermissionSelector(null, {
    person,
    organization,
  }),
  isUserCreatedOrg: organization.user_created,
});
