import React, { useState } from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import i18next from 'i18next';

import { Text, IconButton } from '../../components/common';
import theme from '../../theme';
import { StepTypeBadge } from '../StepTypeBadge/StepTypeBadge';
import { StepTypeEnum } from '../../../__generated__/globalTypes';

import styles, { sliderWidth, sliderHeight } from './styles';

export const AddStepExplainer: {
  source: ImageSourcePropType;
  text: string;
  stepType?: StepTypeEnum;
}[] = [
  {
    source: require('../../../assets/images/explainerModal1.png'),
    text: i18next.t('selectStepExplainer:part1'),
  },
  {
    source: require('../../../assets/images/explainerModal2.png'),
    stepType: StepTypeEnum.relate,
    text: i18next.t('selectStepExplainer:part2'),
  },
  {
    source: require('../../../assets/images/explainerModal3.png'),
    stepType: StepTypeEnum.pray,
    text: i18next.t('selectStepExplainer:part3'),
  },
  {
    source: require('../../../assets/images/explainerModal4.png'),
    stepType: StepTypeEnum.care,
    text: i18next.t('selectStepExplainer:part4'),
  },
  {
    source: require('../../../assets/images/explainerModal5.png'),
    stepType: StepTypeEnum.share,
    text: i18next.t('selectStepExplainer:part5'),
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
            const { source, text, stepType } = item;
            return (
              <>
                <View style={{ flex: 1 }}>
                  <Image
                    source={source}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
                {stepType && (
                  <View style={styles.middleIconWrap}>
                    <StepTypeBadge
                      stepType={stepType}
                      hideLabel={true}
                      style={styles.middleIconCircle}
                      iconProps={{
                        height: 56,
                        width: 56,
                        color: theme.impactBlue,
                      }}
                    />
                  </View>
                )}
                <View style={[{ flex: 0.9 }, styles.textWrap]}>
                  {text && !stepType && (
                    <Text style={[styles.text, styles.textOnly]}>{text}</Text>
                  )}
                  {stepType && text && (
                    <>
                      <StepTypeBadge
                        stepType={stepType}
                        hideIcon={true}
                        textStyle={[styles.text, styles.title]}
                        labelUppercase={false}
                        includeStepInLabel={false}
                      />
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
            size={22}
            onPress={onClose}
            hitSlop={theme.hitSlop(15)}
            style={styles.closeButtonIcon}
            buttonStyle={styles.closeButton}
            testID="SelectStepExplainerCloseButton"
          />
        </View>
      </View>
    </View>
  );
}

export default SelectStepExplainerModal;
