/* eslint-disable import/export, @typescript-eslint/no-explicit-any */
declare module 'fraql' {
  // eslint-disable-next-line import/no-unused-modules
  export default function gql(literals: any, ...placeholders: any[]): any;

  export function toInlineFragment(doc: any): any;

  export namespace toInlineFragment {
    const prototype: Record<string, unknown>;
  }
}

declare module 'fraql/mock' {
  export declare function generateSchemaFromIntrospectionResult(
    introspectionResult: any,
  ): GraphQLSchema;
  // eslint-disable-next-line import/no-unused-modules
  export interface Mocker {
    // TODO: was a `declare class` instead of interface. Needed to add `<TData>` to `mockFragment`
    // constructor(
    //   schema: import('graphql').GraphQLSchema,
    //   {
    //     mocks,
    //   }?: {
    //     mocks: import('graphql-tools').IMocks;
    //   },
    // );
    mockSchema({
      mocks,
    }?: {
      mocks: import('graphql-tools').IMocks;
    }): import('graphql').GraphQLSchema & {
      transforms: import('graphql-tools').Transform[];
    };
    mockFragment<TData>(
      fragmentDocument: import('graphql').DocumentNode,
      options?: {
        mocks: import('graphql-tools').IMocks;
      },
    ): TData;
    mockFragments<TData>(
      fragmentDocuments: import('graphql').DocumentNode,
      options?: {
        mocks: import('graphql-tools').IMocks;
      },
    ): TData;
  }
  export declare function createMockerFromSchema(
    schema: any,
    options: any,
  ): Mocker;
  export declare function createMockerFromIntrospection(
    introspectionResult: import('graphql-tools').IntrospectionQuery,
    options?: { mocks: import('graphql-tools').IMocks },
  ): Mocker;
}
