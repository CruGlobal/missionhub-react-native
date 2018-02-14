import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image } from 'react-native';
import { translate } from 'react-i18next';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import styles from './styles';
import { Text, Button, Flex } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import theme from '../../theme';
import ONBOARDING_1 from '../../../assets/images/onboarding1.png';
import ONBOARDING_2 from '../../../assets/images/onboarding2.png';
import ONBOARDING_3 from '../../../assets/images/onboarding3.png';
import { KEY_LOGIN_SCREEN } from '../KeyLoginScreen';

const sliderWidth = theme.fullWidth;

const ONBOARDING = [
  {
    id: 1,
    name: 'handcraft your faith journey',
    description: 'Choose your own steps of faith and MissionHub helps you stay focused on the people you care about.',
    image: ONBOARDING_1,
  },
  {
    id: 2,
    name: 'take your relationships deeper',
    description: 'MissionHub helps you grow closer to God by helping others experience Him.',
    image: ONBOARDING_2,
  },
  {
    id: 3,
    name: 'record your journey with God',
    description: 'MissionHub remembers every step of faith you\'ve taken so you can see what God is doing.',
    image: ONBOARDING_3,
  },
];

@translate('login')
class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
    };

    this.renderOnboarding = this.renderOnboarding.bind(this);
    this.getStarted = this.getStarted.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    this.navigateToNext(KEY_LOGIN_SCREEN);
  }

  getStarted() {
    this.navigateToNext('LoginOptions');
  }

  navigateToNext(nextScreen) {
    this.props.dispatch(navigatePush(nextScreen));
  }

  renderOnboarding({ item }) {
    return (
      <View key={item.id} style={styles.onboardWrap}>
        <Flex direction="column">
          <Flex value={1.5} justify="center">
            <Text type="header" style={styles.onboardHeader}>{item.name.toLowerCase()}</Text>
            <Text style={styles.onboardText}>{item.description}</Text>
          </Flex>
          <Flex value={1} align="start" justify="end">
            <Image source={item.image} style={styles.onboardImage} />
          </Flex>
        </Flex>
      </View>
    );
  }

  render() {

    return (
      <Flex style={styles.container}>
        <Flex value={3} align="center" justify="center">
          <Flex value={4} align="center">
            <Pagination
              dotsLength={3}
              activeDotIndex={this.state.activeSlide}
              containerStyle={{ marginTop: 30 }}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: theme.primaryColor,
              }}
              inactiveDotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 0,
                backgroundColor: theme.secondaryColor,
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.8}
            />
            <Carousel
              data={ONBOARDING}
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              renderItem={this.renderOnboarding}
              sliderWidth={sliderWidth}
              itemWidth={sliderWidth}
              scrollEventThrottle={5}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />
          </Flex>
          <Flex value={1} align="center" justify="start" self="stretch" style={styles.buttonWrapper}>
            <Flex direction="column" self="stretch" align="center">
              <Button
                pill={true}
                text="GET STARTED"
                onPress={this.getStarted}
                style={styles.getStarted}
                buttonTextStyle={styles.buttonText}
              />
              <Flex direction="row">
                <Text style={styles.signInText}>ALREADY A MEMBER?</Text>
                <Button
                  text="SIGN IN"
                  type="transparent"
                  onPress={this.login}
                  buttonTextStyle={styles.signInBtnText}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({ myStageReducer }) => ({
  stageId: myStageReducer.stageId,
});

export default connect(mapStateToProps)(LoginScreen);
export const LOGIN_SCREEN = 'nav/LOGIN';
