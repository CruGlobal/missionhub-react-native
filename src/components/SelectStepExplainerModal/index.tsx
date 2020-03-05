import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { TFunction } from 'i18next';

import { Text } from '../../components/common';
import theme from '../../theme';
import IconButton from '../../components/IconButton';
import Icon from '../../components/Icon';

import styles, { sliderWidth, sliderHeight } from './styles';

export function getExplainerData(index: number, t: TFunction) {
  switch (index) {
    case 0:
      return {
        source: require('../../../assets/images/explainerModal1.png'),
        text: t('selectStepExplainer:part1'),
      };
    case 1:
      return {
        // TODO: Need Image
        source: require('../../../assets/images/explainerModal1.png'),
        text: t('selectStepExplainer:part2'),
        icon: 'filterIcon', // TODO: Need Icon
        title: t('stepTypes:relate'),
      };
    case 2:
      return {
        // TODO: Need Image
        source: require('../../../assets/images/explainerModal1.png'),
        text: t('selectStepExplainer:part3'),
        icon: 'filterIcon', // TODO: Need Icon
        title: t('stepTypes:pray'),
      };
    case 3:
      return {
        // TODO: Need Image
        source: require('../../../assets/images/explainerModal1.png'),
        text: t('selectStepExplainer:part4'),
        icon: 'filterIcon', // TODO: Need Icon
        title: t('stepTypes:care'),
      };
    case 4:
      return {
        // TODO: Need Image
        source: require('../../../assets/images/explainerModal1.png'),
        text: t('selectStepExplainer:part5'),
        icon: 'filterIcon', // TODO: Need Icon
        title: t('stepTypes:share'),
      };
    default:
      return {
        source: require('../../../assets/images/explainerModal1.png'),
        text: t('selectStepExplainer:part1'),
      };
  }
}

function SelectStepExplainerModal({ onClose }: { onClose: Function }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Carousel
          data={[0, 1, 2, 3, 4]}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          renderItem={({ index }) => {
            const { source, text, icon, title } = getExplainerData(index, t);
            return (
              <>
                <View style={{ flex: 1 }}>
                  <Image
                    source={source}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                {icon && (
                  <View style={styles.middleIconWrap}>
                    <View style={styles.middleIconCircle}>
                      <Icon
                        style={{ color: theme.impactBlue }}
                        name={icon}
                        size={48}
                        type="MissionHub"
                      />
                    </View>
                  </View>
                )}
                <View style={[{ flex: 0.9 }, styles.textWrap]}>
                  {text && !title && <Text style={styles.text}>{text}</Text>}
                  {title && text && (
                    <>
                      <Text style={[styles.text, styles.title]}>{title}</Text>
                      <Text style={[styles.text, styles.textWithTitle]}>
                        {text}
                      </Text>
                    </>
                  )}
                </View>
              </>
            );
          }}
          itemWidth={sliderWidth}
          sliderWidth={sliderWidth}
          itemHeight={sliderHeight}
          sliderHeight={sliderHeight}
          onSnapToItem={(index: number) => setActiveIndex(index)}
          removeClippedSubviews={false}
          bounces={false}
        />
        <Pagination
          activeDotIndex={activeIndex}
          dotsLength={5}
          inactiveDotScale={0.9}
          dotColor={theme.impactBlue}
          inactiveDotColor={theme.grey3}
          containerStyle={{ marginBottom: 10 }}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 4,
          }}
          dotContainerStyle={{
            marginHorizontal: 4,
          }}
        />
        <View style={styles.closeButtonWrap}>
          <IconButton
            name="close"
            type="Material"
            size={32}
            onPress={onClose}
            hitSlop={theme.hitSlop(10)}
            style={styles.closeButton}
            testID="SelectStepExplainerCloseButton"
          />
        </View>
      </View>
    </View>
  );
}

export default SelectStepExplainerModal;
