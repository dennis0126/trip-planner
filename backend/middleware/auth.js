import { getUserByToken } from "../service/user.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).send("Please authenticate");
  }

  try {
    const user = await getUserByToken(token);
    console.log(user);
    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).send("Please authenticate");
  }
};

export default auth;
