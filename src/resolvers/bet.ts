const betResolvers = {
    Query: {
        async getBet(_: any, {id}: { id: number }, {models: {Bet}}: any) {
            return Bet.findByPk(id);
        },
        async getBetList(root: any, args: any, {models: { Bet}}: any) {
            return Bet.findAll();
        },
        async getBestBetPerUser(root: any, args: any, {models: { Bet}}: any) {
            return Bet.findAll();
        }
    },
    Mutation: {
        async createBet(
            root: any,
            {userId, betAmount, chance }: any,
            {models: { Bet, User }}: any
        ) {
            const foundUser = await User.findByPk(userId);
            if(!foundUser) {
                throw new Error('Invalid user id');
            }
            if(foundUser.dataValues.balance < betAmount) {
                throw new Error('Insufficient funds');
            }
            let userBalance = foundUser.dataValues.balance;
            userBalance -= betAmount;
            const payout = (1 / chance)*betAmount;
            const win = Math.random() < chance;
            console.log(foundUser.balance);
            const bet = await Bet.create({
                userId,
                payout,
                betAmount,
                chance,
                win
            },{raw: true})
            if(win) {
                userBalance += payout;
            }
            await foundUser.update({
                balance: userBalance
            });
            return bet.dataValues;
        },
    }
}

export default betResolvers;
