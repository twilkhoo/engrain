import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../graphql/schema";
import { createContext } from "../../graphql/context";

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: createContext,
});

await apolloServer.start();

export default apolloServer.createHandler({
  path: "/api/graphql",
});

export const config = {
  api: {
    bodyParser: false,
  },
};
