import { DocumentNode } from 'graphql';
import { useMutation as originalUseMutation } from '@apollo/react-hooks';
import { MutationFunctionOptions } from '@apollo/react-common';

type MutateSpy = {
  mutation: DocumentNode;
  spy: jest.SpyInstance;
};

type OriginalUseMutation = typeof originalUseMutation;

interface UseMutation extends OriginalUseMutation {
  mutateSpies?: MutateSpy[];
}

jest.mock('@apollo/react-hooks', () => {
  const apolloHooks = jest.requireActual('@apollo/react-hooks');

  const useQuery = jest.fn(apolloHooks.useQuery);

  const mutateSpies: MutateSpy[] = [];
  const useMutation: UseMutation = jest.fn<
    ReturnType<typeof apolloHooks.useMutation>,
    Parameters<typeof apolloHooks.useMutation>
  >((...args) => {
    const result = apolloHooks.useMutation(...args);
    mutateSpies.push({
      mutation: args[0] as DocumentNode,
      spy: jest.spyOn(result, '0'),
    });
    return result;
  });
  useMutation.mutateSpies = mutateSpies;

  return { ...apolloHooks, useQuery, useMutation };
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveBeenMutatedWith(
        mutation: DocumentNode,
        options?: MutationFunctionOptions,
      ): R;
    }
  }
}

expect.extend({
  toHaveBeenMutatedWith(
    useMutation: UseMutation,
    mutation: DocumentNode,
    options?: MutationFunctionOptions,
  ) {
    const allCalls = (useMutation.mutateSpies || [])
      .filter(({ spy }) => spy.mock.calls.length > 0)
      .flatMap(({ mutation, spy }) =>
        spy.mock.calls.map(([options]) => ({ mutation, options: options })),
      );
    if (this.isNot) {
      expect(allCalls).not.toContainEqual({ mutation, options });
    } else {
      expect(allCalls).toContainEqual({ mutation, options });
    }

    // This point is reached when the above assertion was successful.
    // The test should therefore always pass, that means it needs to be
    // `true` when used normally, and `false` when `.not` was used.
    return { pass: !this.isNot, message: '' };
  },
});
