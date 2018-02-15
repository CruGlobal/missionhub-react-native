import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Flex } from '../common';
// import styles from './styles';
import CustomTabs from '../../containers/CustomTabs';
import ContactSteps from '../../containers/ContactSteps';
import ContactNotes from '../../containers/ContactNotes';
import ContactJourney from '../../containers/ContactJourney';
import ImpactView from '../../containers/ImpactView';

import { isAndroid } from '../../utils/common';

export default class SecondaryTabBar extends Component {

  constructor(props) {
    super(props);

    this.state = { page: 0, notesAreActive: false };

    this.renderTabs = this.renderTabs.bind(this);
  }

  onChangeTab = (index, activeTab) => {
    this.setState({
      page: index,
      notesAreActive: activeTab === 'notes',
    });
  };

  renderTabs(tab) {
    if (tab.page === 'steps') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactSteps isMe={this.props.isMe} person={this.props.person} />
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
          page={isAndroid ? this.state.page : undefined}
          locked={true}
          prerenderingSiblingsNumber={1}
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
