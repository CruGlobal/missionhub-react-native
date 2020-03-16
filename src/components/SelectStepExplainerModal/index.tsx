import React, { useState } from 'react';
import { View, Image } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import i18next from 'i18next';

import { Text, IconButton } from '../../components/common';
import theme from '../../theme';

import styles, { sliderWidth, sliderHeight } from './styles';

export const AddStepExplainer = [
  {
    source: require('../../../assets/images/explainerModal1.png'),
    text: i18next.t('selectStepExplainer:part1'),
  },
  {
    source: require('../../../assets/images/explainerModal2.png'),
    text: i18next.t('selectStepExplainer:part2'),
    iconSource: require('../../../assets/images/icon_step_relate.png'),
    title: i18next.t('stepTypes:relate'),
  },
  {
    source: require('../../../assets/images/explainerModal3.png'),
    text: i18next.t('selectStepExplainer:part3'),
    iconSource: require('../../../assets/images/icon_step_pray.png'),
    title: i18next.t('stepTypes:pray'),
  },
  {
    source: require('../../../assets/images/explainerModal4.png'),
    text: i18next.t('selectStepExplainer:part4'),
    iconSource: require('../../../assets/images/icon_step_care.png'),
    title: i18next.t('stepTypes:care'),
  },
  {
    source: require('../../../assets/images/explainerModal5.png'),
    text: i18next.t('selectStepExplainer:part5'),
    iconSource: require('../../../assets/images/icon_step_share.png'),
    title: i18next.t('stepTypes:share'),
  },
];

function SelectStepExplainerModal({ onClose }: { onClose: Function }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Carousel
          data={AddStepExplainer}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          renderItem={({ item }) => {
            const { source, text, iconSource, title } = item;
            return (
              <>
                <View style={{ flex: 1 }}>
                  <Image
                    source={source}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                {iconSource && (
                  <View style={styles.middleIconWrap}>
                    <View style={styles.middleIconCircle}>
                      <Image
                        source={iconSource}
                        style={styles.iconImage}
                        resizeMode="cover"
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
          dotStyle={{ width: 8, height: 8, borderRadius: 4 }}
          dotContainerStyle={{ marginHorizontal: 4 }}
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
