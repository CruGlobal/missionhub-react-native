import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable, Dot, Card } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsUserCreated } from '../../utils/common';

import styles from './styles';

@translate('groupItem')
class GroupMemberItem extends Component {
  handleSelect = () => this.props.onSelect(this.props.person);

  render() {
    const {
      onSelect,
      person,
      t,
      isUserCreatedOrg,
      myId,
      myOrgPermissions,
      personOrgPermissions,
    } = this.props;

    return (
      <Card onPress={this.handleSelect}>
        <Flex justify="center" direction="row" style={styles.content}>
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
                      {t('numUncontacted', {
                        number: person.uncontacted_count,
                      })}
                    </Text>
                  </Fragment>
                ) : null}
              </Flex>
            ) : null}
          </Flex>
          <MemberOptionsMenu
            myId={myId}
            personId={person.id}
            myOrgPermissions={myOrgPermissions}
            personOrgPermissions={personOrgPermissions}
          />
        </Flex>
      </Card>
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
  myId: PropTypes.string.isRequired,
  myOrgPermissions: PropTypes.object.isRequired,
  personOrgPermissions: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  isUserCreatedOrg: PropTypes.bool,
};

const mapStateToProps = (_, { person, organization }) => ({
  personOrgPermissions: orgPermissionSelector(null, {
    person,
    organization,
  }),
  isUserCreatedOrg: orgIsUserCreated(organization),
});

export default connect(mapStateToProps)(GroupMemberItem);
