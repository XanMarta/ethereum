const { ObjectId } = require("mongodb")

module.exports = {
    name: "Metadata",
    func: (col) => {
        return {

            add: async (fileid, filename) => {
                return await col.collection.updateOne({
                    _id: fileid
                }, {
                    $setOnInsert: {
                        name: filename
                    },
                    $push: {
                        versions: {
                            name: filename,
                            creationTime: new Date()
                        }
                    }
                }, {
                    upsert: true
                })
            },

            get: async (fileid) => {
                let result = await col.collection.find({
                    _id: fileid
                }).toArray()
                return result[0]
            }

        }
    }
}
