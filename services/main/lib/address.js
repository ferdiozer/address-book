

const _ = require('lodash')

const { ObjectID } = require('mongodb')
const { dbTables } = require('../config')
const { OrderedMap } = require('immutable')

class Address {
    constructor(opts) {
        this.address = new OrderedMap();
        this.db = opts.db
    }

    aggregate(q = []) {
        q = [
            {
                $sort: { created: -1 }
            },
        ]
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.address).aggregate(q, (err, results) => {
                return err ? reject(err) : resolve(results);
            });
        })
    }

    updateUser(obj) {
        const userId = _.get(obj, "userId").toString();
        const type = _.get(obj, "type");
        console.log("updateUser", obj)
        return new Promise((resolve, reject) => {
            let query = { _id: new ObjectID(userId) };

            if (type == "avatar") {
                const avatar = _.get(obj, "avatar");
                this.address = this.address.update(userId, (user) => {
                    if (user) {
                        user.avatar = avatar;
                    }
                    return user;
                });
                let updater = { $set: { avatar } };
                this.db.collection(dbTables.address).update(query, updater, (err, info) => {
                    return err ? reject(err) : resolve(info);
                });
            }
            else if (type == "password") {
                //    // ön bellekten sil
                // //   this.address = this.address.remove(userId.toString());

                const password = _.get(obj, "password")
                // query = { _id: new ObjectID(userId) };
                const updater = { $set: { password } };
                this.db.collection(dbTables.address).update(query, updater, (err, info) => {
                    return err ? reject(err) : resolve(info);
                });
            }
            else if (type === "profile") {
                const username = _.get(obj, "username")
                const name = _.get(obj, "name", "");
                const gender = _.get(obj, "gender")
                this.findUserById(userId, (err, result) => {
                    if (err) return reject({ message: "Kullanıcı bulunamadı" })
                    //kullanıcı adını değiştrmediyse
                    if (username === _.get(result, "username")) {

                        if (!name.length) return reject({ message: "İsim zorunlu" })
                        const updater = { '$set': { name: name, gender } };
                        this.db.collection(dbTables.address).update(query, updater, (err, info) => {
                            if (err) {
                                return reject(err)
                            }
                            this.address = this.address.update(userId, (user) => {
                                if (user) {
                                    user.name = name;
                                    user.gender = gender;
                                }
                                return user;
                            });
                            result.name = name;
                            return resolve(result);
                        });
                    }
                    else {
                        if (!name.length) return reject({ message: "İsim zorunlu" })
                        if (!username.length) return reject({ message: "Kullanıcı adı zorunlu" })

                        //kendisi dışındakileri bulma işlemi
                        const q1 = {
                            _id: { '$ne': new ObjectID(userId) },
                            username: username
                        }
                        this.db.collection(dbTables.address).findOne(q1, (err2, result2) => {
                            if (result2) {
                                return reject({ message: `${username} kullanıcı adı uygun değil` })
                            }
                            const updater = { '$set': { name, username, gender } };
                            this.db.collection(dbTables.address).update(query, updater, (err, info) => {
                                if (err) {
                                    return reject(err)
                                }
                                this.address = this.address.update(userId, (user) => {
                                    if (user) {
                                        user.name = name;
                                        user.username = username;
                                        user.gender = gender;
                                    }
                                    return user;
                                });
                                result.name = name;
                                result.username = username;
                                return resolve(result);
                            });
                        })

                    }
                })
            }
            else {
                return reject({ message: "karşılığı olmayan istek" })
            }


        })
    }



    find(query = {}, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.address).find(query, options).toArray((err, users) => {
                return err ? reject(err) : resolve(users);
            })
        });
    }

    search(q = "") {
        return new Promise((resolve, reject) => {
            const regex = new RegExp(q, 'i');
            const query = {
                $or: [
                    { name: { $regex: regex } },
                    { email: { $regex: regex } },
                    { username: { $regex: regex } },
                ],
            };
            this.db.collection(dbTables.address).find(query, {
                _id: true,
                name: true,
                username: true,
                avatar: true,
                created: true,

            })
                .limit(20)
                .toArray((err, results) => {
                    if (err || !results || !results.length) {
                        return reject({ message: "bulunmadı." })
                    }
                    return resolve(results);
                });
        });
    }




    findUserByName(name, callback = () => { }) {
        this.db.collection(dbTables.address).findOne({ name }, (err, result) => {
            if (err || !result) {
                return callback({ message: "Not found." })
            }
            return callback(null, result);
        });
    }

    findByCustomKey(key, value, callback = () => {
    }) {
        this.db.collection(dbTables.address).findOne({ [key]: value }, (err, result) => {
            if (err || !result) {
                return callback({ message: "Not found." })
            }
            return callback(null, result);
        });
    }

    findUserByEmailOrUsername(email, callback = () => { }) {

        const q = { $or: [{ email: email }, { username: email }] }

        this.db.collection(dbTables.address).findOne(q, (err, result) => {

            if (err || !result) {

                return callback({ message: "Not found." })
            }

            return callback(null, result);

        });

    }


    load(id) {
        id = `${id}`;
        return new Promise((resolve, reject) => {
            // find in cache if found we return and dont nee to query db
            const userInCache = this.address.get(id);
            if (userInCache) {
                return resolve(userInCache);
            }
            // if not found then we start query db
            this.findUserById(id, (err, user) => {
                if (!err && user) {
                    this.address = this.address.set(id, user);
                }
                return err ? reject(err) : resolve(user);
            })
        })
    }

    findUserById(id, callback = () => {
    }) {
        if (!id) {
            return callback({ message: "User not found" }, null);
        }
        const userId = new ObjectID(id);
        this.db.collection(dbTables.address).findOne({ _id: userId }, (err, result) => {
            if (err || !result) {
                return callback({ message: "User not found" });
            }
            return callback(null, result);
        });
    }


    findItemByName(userId, value, callback = () => {
    }) {
        this.db.collection(dbTables.address).findOne({ name: value, userId }, (err, result) => {
            if (err || !result) {
                return callback({ message: "Not found." })
            }
            return callback(null, result);
        });
    }


    create(obj) {
        const { name, phone, email, userId } = obj
        let userIdObj = new ObjectID(userId)
        return new Promise((resolve, reject) => {
            this.findItemByName(userIdObj, name, (err, user) => {
                if (user) {
                    return reject({ message: "Item is exist" });
                }
                const insertData = {
                    userId: userIdObj,
                    name,
                    phone,
                    email,
                    created: new Date(),
                }
                this.db.collection(dbTables.address).insertOne(insertData, (err, info) => {
                    if (err) {
                        return reject(err);
                    }
                    this.address = this.address.set(userIdObj.toString(), user);
                    return resolve(insertData);
                });

            })
        });
    }

    getList(obj) {
        return new Promise(async (resolve, reject) => {

            let where = { userId: new ObjectID(obj.userId) };
            let limit = parseInt(obj.limit) || 30;
            let page = parseInt(obj.page) || 0;
            let sort = obj.sort || { created: -1 };

            const query = [
                {
                    $match: where
                },
                {
                    $sort: sort
                }
            ]

            const totalCount = await this.db.collection(dbTables.address).find(where).count()
            const cursor = this.db.collection(dbTables.address).aggregate(query)
            if (page > 1) {
                const skipCount = (page - 1) * limit;
                cursor.skip(skipCount);
            }
            if (limit > 0) {
                cursor.limit(limit);
            }
            let items = await cursor.toArray();
            resolve({ items, totalCount })

        })
    }

}

module.exports = {
    addressModel: (opts) => new Address(opts)
}