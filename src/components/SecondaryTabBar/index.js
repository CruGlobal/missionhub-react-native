import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Flex } from '../common';
// import styles from './styles';
import CustomTabs from '../CustomTabs';
import ContactSteps from '../../containers/ContactSteps';
import ContactNotes from '../../containers/ContactNotes';
import ContactJourney from '../../containers/ContactJourney';
import ImpactView from '../../containers/ImpactView';

export default class SecondaryTabBar extends Component {

  constructor(props) {
    super(props);

    this.state = { notesAreActive: false };

    this.renderTabs = this.renderTabs.bind(this);
  }

  onChangeTab = (activeTab) => {
    this.setState({ notesAreActive: activeTab === 'notes' });
  };

  renderTabs(tab) {
    if (tab.page === 'steps') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactSteps person={this.props.person} />
        </Flex>
      );
    } else if (tab.page === 'journey') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactJourney person={this.props.person} />
        </Flex>
      );
    } else if (tab.page === 'notes') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactNotes person={this.props.person} isActiveTab={this.state.notesAreActive} />
        </Flex>
      );
    } else if (tab.page === 'actions') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactNotes person={this.props.person} />
        </Flex>
      );
    } else if (tab.page === 'userImpact') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ImpactView user={this.props.person} isContactScreen={true} />
        </Flex>
      );
    }
  }

  render() {
    const { tabs } = this.props;

    return (
      <Flex value={1} self="stretch" >
        <ScrollableTabView
          contentProps={{ keyboardShouldPersistTaps: 'handled' }}
          tabBarPosition="top"
          initialPage={0}
          locked={true}
          renderTabBar={() => <CustomTabs tabArray={tabs} onChangeTab={this.onChangeTab} />}
        >
          {
            tabs.map(this.renderTabs)
          }
        </ScrollableTabView>
      </Flex>
    );
  }
}

SecondaryTabBar.propTypes = {
  tabs: PropTypes.array.isRequired,
  person: PropTypes.object.isRequired,
};
