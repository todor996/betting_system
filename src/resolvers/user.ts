const userResolvers = {
    Query: {
        async getUser(_: any, {id}: { id: number }, {models: {User}}: any) {
            return User.findByPk(id, { raw: true});
        },
        async getUserList(root: any, args: any, {models: { User}}: any) {
            const foundUsers =  await User.findAll({ raw: true});
            return foundUsers;
        }
    }
}

export default userResolvers;
