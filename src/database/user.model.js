const { ObjectId } = require("mongodb")

module.exports = {
    name: "User",
    func: (col) => {
        return {

            _init: async () => {
                await col.collection.createIndex({ email: 1 }, { unique: true })
            },

            register: async (email) => {
                let result = await col.collection.insertOne({
                    email: email,
                    collection: []
                })
                return result.insertedId.toString()
            },

            login: async (email) => {
                let result = await col.collection.findOne({
                    email: email
                })
                return result._id.toString()
            },
            
            get: async (userid) => {
                let result = await col.collection.findOne({
                    _id: ObjectId(userid)
                })
                return result
            },

            get_e: async (email) => {
                let result = await col.collection.findOne({
                    email: email
                })
                return result
            },

            add_file: async (userid, fileid) => {
                return await col.collection.updateOne({
                    _id: ObjectId(userid)
                }, {
                    $addToSet: {
                        collection: fileid
                    }
                })
            }

        }
    }
}
