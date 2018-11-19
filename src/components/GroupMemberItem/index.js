import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Dot, Card } from '../common';
import MemberOptionsMenu from '../MemberOptionsMenu';
import { orgPermissionSelector } from '../../selectors/people';
import { orgIsUserCreated, isAdminOrOwner, isOwner } from '../../utils/common';

import styles from './styles';

@translate('groupItem')
class GroupMemberItem extends Component {
  handleSelect = () => {
    const { onSelect, person } = this.props;
    onSelect && onSelect(person);
  };

  render() {
    const {
      t,
      myId,
      person,
      organization,
      iAmAdmin,
      iAmOwner,
      personIsAdmin,
      personIsOwner,
      isUserCreatedOrg,
      personOrgPermission,
    } = this.props;

    const isMe = person.id === myId;
    const showOptionsMenu = isMe || (iAmAdmin && !personIsOwner);

    return (
      <Card onPress={this.handleSelect}>
        <Flex
          justify="center"
          align="center"
          direction="row"
          style={styles.content}
        >
          <Flex value={1} direction="column">
            <Text style={styles.name}>{person.full_name.toUpperCase()}</Text>
            {!isUserCreatedOrg ? (
              <Flex align="center" direction="row" style={styles.detailsWrap}>
                <Text style={styles.assigned}>
                  {t('numAssigned', { count: person.contact_count || 0 })}
                </Text>
                {person.uncontacted_count ? (
                  <Fragment>
                    <Dot style={styles.assigned} />
                    <Text style={styles.uncontacted}>
                      {t('numUncontacted', {
                        count: person.uncontacted_count,
                      })}
                    </Text>
                  </Fragment>
                ) : null}
              </Flex>
            ) : null}
          </Flex>
          {showOptionsMenu ? (
            <MemberOptionsMenu
              myId={myId}
              person={person}
              organization={organization}
              personOrgPermission={personOrgPermission}
              iAmAdmin={iAmAdmin}
              iAmOwner={iAmOwner}
              personIsAdmin={personIsAdmin}
            />
          ) : null}
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
  organization: PropTypes.object.isRequired,
  myId: PropTypes.string.isRequired,
  myOrgPermission: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
};

const mapStateToProps = (_, { person, organization, myOrgPermission }) => {
  const personOrgPermission = orgPermissionSelector(null, {
    person,
    organization,
  });

  return {
    iAmAdmin: isAdminOrOwner(myOrgPermission),
    iAmOwner: isOwner(myOrgPermission),
    personIsAdmin: isAdminOrOwner(personOrgPermission),
    personIsOwner: isOwner(personOrgPermission),
    isUserCreatedOrg: orgIsUserCreated(organization),
    personOrgPermission,
  };
};

export default connect(mapStateToProps)(GroupMemberItem);
