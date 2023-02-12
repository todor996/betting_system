const userResolvers = {
  Query: {
    async getUser(_: any, { id }: { id: number }, { models: { User } }: any) {
      return User.findByPk(id, { raw: true });
    },
    async getUserList(root: any, args: any, { models: { User } }: any) {
      return User.findAll({ raw: true });
    }
  }
};

export default userResolvers;
