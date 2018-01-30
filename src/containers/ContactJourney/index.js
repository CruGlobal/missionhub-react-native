import React, { Component } from 'react';
import { View, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { getJourney } from '../../actions/journey';
import { Flex, Button, Separator, Text } from '../../components/common';
import JourneyItem from '../../components/JourneyItem';
import RowSwipeable from '../../components/RowSwipeable';
import NULL from '../../../assets/images/ourJourney.png';
import { addNewComment } from '../../actions/interactions';

@translate('contactJourney')
class ContactJourney extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      journey: [],
    };

    this.renderRow = this.renderRow.bind(this);
    this.handleAddStep = this.handleAddStep.bind(this);
    this.handleCreateInteraction = this.handleCreateInteraction.bind(this);
    this.handleEditInteraction = this.handleEditInteraction.bind(this);
  }

  componentWillMount() {
    this.getInteractions();
  }

  getInteractions() {
    const orgIdExists = !!this.getOrganization();
    const isPersonal = !this.props.isCasey && orgIdExists;
    
    this.props.dispatch(getJourney(this.props.person.id, isPersonal)).then((items) => {
      LOG('journey items', items);
      this.setState({
        journey: items,
        isLoading: false,
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }

  getOrganization() {
    const { person } = this.props;
    if (person.organizational_permissions && person.organizational_permissions.length > 0) {
      return person.organizational_permissions[0].id;
    }
    return undefined;
  }

  handleEditInteraction(interaction) {
    LOG(interaction);
  }

  handleAddStep(text) {
    const { person } = this.props;
    const orgId = this.getOrganization();

    this.props.dispatch(addNewComment(person.id, text, orgId)).then(() => {
      // Add new comment to journey
      this.getInteractions();
    });
  }

  handleCreateInteraction() {
    this.props.dispatch(navigatePush('AddStep', {
      onComplete: this.handleAddStep,
      type: 'journey',
    }));
  }

  renderRow({ item }) {
    const { isCasey } = this.props;
    if (isCasey) {
      return (
        <RowSwipeable
          key={item.id}
          onEdit={() => this.handleEditInteraction(item)}
        >
          <JourneyItem item={item} type={item.type} />
        </RowSwipeable>
      );
    }
    return <JourneyItem item={item} type={item.type} />;
  }

  renderList() {
    const { journey } = this.state;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={journey}
        keyExtractor={(i) => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        ItemSeparatorComponent={(sectionID, rowID) => <Separator key={rowID} />}
      />
    );
  }

  renderNull() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Image source={NULL} />
        <Text type="header" style={styles.nullHeader}>{t('ourJourney').toUpperCase()}</Text>
        <Text style={styles.nullText}>{t('journeyNull')}</Text>
      </Flex>
    );
  }

  renderLoading() {
    const { t } = this.props;
    return (
      <Flex align="center" justify="center">
        <Text type="header" style={styles.nullText}>{t('loading')}</Text>
      </Flex>
    );
  }

  renderContent() {
    const { journey, isLoading } = this.state;
    if (isLoading) return this.renderLoading();
    if (journey.length === 0) this.renderNull();
    return this.renderList();
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {this.renderContent()}
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={this.handleCreateInteraction}
            text={t('addComment').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

ContactJourney.propTypes = {
  person: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth }) => ({
  isCasey: !auth.isJean,
});

export default connect(mapStateToProps)(ContactJourney);
