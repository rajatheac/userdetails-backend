
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var UserModel = require('./userSchema');
const fetch = require('node-fetch');

const conn_string = 'mongodb+srv://raja:hUtN1jBWmIK0hly3@alpindecode.0jy3t.mongodb.net/';

mongoose
    .connect(conn_string, { useUnifiedTopology: true }, { useNewUrlParser: true }, { useFindAndModify: true })
    .then(() => {
        console.log("Mongo connection established successfully!");
    })
    .catch(err => {
        console.error(err.message);
    });
/**
 * To upload all users to DB User Table
 */
router.post('/insert', async function (req, res, next) {
    const users = await getUserDataFromAPI();
    UserModel.insertMany(users.data)
        .then((users) => {
            let message = {
                status: "success",
                message: "All Users data inserted"
            };
            res.header("Access-Control-Allow-Origin", "*");
            res.set("X-Content-Type-Options", "nosniff");
            res.json(message);
            res.end();
        })
        .catch(next)
});

/**
 * To get all users data
 */
router.get('/users', function (req, res, next) {
    UserModel.find({})
        .then((allUsers) => {
            let message = {
                status: "success",
                data: allUsers,
            };
            res.header("Access-Control-Allow-Origin", "*");
            res.set("X-Content-Type-Options", "nosniff");
            res.json(message);
            res.end();

        })
        .catch(next)
})

/**
 * To edit specific user by _id
 */
router.put('/edit', function (req, res, next) {
    const _id = req.body._id;
    delete req.body._id;
    const body = req.body;

    UserModel.updateOne({ _id }, { ...body })
        .then((user) => {
            res.header("Access-Control-Allow-Origin", "*");
            if (!user) {

                throw { err: 'User doesn\'t exists', code: 404 }
            }
            let message = {
                status: "success",
                data: user,
            };
            res.set("X-Content-Type-Options", "nosniff");
            res.json(message);
            res.end();

        })
        .catch(next)
});

/**
 * To Function to get users data from GoRest
 */
getUserDataFromAPI = async () => {
    try {
        const response = await fetch('https://gorest.co.in/public-api/users', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer cb5fa57d4cf45540040a0992bb24a71d918aad077464b0bcf27666f06f6aca3a'
            },
        })
        const jsonResponse = await response.json()
        return jsonResponse
    }
    catch (e) {
        console.error(e)
    }
}

module.exports = router;