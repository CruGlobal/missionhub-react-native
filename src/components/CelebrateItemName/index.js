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

  renderName() {
    const {
      t,
      event: { subject_person_name },
    } = this.props;

    return (
      <ItemHeaderText
        text={subject_person_name ? subject_person_name : t('missionHubUser')}
      />
    );
  }

  render() {
    const { event } = this.props;
    const { subject_person_name } = event;

    if (
      !event.organization ||
      event.organization.id === GLOBAL_COMMUNITY_ID ||
      !subject_person_name
    ) {
      return this.renderName();
    }

    return (
      <Button type="transparent" onPress={this.onPressNameLink}>
        {this.renderName()}
      </Button>
    );
  }
}

CelebrateItemName.propTypes = {
  event: PropTypes.object.isRequired,
};

export default connect()(CelebrateItemName);
