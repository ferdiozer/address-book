

const _ = require('lodash')
const bcrypt = require('bcrypt')
const { ObjectID } = require('mongodb')
const { dbTables } = require('../config')
const { OrderedMap } = require('immutable')
const { isEmail, sendMail, toString } = require('../helpers')


const saltRound = 10;


class User {
    constructor(opts) {
        this.users = new OrderedMap();
        this.db = opts.db
        this.tokenModel = opts.tokenModel
    }

    aggregate(q = []) {
        q = [
            {
                $sort: { created: -1 }
            },
        ]
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.users).aggregate(q, (err, results) => {
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
                this.users = this.users.update(userId, (user) => {
                    if (user) {
                        user.avatar = avatar;
                    }
                    return user;
                });
                let updater = { $set: { avatar } };
                this.db.collection(dbTables.users).update(query, updater, (err, info) => {
                    return err ? reject(err) : resolve(info);
                });
            }
            else if (type == "password") {
                //    // ön bellekten sil
                // //   this.users = this.users.remove(userId.toString());

                const password = _.get(obj, "password")
                // query = { _id: new ObjectID(userId) };
                const updater = { $set: { password } };
                this.db.collection(dbTables.users).update(query, updater, (err, info) => {
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
                        this.db.collection(dbTables.users).update(query, updater, (err, info) => {
                            if (err) {
                                return reject(err)
                            }
                            this.users = this.users.update(userId, (user) => {
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
                        this.db.collection(dbTables.users).findOne(q1, (err2, result2) => {
                            if (result2) {
                                return reject({ message: `${username} kullanıcı adı uygun değil` })
                            }
                            const updater = { '$set': { name, username, gender } };
                            this.db.collection(dbTables.users).update(query, updater, (err, info) => {
                                if (err) {
                                    return reject(err)
                                }
                                this.users = this.users.update(userId, (user) => {
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

    updateUserPassword(obj) {
        return new Promise((resolve, reject) => {
            let userId = _.get(obj, "userId")
            const localUserId = _.get(obj, "localUserId")
            const oldPassword = _.get(obj, "oldPassword")
            const password = _.get(obj, "password")
            const type = _.get(obj, "type")
            if (type == 'by-parent') {
                userId = _.get(obj, "_id")
                //üst kullanıcı tarafından güncelleniyor
                this.findUserById(userId, (err, result) => {
                    const parentUserId = _.get(result, 'parentUserId');
                    if (_.toString(parentUserId) == _.toString(localUserId)) {
                        let toUpdateData = {
                            userId,
                            type: "password",
                            password: bcrypt.hashSync(password, saltRound)
                        }
                        this.updateUser(toUpdateData).then(result => {
                            return resolve({ message: "Başarılı" })
                        }).catch(err => {
                            return reject(err)
                        })
                    }
                    else {
                        return reject({ message: "Bu işlem için yetkiniz bulunmamakta" });
                    }
                })
            }
            else {
                //kendisi güncelliyor
                this.findUserById(userId, (err, result) => {
                    const hashPassword = _.get(result, 'password');
                    console.log({ oldPassword, obj, result, hashPassword })
                    const isMatch = bcrypt.compareSync(oldPassword, hashPassword);
                    if (!isMatch) {
                        return reject({ message: "Eski şifre hatalı" });
                    }
                    const hashPassword1 = bcrypt.hashSync(password, saltRound);
                    obj.type = "password"
                    obj.password = hashPassword1

                    this.updateUser(obj).then(result => {
                        return resolve({ message: "Başarılı" })
                    }).catch(err => {
                        return reject(err)
                    })
                })
            }

        })
    }


    find(query = {}, options = {}) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.users).find(query, options).toArray((err, users) => {
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
            this.db.collection(dbTables.users).find(query, {
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

    login(user) {
        const email = _.get(user, 'email', '');
        const password = _.get(user, 'password', '');
        //Facebook
        const FBid = _.get(user, 'FBid');
        //Google
        const googleId = _.get(user, 'googleId');

        console.log("login:!!!", user)

        return new Promise((resolve, reject) => {
            // ? acaba mantık doğtu mu. Bence çok yerinde mantık yürütmüşüm :D
            //facebook ile giriş yapmaya çalıştıysa
            if (FBid) {
                this.loginWithFacebook(user).then(res => {
                    return resolve(res)
                }).catch(err => {
                    return reject(err)
                })
            }
            //google ile giriş yapmaya çalıştıysa
            else if (googleId) {
                this.loginWithGoogle(user).then(res => {
                    return resolve(res)
                }).catch(err => {
                    return reject(err)
                })
            }
            else {
                if (!password || !email) { // if (!password || !email || !isEmail(email)) {
                    return reject({ message: "Geçersiz parametreler" })
                }
                // find in database with email
                this.findUserByEmailOrUsername(email, (err, result) => {
                    console.log("findUserByEmailOrUsername", { err, result })
                    if (err) {
                        console.log(err)
                        return reject({ message: "Böyle bir kullanıcı bulunamadı." });
                    }
                    // if found user we have to compare the password hash and plain text.
                    const hashPassword = _.get(result, 'password');
                    if (!hashPassword) {
                        return reject({ message: "Bağlı olan sosyal medya ile hesabınızı açmalısınız." });
                    }

                    const isMatch = bcrypt.compareSync(password, hashPassword);
                    if (!isMatch) {
                        return reject({ message: "Şifre hatalı" });
                    }
                    // user login successful let creat new token save to token collection.
                    const userId = result._id;
                    this.tokenModel.create(userId).then((token) => {
                        token.user = result;
                        return resolve(token);
                    }).catch(err => {
                        console.log(err)
                        return reject({ message: "Başarısız" });
                    })
                });
            }
        })
    }
    //fcebook giriş
    loginWithFacebook(user) {
        console.log("loginWithFacebook", { user })
        const email = _.get(user, 'FBid', '');

        return new Promise((resolve, reject) => {

            this.findUserByFbId(email, (err, result) => {
                console.log("loginWithFacebook findUserByFbId", { user, err, result })
                //daha önce kayıtlı değilse ise
                if (err) {
                    // kayıt oluştur
                    user.channel = "facebook"
                    this.setUserFormated(user).then(userFormatted => {
                        this.db.collection(dbTables.users).insertOne(userFormatted, (err, info) => {
                            // check if error return error to user
                            if (err) {
                                return reject({ message: "Sorun oluştu." });
                            }
                            // otherwise return user object to user.
                            const userId = _.get(userFormatted, '_id').toString(); // this is OBJET ID
                            this.tokenModel.create(userId).then((token) => {
                                token.user = result;
                                return resolve(token);
                            })
                        });
                    }).catch(err => {
                        return reject(err);
                    })
                }
                else {
                    //var olan kullanıcı
                    const userId = result._id;
                    this.tokenModel.create(userId).then((token) => {
                        token.user = result;
                        return resolve(token);
                    })
                }
            })
        })
    }


    //google giriş
    loginWithGoogle(user) {
        console.log("loginWithGoogle", { user })
        const email = _.get(user, 'profileObj.email', null)
        return new Promise((resolve, reject) => {
            this.findUserByEmail(email, (err, result) => {
                console.log("loginWithGoogle findUserByEmail", { user, err, result })
                //daha önce kayıtlı değilse ise
                if (err) {
                    user.channel = "google"
                    this.setUserFormated(user).then(userFormatted => {
                        this.db.collection(dbTables.users).insertOne(userFormatted, (err, info) => {
                            // check if error return error to user
                            if (err) {
                                return reject({ message: "Sorun oluştu." });
                            }
                            // otherwise return user object to user.
                            const userId = _.get(userFormatted, '_id').toString(); // this is OBJET ID
                            this.tokenModel.create(userId).then((token) => {
                                token.user = result;
                                return resolve(token);
                            }).catch((err) => {
                                return reject(err)
                            })
                        });
                    }).catch(err => {
                        return reject(err)
                    })
                }
                else {
                    //var olan kullanıcı
                    const userId = result._id;

                    //////// Güncelle
                    const query = { _id: new ObjectID(userId) };
                    const updater = { $set: { googleData: user } };
                    this.db.collection(dbTables.users).update(query, updater);
                    ////END güncelle
                    this.tokenModel.create(userId).then((token) => {
                        token.user = result;
                        return resolve(token);

                    })
                }

            })

        })

    }




    findUserByEmail(email, callback = () => {
    }) {


        this.db.collection(dbTables.users).findOne({ email: email }, (err, result) => {

            if (err || !result) {

                return callback({ message: "User not found." })
            }

            return callback(null, result);

        });


    }

    findByCustomKey(key, value, callback = () => {
    }) {
        this.db.collection(dbTables.users).findOne({ [key]: value }, (err, result) => {
            if (err || !result) {
                return callback({ message: "User not found." })
            }
            return callback(null, result);
        });
    }

    findUserByEmailOrUsername(email, callback = () => { }) {

        const q = { $or: [{ email: email }, { username: email }] }

        this.db.collection(dbTables.users).findOne(q, (err, result) => {

            if (err || !result) {

                return callback({ message: "bulunamadı." })
            }

            return callback(null, result);

        });

    }

    findUserByFbId(FBid, callback = () => {
    }) {


        this.db.collection(dbTables.users).findOne({ FBid }, (err, result) => {

            if (err || !result) {

                return callback({ message: "User not found." })
            }

            return callback(null, result);

        });


    }

    forgotPassword(obj) {
        return new Promise((resolve, reject) => {
            const email = _.get(obj, "email")
            if (!email) {
                return reject({ message: "Geçersiz parametre" })
            }
            this.findUserByEmailOrUsername(email, (err, user) => {
                if (err || !user) {
                    return reject({ message: "Böyle bir kullanıcı bulunamadı." });
                }

                const resetPasswordKey = toString(new ObjectID())

                this.db.collection("users").findOneAndUpdate({ _id: new ObjectID(_.get(user, "_id")) }, {
                    $set: {
                        resetPasswordKey
                    }
                }).then(() => {
                    let mailData = {
                        toMail: _.get(user, "email"),
                        content: `<a href="${siteConfig.frontendUrl}/recovery/${resetPasswordKey}"><b>Şifreyi Sıfırla</b></a>`,
                        subject: "Şifre Kurtarma",
                        from: "ChatX"
                    }
                    sendMail(mailData, (err, succ) => {
                        if (err) {
                            console.log("!1", err)
                            return reject(err)
                        }
                        return resolve(succ);
                    })
                }).catch(err => {
                    console.log("!2", err)
                    return reject(err)
                })

            })
        })
    }
    forgotPasswordGetUserWithKey(key) {
        return new Promise((resolve, reject) => {
            this.db.collection(dbTables.users).findOne({ resetPasswordKey: key }, (err, result) => {
                if (err || !result) {
                    return reject({ message: "bulunamadı." })
                }
                return resolve(result);
            });
        })
    }

    recoveryPasswordSet(obj) {
        return new Promise((resolve, reject) => {
            const resetPasswordKey = _.get(obj, "resetPasswordKey")
            const password = _.get(obj, "password")
            this.db.collection(dbTables.users).findOne({ resetPasswordKey }, (err, result) => {
                if (err || !result) {
                    return reject({ message: "bulunamadı." })
                }
                const hashPassword = bcrypt.hashSync(password, saltRound);

                this.db.collection("users").findOneAndUpdate(
                    {
                        _id: new ObjectID(_.get(result, "_id"))
                    }, {
                    $set: {
                        password: hashPassword
                    },
                    $unset: {
                        resetPasswordKey: ""
                    }
                }).then(() => {
                    return resolve(result);
                }).catch((err) => {
                    return reject(err)
                })



            });
        })
    }


    load(id) {
        id = `${id}`;
        return new Promise((resolve, reject) => {
            // find in cache if found we return and dont nee to query db
            const userInCache = this.users.get(id);
            if (userInCache) {
                return resolve(userInCache);
            }
            // if not found then we start query db
            this.findUserById(id, (err, user) => {
                if (!err && user) {
                    this.users = this.users.set(id, user);
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
        this.db.collection(dbTables.users).findOne({ _id: userId }, (err, result) => {
            if (err || !result) {
                return callback({ message: "User not found" });
            }
            return callback(null, result);
        });
    }

    beforeSave(user, callback = () => {
    }) {
        let errors = [];
        const fields = ['name', 'email', 'password'];
        const validations = {
            name: {
                errorMesage: 'İsim zorunlu',
                do: () => {

                    const name = _.get(user, 'name', '');

                    return name.length;
                }
            },
            email: {
                errorMesage: 'E-posta doğru değil',
                do: () => {

                    const email = _.get(user, 'email', '');

                    if (!email.length || !isEmail(email)) {
                        return false;
                    }


                    return true;
                }
            },
            password: {
                errorMesage: 'Şifre 3 karakterden fazla olmalı',
                do: () => {
                    const password = _.get(user, 'password', '');

                    if (!password.length || password.length < 4) {

                        return false;
                    }

                    return true;
                }
            }
        }

        // loop all fields to check if valid or not.
        fields.forEach((field) => {
            const fieldValidation = _.get(validations, field);
            if (fieldValidation) {
                const isValid = fieldValidation.do();
                const msg = fieldValidation.errorMesage;

                if (!isValid) {
                    errors.push(msg);
                }
            }
        });

        if (errors.length) {
            const err = _.join(errors, ',');
            return callback({ message: err }, null);
        }

        // check email is exist in db or not
        const email = _.toLower(_.trim(_.get(user, 'email', '')));
        const username = _.toLower(_.trim(_.get(user, 'username', '')));

        this.db.collection(dbTables.users).findOne({ email: email }, (err, result) => {
            if (err || result) {
                return callback({ message: "E-posta zaten var" }, null);
            }

            this.setUserFormated(user).then(userFormatted => {
                console.log("setUserFormated 1 ", userFormatted)
                return callback(null, userFormatted);
            }).catch(err => {
                console.log("setUserFormated 2 ", err)
                return callback(err);
            })

        });
    }

    setUserFormated(user) {
        return new Promise((resolve, reject) => {
            try {

                // return callback başarılı ise
                const channel = _.get(user, 'channel');
                const email = _.get(user, 'email');
                let userFormatted = {}
                if (channel == "facebook") {
                    userFormatted = {
                        name: `${_.trim(_.get(user, 'name'))}`,
                        email: email,
                        username: _.get(user, 'FBuserID', ''),
                        avatar: _.get(user, 'avatar', ''),
                        FBaccessToken: _.get(user, 'FBaccessToken', ''),
                        FBid: _.get(user, 'FBid', ''),
                        facebookData: _.get(user, 'fbData'),
                        channel: "facebook",
                        created: new Date(),
                    };
                }
                else if (channel == "google") {
                    userFormatted = {
                        name: _.get(user, 'profileObj.name', ""),
                        email: _.get(user, 'profileObj.email'),
                        username: _.get(user, 'googleId'),
                        avatar: _.get(user, 'profileObj.imageUrl'),
                        googleData: user,
                        channel: "google",
                        created: new Date(),
                    };
                }
                else {
                    const password = _.get(user, 'password');
                    const hashPassword = bcrypt.hashSync(password, saltRound);
                    userFormatted = {
                        _id: new ObjectID(),
                        name: `${_.trim(_.get(user, 'name'))}`,
                        email: email,
                        username: `${_.trim(_.get(user, 'username'))}`,
                        password: hashPassword,
                        created: new Date(),
                    };
                }
                return resolve(userFormatted);
            } catch (error) {
                return reject(error);
            }

        });
    }

    create(user) {
        console.log("create USER :", user)
        return new Promise((resolve, reject) => {
            this.beforeSave(user, (err, user) => {
                if (err) {
                    return reject(err);
                }
                this.db.collection(dbTables.users).insertOne(user, (err, info) => {
                    if (err) {
                        return reject(err);
                    }
                    const userId = _.get(user, '_id').toString();
                    this.users = this.users.set(userId, user);
                    return resolve(user);
                });
            });
        });
    }

}

module.exports = {
    userModel: (opts) => new User(opts)
}