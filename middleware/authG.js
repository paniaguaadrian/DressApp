module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
        // ! OJO CAMBIAR ESTO CUANDO TENGAMOS LA RUTA REAL, Y NO DASHBOARD DE NUESTRA APP!!!!!!!
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
