import React from 'react';
import { ApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ErrorNotice } from '../ErrorNotice';

// Tests disabled until https://jira.cru.org/browse/MHP-3159 is addressed
xdescribe('ErrorNotice', () => {
  it('should render nothing if no error', () => {
    renderWithContext(
      <ErrorNotice
        message="A test error was fired."
        refetch={() => Promise.resolve()}
      />,
    ).snapshot();
  });
  it('should render an error', () => {
    renderWithContext(
      <ErrorNotice
        message="A test error was fired."
        error={
          new ApolloError({ graphQLErrors: [new GraphQLError('test error')] })
        }
        refetch={() => Promise.resolve()}
      />,
    ).snapshot();
  });
  it('should render a network error', () => {
    renderWithContext(
      <ErrorNotice
        message="A test error was fired."
        error={new ApolloError({ networkError: new Error('test error') })}
        refetch={() => Promise.resolve()}
      />,
    ).snapshot();
  });
  it('should call refetch on press', () => {
    const refetch = jest.fn(() => Promise.resolve());
    const { getByText } = renderWithContext(
      <ErrorNotice
        message="A test error was fired."
        error={
          new ApolloError({ graphQLErrors: [new GraphQLError('test error')] })
        }
        refetch={refetch}
      />,
    );
    fireEvent.press(getByText('A test error was fired.'));
    expect(refetch).toHaveBeenCalled();
  });
});
