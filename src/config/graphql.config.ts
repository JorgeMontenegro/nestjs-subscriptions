import { GqlModuleOptions } from '@nestjs/graphql/dist/interfaces/gql-module-options.interface';
import { ApolloComplexityPlugin } from '../resolvers/plugins/apollo-complexity.plugin';

export const graphqlConfig: GqlModuleOptions = {
  debug: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
  autoSchemaFile: true,
  introspection: process.env.APP_ENV !== 'production',
  context: ({ req }) => ({ req }),
  typeDefs: [`scalar Upload`],
  buildSchemaOptions: {},
  plugins: [new ApolloComplexityPlugin(150)],
  uploads: {
    maxFileSize: 5000000, // 5 MB
    maxFiles: 2,
  },
  installSubscriptionHandlers: true
};
