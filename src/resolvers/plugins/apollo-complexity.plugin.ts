import {
    ApolloServerPlugin,
    GraphQLServiceContext,
  } from 'apollo-server-plugin-base';
  import { GraphQLSchema, separateOperations } from 'graphql';
  import {
    fieldExtensionsEstimator,
    getComplexity,
    simpleEstimator,
  } from 'graphql-query-complexity';
  import { Logger } from '@nestjs/common';

  export class ApolloComplexityPlugin implements ApolloServerPlugin {
    private readonly logger = new Logger(ApolloComplexityPlugin.name);
    private schema: GraphQLSchema;
    constructor(private maxComplexity: number) {}
    public serverWillStart(service: GraphQLServiceContext) {
      this.schema = service.schema;
    }
    public requestDidStart() {
      return {
        didResolveOperation: ({ request, document }) => {
          try {
            const complexity = getComplexity({
              schema: this.schema,
              query: request.operationName
                ? separateOperations(document)[request.operationName]
                : document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            if (complexity > this.maxComplexity) {
              this.logger.error(
                `${request.operationName} complexity: ${complexity}`,
              );
              throw new Error(
                `Sorry, too complicated query (complexity: ${complexity}, max complexity: ${this.maxComplexity})`,
              );
            }
          } catch (e) {
            this.logger.error(e.message, e.trace);
          }
        },
      };
    }
}