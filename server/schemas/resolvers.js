const { User } = require('../models'); 

const resolvers = {
    Query: {
        me: async () => {
            return await User.find({})
        }
    }
}

module.exports = resolvers;