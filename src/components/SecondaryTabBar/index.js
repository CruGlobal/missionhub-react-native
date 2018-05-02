import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { Flex } from '../common';
// import styles from './styles';
import CustomTabs from '../../containers/CustomTabs';
import ContactSteps from '../../containers/ContactSteps';
import ContactNotes from '../../containers/ContactNotes';
import ContactActions from '../../containers/ContactActions';
import ContactJourney from '../../containers/ContactJourney';
import ImpactView from '../../containers/ImpactView';

import { isAndroid } from '../../utils/common';
import theme from '../../theme';

export default class SecondaryTabBar extends Component {

  state = {
    page: 0,
    notesAreActive: false,
    hideTabBar: false,
  };

  onChangeTab = (index, activeTab) => {
    this.setState({
      page: index,
      notesAreActive: activeTab === 'notes',
    });
  };

  shrinkHeader = () => {
    this.props.onShrinkHeader();
    this.setState({ hideTabBar: true });
  };

  openHeader = () => {
    this.props.onOpenHeader();
    this.setState({ hideTabBar: false });
  };

  renderTabs = (tab) => {
    if (tab.page === 'steps') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactSteps isMe={this.props.isMe} person={this.props.person} contactAssignment={this.props.contactAssignment} organization={this.props.organization} contactStage={this.props.contactStage} onChangeStage={this.props.onChangeStage} />
        </Flex>
      );
    } else if (tab.page === 'journey') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactJourney person={this.props.person} organization={this.props.organization} />
        </Flex>
      );
    } else if (tab.page === 'notes') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactNotes person={this.props.person} isActiveTab={this.state.notesAreActive} onNotesActive={this.shrinkHeader} onNotesInactive={this.openHeader} />
        </Flex>
      );
    } else if (tab.page === 'actions') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ContactActions person={this.props.person} organization={this.props.organization} />
        </Flex>
      );
    } else if (tab.page === 'userImpact') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ImpactView person={this.props.person} organization={this.props.organization} isContactScreen={true} />
        </Flex>
      );
    } else if (tab.page === 'myImpact') {
      return (
        <Flex key={tab.iconName} style={{ backgroundColor: 'white' }} value={1}>
          <ImpactView user={this.props.person} organization={this.props.organization} />
        </Flex>
      );
    }
  };

  render() {
    const { tabs } = this.props;
    const style = { backgroundColor: theme.white, ...isAndroid ? { flex: 1 } : {} };

    return (
      <Flex value={1} self="stretch">
        <ScrollableTabView
          contentProps={{ keyboardShouldPersistTaps: 'handled', style: style }}
          tabBarPosition="top"
          initialPage={0}
          page={isAndroid ? this.state.page : undefined}
          locked={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <CustomTabs isHidden={this.state.hideTabBar} tabArray={tabs} onChangeTab={this.onChangeTab} />}
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
  contactAssignment: PropTypes.object,
  organization: PropTypes.object,
  onShrinkHeader: PropTypes.func,
  onOpenHeader: PropTypes.func,
};
