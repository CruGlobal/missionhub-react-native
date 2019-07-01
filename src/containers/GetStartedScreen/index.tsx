import React, { Component, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { disableBack } from '../../utils/common';

import styles from './styles';

const GetStartedScreen = ({
  dispatch,
  next,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, never>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next: () => ThunkAction<void, any, null, never>;
}) => {
  useEffect(() => {
    disableBack.add();
    return () => disableBack.remove();
  }, []);

  const { t } = useTranslation('getStarted');

  const firstName = useSelector(state => state.profile.firstName);
  const name = (firstName || '').toLowerCase();

  const navigateNext = () => {
    disableBack.remove();

    dispatch(next({}));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex align="center" justify="center" value={1} style={styles.content}>
        <Flex align="start" justify="center" value={4}>
          <Text header={true} style={styles.headerTitle}>
            {t('hi', { name })}
          </Text>
          <Text style={styles.text}>{t('tagline')}</Text>
        </Flex>

        <BottomButton onPress={navigateNext} text={t('getStarted')} />
      </Flex>
    </SafeAreaView>
  );
};

export default connect()(GetStartedScreen);
export const GET_STARTED_SCREEN = 'nav/GET_STARTED';
