import React from 'react';
import MockDate from 'mockdate';
import moment from 'moment';

import { renderWithContext } from '../../../../testUtils';
import DateComponent from '..';

MockDate.set(moment('2018-06-11 12:00:00').toDate());

it('renders correctly', () => {
  renderWithContext(<DateComponent date="2017-11-20" />, {
    noWrappers: true,
  }).snapshot();
});

describe('dateAtTime formatting', () => {
  it('renders today', () => {
    renderWithContext(
      <DateComponent date={'2018-06-11 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });

  it('renders yesterday', () => {
    renderWithContext(
      <DateComponent date={'2018-06-10 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });

  it('renders date from last week', () => {
    renderWithContext(
      <DateComponent date={'2018-06-09 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
    renderWithContext(
      <DateComponent date={'2018-06-04 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });

  it('renders from this year', () => {
    renderWithContext(
      <DateComponent date={'2018-06-03 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
    renderWithContext(
      <DateComponent date={'2018-05-23 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });

  it('renders from before this year', () => {
    renderWithContext(
      <DateComponent date={'2017-12-31 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
    renderWithContext(
      <DateComponent date={'2005-02-14 12:00:00'} dateAtTime={true} />,
      {
        noWrappers: true,
      },
    ).snapshot();
  });
});

it('renders with other format', () => {
  renderWithContext(
    <DateComponent date={'2018-06-11 12:00:00'} format="LLL" />,
    {
      noWrappers: true,
    },
  ).snapshot();
});

it('renders with style', () => {
  renderWithContext(
    <DateComponent date={'2018-06-11 12:00:00'} style={{ color: 'red' }} />,
    {
      noWrappers: true,
    },
  ).snapshot();
});
