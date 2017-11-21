import React, {Component} from 'react';
import {connect} from 'react-redux';
import {navigatePush} from '../../actions/navigation';
import {View, Image} from 'react-native';
import {getStages} from '../../actions/stages';
import {selectStage} from '../../actions/selectStage';

import Carousel from 'react-native-snap-carousel';
import styles from './styles';
import {Flex, Text, Button} from '../../components/common';
import BackButton from '../BackButton';
import theme from '../../theme';

const sliderWidth = theme.fullWidth;
const stageWidth = theme.fullWidth - 120;
const stageMargin = theme.fullWidth / 30;

class StageScreen extends Component {

  constructor(props) {
    super(props);

    this.renderStage = this.renderStage.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getStages());
  }

  setStage(id) {
    this.props.dispatch(selectStage(id));
    this.props.dispatch(navigatePush('StageSuccess'));
  }

  renderStage({item}) {
    return (
      <View key={item.id} style={styles.cardWrapper}>
        <View style={styles.card}>
          <Image source={require('../../../assets/images/Forgiven.png')} />
          <Text type="header" style={styles.cardHeader}>{item.name.toLowerCase()}</Text>
          <Text style={styles.cardText}>{item.description}</Text>
        </View>
        <Button
          type="primary"
          onPress={() => this.setStage(item.id)}
          text="I AM HERE"
        />
      </View>
    );
  }

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <BackButton />
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={styles.title}>
            {this.props.firstName}, which stage best describes where you are on your journey?
          </Text>
          {
            this.props.stages ? (
              <Carousel
                data={this.props.stages}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                renderItem={this.renderStage}
                sliderWidth={sliderWidth + 75}
                itemWidth={stageWidth + stageMargin * 2}
              />
            ) : null
          }
        </View>
      </Flex>
    );
  }

}

const mapStateToProps = ({profile, stages}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
  stages: stages.stages,
});

export default connect(mapStateToProps)(StageScreen);
