const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  
  authMiddleware: function ({ req }) {
    
    // allows token to be sent via  req.query or headers
    let token = req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data; // Attaching User Data to the request object
    } catch {
      console.log('Invalid token');
    }

    // Returning the updated request object, which noww includes user data if the token is valid
    return req;
  },
  // Function to sign a JWT token with user data
  signToken: function ({username, email, _id }) {
    const payload = { username, email, _id }; // User data to include in the token 
    // Sign the token with the payload, secret key, and experiation time 
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
