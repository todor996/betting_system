import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from './user';
import betResolvers from './bet';

const resolvers = mergeResolvers([userResolvers, betResolvers]);

export default resolvers;

