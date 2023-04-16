// var jwt = require('jsonwebtoken');

// function verifyJWT(req, res, next) {
//     // console.log('Token inside VerifyJWT', req.headers.authorization);
//     const authheader = req.headers.authorization;
//     if (!authheader) {
//         return res.status(401).send('Un authorized Access.')
//     }
//     const token = authheader.split(' ')[1];

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden Access' })
//         }
//         req.decoded = decoded;
//         next();
//     })

// }

// module.exports = verifyJWT;