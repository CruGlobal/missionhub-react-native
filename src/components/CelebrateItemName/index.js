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
    const { dispatch, person, organization } = this.props;

    dispatch(navToPersonScreen(person, organization));
  };

  renderName(text) {
    return <ItemHeaderText text={text} />;
  }

  render() {
    const { name, organization, t, pressable } = this.props;

    if (!name) {
      return this.renderName(t('missionHubUser'));
    }

    if (
      !organization ||
      organization.id === GLOBAL_COMMUNITY_ID || //TODO move global ID check elsewhere?
      !pressable
    ) {
      return this.renderName(name);
    }

    return (
      <Button type="transparent" onPress={this.onPressNameLink}>
        {this.renderName(name)}
      </Button>
    );
  }
}

CelebrateItemName.propTypes = {
  person: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  pressable: PropTypes.bool,
};

export default connect()(CelebrateItemName);
