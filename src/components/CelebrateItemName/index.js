import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '../../components/common';
import { GLOBAL_COMMUNITY_ID } from '../../constants';
import ItemHeaderText from '../../components/ItemHeaderText';
import { navToPersonScreen } from '../../actions/person';

@translate('celebrateFeeds')
class CelebrateItemName extends Component {
  onPressNameLink = () => {
    const {
      dispatch,
      event: { subject_person, organization },
    } = this.props;

    dispatch(navToPersonScreen(subject_person, organization));
  };

  renderName(name) {
    return <ItemHeaderText text={name} />;
  }

  render() {
    const { event, t, pressable } = this.props;
    const { subject_person_name } = event;

    if (!subject_person_name) {
      return this.renderName(t('missionHubUser'));
    }

    if (
      !event.organization ||
      event.organization.id === GLOBAL_COMMUNITY_ID || //TODO move global ID check elsewhere?
      !pressable
    ) {
      return this.renderName(subject_person_name);
    }

    return (
      <Button type="transparent" onPress={this.onPressNameLink}>
        {this.renderName(subject_person_name)}
      </Button>
    );
  }
}

CelebrateItemName.propTypes = {
  event: PropTypes.object.isRequired,
  pressable: PropTypes.bool,
};

export default connect()(CelebrateItemName);
