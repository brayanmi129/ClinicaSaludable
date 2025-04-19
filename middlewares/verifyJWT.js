const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    id = decoded.user.id;
    userM.getById(id).themp((user) => {
      if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }
      req.user = user;
    });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

module.exports = verifyJWT;
