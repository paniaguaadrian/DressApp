// * Creamos nuestro propio middleware express personalizado que se ubicará entre una solicitud y una ruta protegida. Verificaremos si la solicitud esta autorizada. Esta función de middleware buscará el token en las cookies de request y luego la validará.

const jwt = require("jsonwebtoken");
// * Esto lo hemos creado en el archivo .env (ahí esta la contraseña guardad en la variable SECRET_SESSION)
const secret = process.env.SECRET_SESSION;

// * Traemos de vuelta el modelo User
const User = require("../models/User");

const withAuth = async (req, res, next) => {
  try {
    // ! Obtener el token de las cookies
    const token = req.cookies.token;

    // * Si no hay token, seteamos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente función de middleware
    if (!token) {
      res.locals.isUserLoggedIn = false;
      next();
    } else {
      // * Verificación del token
      const decoded = await jwt.verify(token, secret);

      // * Si el token valida, configuramos req.userID con el valor del decoded userID
      req.userID = decoded.userID;
      res.locals.currentUserInfo = await User.findById(req.userID);
      res.locals.isUserLoggedIn = true;
      next();
    }
  } catch (error) {
    // * Si hay un error, configuramos el valor de la variable isUserLoggedIn en false y pasamos el control a la siguiente ruta
    console.error(error);
    res.locals.isUserLoggedIn = false;
    next(error);
  }
};

module.exports = withAuth;

// * Antes de que sucedan las rutas, este middleware verifica si hay un token. Si hay, setea algunos *locals* en la respuesta para que la vista acceda. Tenemos dos locals:
// ? isUserLoggedIn: un booleano que indica si hay un usuario conectado o no.
// ? currentUserInfo: la información del usuario de la sesión (solo disponible si ha iniciado sesión).
// * Ese middleware facilita la personalización de la homepage para los usuarios logueados.
