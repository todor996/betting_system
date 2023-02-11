import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDefs from './user';
import betTypeDefs from './bet';

const typeDefs = mergeTypeDefs([userTypeDefs, betTypeDefs]);

export default typeDefs;

