import React from 'react';

import { renderWithContext } from '../../../../testUtils';
import { StepTypeBadge } from '../StepTypeBadge';
import { StepTypeEnum } from '../../../../__generated__/globalTypes';

describe('StepTypeBadge', () => {
  it('should render the relate step type', () => {
    renderWithContext(
      <StepTypeBadge stepType={StepTypeEnum.relate} />,
    ).snapshot();
  });
  it('should render the pray step type', () => {
    renderWithContext(
      <StepTypeBadge stepType={StepTypeEnum.pray} />,
    ).snapshot();
  });
  it('should render the care step type', () => {
    renderWithContext(
      <StepTypeBadge stepType={StepTypeEnum.care} />,
    ).snapshot();
  });
  it('should render the share step type', () => {
    renderWithContext(
      <StepTypeBadge stepType={StepTypeEnum.share} />,
    ).snapshot();
  });
  it('should render the generic step type', () => {
    renderWithContext(<StepTypeBadge stepType={undefined} />).snapshot();
  });
  it('should render vertically', () => {
    renderWithContext(
      <StepTypeBadge stepType={undefined} displayVertically />,
    ).snapshot();
  });
  it('should hide label', () => {
    renderWithContext(
      <StepTypeBadge stepType={undefined} hideLabel />,
    ).snapshot();
  });
  it('should hide icon', () => {
    renderWithContext(
      <StepTypeBadge stepType={undefined} hideIcon />,
    ).snapshot();
  });
});
