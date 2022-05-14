const jwt = require('jsonwebtoken');

const withAuth = function(req, res, next) {
  if (req.headers.authorization) {
    const [token, secret] = req.headers.authorization.split(':');

    if (!token) {
      res.status(401).send('No autorizado: No se presenta token');
    } else {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          res.status(401).send('No autorizado: Token inválido');
        } else {
          req.email = decoded.email;
          next();
        }
      });
    }
  } else if ( req.originalUrl.includes('documents') || req.originalUrl.includes('files') ) {
    next();
  } else {
    res.status(401).send('No autorizado: Faltan credenciales');
  }
}

module.exports = withAuth;
