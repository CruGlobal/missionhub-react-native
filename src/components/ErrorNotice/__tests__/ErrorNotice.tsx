import React from 'react';
import { ApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ErrorNotice } from '../ErrorNotice';

describe('ErrorNotice', () => {
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
  it('should show general error if no specific errors are matched', () => {
    renderWithContext(
      <ErrorNotice
        message="A test error was fired."
        error={
          new ApolloError({ graphQLErrors: [new GraphQLError('test error')] })
        }
        specificErrors={[
          {
            condition: 'CANNOT_EDIT_FIRST_NAME',
            message: 'A specific error was fired',
          },
        ]}
        refetch={() => Promise.resolve()}
      />,
    ).snapshot();
  });
  it('should render an a specificError', () => {
    renderWithContext(
      <ErrorNotice
        message="A test error was fired."
        error={
          new ApolloError({
            graphQLErrors: [new GraphQLError('CANNOT_EDIT_FIRST_NAME')],
          })
        }
        specificErrors={[
          {
            condition: 'CANNOT_EDIT_FIRST_NAME',
            message: 'A specific error was fired',
          },
        ]}
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
