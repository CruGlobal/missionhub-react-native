declare module 'fraql' {
  export default function gql(literals: any, ...placeholders: any[]): any;

  export function toInlineFragment(doc: any): any;

  export namespace toInlineFragment {
    const prototype: {};
  }
}

declare module 'fraql/mock' {
  export declare function generateSchemaFromIntrospectionResult(
    introspectionResult: any,
  ): GraphQLSchema;
  export interface Mocker {
    // TODO: just changed from declare class
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
