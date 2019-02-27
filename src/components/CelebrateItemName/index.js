import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '../../components/common';
import ItemHeaderText from '../../components/ItemHeaderText';
import { navToPersonScreen } from '../../actions/person';

@translate('celebrateFeeds')
class CelebrateItemName extends Component {
  onPressNameLink = () => {
    const { dispatch, person, organization } = this.props;

    dispatch(navToPersonScreen(person, organization));
  };

  render() {
    const { name, t, pressable } = this.props;
    const content = <ItemHeaderText text={name || t('missionHubUser')} />;

    if (!name || !pressable) {
      return content;
    }

    return (
      <Button type="transparent" onPress={this.onPressNameLink}>
        {content}
      </Button>
    );
  }
}

CelebrateItemName.propTypes = {
  name: PropTypes.string,
  person: PropTypes.object,
  organization: PropTypes.object,
  pressable: PropTypes.bool,
};

export default connect()(CelebrateItemName);
