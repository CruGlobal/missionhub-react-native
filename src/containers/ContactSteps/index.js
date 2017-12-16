import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { getMySteps } from '../../actions/steps';

import styles from './styles';
import { Flex, Button } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';

@translate('contactSteps')
class ContactSteps extends Component {

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getMySteps());
  }

  componentDidMount() {
  }


  renderRow({ item }) {
    return (
      <RowSwipeable
        key={item.id}
        onDelete={() => this.handleRemoveReminder(item)}
        onComplete={() => this.handleCompleteReminder(item)}
      >
        <StepItem step={item} type="listSwipeable" />
      </RowSwipeable>
    );
  }

  renderList() {
    const { steps } = this.props;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={styles.list}
        data={steps}
        keyExtractor={(i) => i.id}
        renderItem={this.renderRow}
        bounces={true}
        showsVerticalScrollIndicator={false}
        onScroll={this.handleScroll}
        scrollEventThrottle={100}
      />
    );
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {this.renderList()}
        </Flex>
        <Flex justify="end">
          <Button
            type="secondary"
            onPress={()=>{}}
            text={t('addStep').toUpperCase()}
          />
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = ({ steps }) => ({
  steps: steps.mine,
});

export default connect(mapStateToProps)(ContactSteps);
