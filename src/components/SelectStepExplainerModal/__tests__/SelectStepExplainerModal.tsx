import 'react-native';
import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import i18next from 'i18next';

import { renderWithContext } from '../../../../testUtils';

import SelectStepExplainerModal, { AddStepExplainer } from '..';

const onClose = jest.fn();

let screen: ReturnType<typeof renderWithContext>;

beforeEach(() => {
  screen = renderWithContext(<SelectStepExplainerModal onClose={onClose} />);
});

describe('renders correctly', () => {
  it('renders correctly', () => {
    screen.snapshot();
  });
});

describe('presses buttons', () => {
  it('presses close button', () => {
    fireEvent.press(screen.getByTestId('SelectStepExplainerCloseButton'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('explainer data', () => {
  it('part 1', () => {
    expect(AddStepExplainer[0]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part1'),
    });
  });
  it('part 2', () => {
    expect(AddStepExplainer[1]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part2'),
      iconSource: expect.anything(),
      title: i18next.t('stepTypes:relate'),
    });
  });
  it('part 3', () => {
    expect(AddStepExplainer[2]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part3'),
      iconSource: expect.anything(),
      title: i18next.t('stepTypes:pray'),
    });
  });
  it('part 4', () => {
    expect(AddStepExplainer[3]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part4'),
      iconSource: expect.anything(),
      title: i18next.t('stepTypes:care'),
    });
  });
  it('part 5', () => {
    expect(AddStepExplainer[4]).toEqual({
      source: expect.anything(),
      text: i18next.t('selectStepExplainer:part5'),
      iconSource: expect.anything(),
      title: i18next.t('stepTypes:share'),
    });
  });
});
