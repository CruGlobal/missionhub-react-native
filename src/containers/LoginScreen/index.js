import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { translate } from 'react-i18next';
import { LoginManager, GraphRequestManager, GraphRequest, AccessToken } from 'react-native-fbsdk';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { firstTime, facebookLoginAction } from '../../actions/auth';
import styles from './styles';
import { Text, Button, Flex, Icon } from '../../components/common';
import { navigatePush } from '../../actions/navigation';
import BaseScreen from '../../components/BaseScreen';
import theme from '../../theme';

const sliderWidth = theme.fullWidth;

const FACEBOOK_VERSION = 'v2.8';
const FACEBOOK_FIELDS = 'name,email,picture,about,cover,first_name,last_name';
const FACEBOOK_SCOPE = [ 'public_profile', 'email' ];
const ONBOARDING = [
  {
    id: 1,
    name: 'handcraft your faith journey',
    description: 'Choose your own steps of faith and MissionHub helps you stay focused on the people you care about.',
  },
  {
    id: 2,
    name: 'take your relationships deeper',
    description: 'MissionHub helps you grow closer to God by helping others experience Him.',
  },
  {
    id: 3,
    name: 'record your journey with journey',
    description: 'MissionHub remembers every step of faith you\'ve taken so you can see what God is doing.',
  },
];

@translate('login')
class LoginScreen extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      activeSlide: 0,
    };

    this.login = this.login.bind(this);
    this.tryItNow = this.tryItNow.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.renderOnboarding = this.renderOnboarding.bind(this);
  }

  login() {
    this.navigateToNext('KeyLogin');
  }

  tryItNow() {
    this.props.dispatch(firstTime());
    this.navigateToNext('Welcome');
  }

  navigateToNext(nextScreen) {
    this.props.dispatch(navigatePush(nextScreen));
  }

  facebookLogin() {
    LoginManager.logInWithReadPermissions(FACEBOOK_SCOPE).then((result) => {
      LOG('Facebook login result', result);
      if (result.isCancelled) {
        return;
      }
      AccessToken.getCurrentAccessToken().then((data) => {
        if (!data.accessToken) {
          LOG('facebook access token doesnt exist');
          return;
        }
        const accessToken = data.accessToken.toString();
        const getMeConfig = {
          version: FACEBOOK_VERSION,
          accessToken,
          parameters: {
            fields: {
              string: FACEBOOK_FIELDS,
            },
          },
        };
        // Create a graph request asking for user information with a callback to handle the response.
        const infoRequest = new GraphRequest('/me', getMeConfig, (err, meResult) => {
          if (err) {
            LOG('error getting facebook user', err);
            return;
          }
          LOG('facebook me', meResult);
          this.props.dispatch(facebookLoginAction(accessToken));
        });
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
      });
    }, (err) => {
      LOG('err', err);
      LoginManager.logOut();
    }).catch(() => {
      LOG('facebook login manager catch');
    });
  }

  renderOnboarding({ item }) {
    return (
      <View key={item.id} style={styles.onboardWrap}>
        <Text type="header" style={styles.onboardHeader}>{item.name.toLowerCase()}</Text>
        <Text style={styles.onboardText}>{item.description}</Text>
      </View>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <Flex style={styles.container}>
        <Flex value={3} align="center" justify="center">
          <Flex value={2.5} align="center">
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
              sliderWidth={sliderWidth - 75}
              itemWidth={sliderWidth -75}
              scrollEventThrottle={5}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />
          </Flex>
          <Flex value={2} align="center" justify="start" style={styles.buttonWrapper}>
            <Flex direction="column" self="stretch">
              <Button
                onPress={this.facebookLogin}
                style={styles.facebookButton}
                buttonTextStyle={styles.buttonText}
              >
                <Flex direction="row">
                  <Icon name="facebookIcon" size={21} type="MissionHub" style={styles.icon} />
                  <Text style={styles.buttonText}>{t('facebookSignup').toUpperCase()}</Text>
                </Flex>
              </Button>
              <Button
                onPress={this.tryItNow}
                style={styles.facebookButton}
                buttonTextStyle={styles.buttonText}
              >
                <Flex direction="row">
                  <Icon name="emailIcon" size={21} type="MissionHub" style={styles.icon} />
                  <Text style={styles.buttonText}>SIGN UP WITH EMAIL</Text>
                </Flex>
              </Button>
            </Flex>
            <Flex direction="row">
              <Flex value={1}>
                <Button
                  onPress={this.tryItNow}
                  text={t('tryNow').toUpperCase()}
                  style={styles.tryButton}
                  buttonTextStyle={styles.buttonText}
                />
              </Flex>
              <Flex value={1}>
                <Button
                  onPress={this.login}
                  text={t('signIn').toUpperCase()}
                  style={styles.tryButton}
                  buttonTextStyle={styles.buttonText}
                />
              </Flex>
            </Flex>
            <Text style={styles.terms}>By creating your MissionHub account you agree to our Terms of Use and Privacy Policy</Text>
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
