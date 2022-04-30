
module.exports = {
    name: "User",
    func: (col) => {
        return {

            _init: async () => {
                await col.collection.createIndex({ email: 1 }, { unique: true })
            },

            register: async (email) => {
                let result = await col.collection.insertOne({
                    email: email
                })
                return result.insertedId.toString()
            },

            login: async (email) => {
                let result = await col.collection.findOne({
                    email: email
                })
                return result._id.toString()
            }
            
        }
    }
}
