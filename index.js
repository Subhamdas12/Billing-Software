require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const server = express();
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const categoryRouter = require("./routes/categoryRoute");
const productRouter = require("./routes/productRoute");
const customerRouter = require("./routes/customerRoute");
const invoiceRouter = require("./routes/invoiceRoute");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { User } = require("./models/userModel");
const { sanitizeUser, cookieExtractor, isAuth } = require("./helper/services");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const crypto = require("crypto");
const port = process.env.PORT || 8080;

let opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_TOKEN_SECRET;

//middlewares
server.use(express.static(path.resolve(__dirname, "build")));
server.use(cookieParser());
server.use(cors());
server.use(express.json());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

//routes
server.use("/api/user", userRouter.router);
server.use("/api/auth", authRouter.router);
server.use("/api/category", categoryRouter.router);
server.use("/api/product", productRouter.router);
server.use("/api/customer", customerRouter.router);
server.use("/api/invoice", isAuth(), invoiceRouter.router);

server.get("/download", (req, res) => {
  const filePath = req.query.file;
  const fullFilePath = path.join(__dirname, filePath);

  // Check if the file exists
  if (!fs.existsSync(fullFilePath)) {
    return res.status(404).send("File not found");
  }

  // Set headers to force download
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + path.basename(filePath)
  );
  res.setHeader("Content-Type", "application/pdf");

  // Stream the file to the response
  res.sendFile(fullFilePath);
});

server.get("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});
//authentication and authorization

//verify password
passport.use(
  "local",
  new LocalStrategy({ usernameField: "phoneNumber" }, async function verify(
    phoneNumber,
    password,
    cb
  ) {
    try {
      let user = await User.findOne({ phoneNumber });
      if (!user) {
        return cb(null, false, { message: "Invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (err) {
            return cb(err);
          }
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return cb(null, false, {
              message: "Invalid credentials.",
            });
          }
          const token = await jwt.sign(
            sanitizeUser(user),
            process.env.JWT_TOKEN_SECRET
          );
          return cb(null, { ...sanitizeUser(user), token });
        }
      );
    } catch (err) {
      return cb(err);
    }
  })
);
//verify token
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
//establish session
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { ...sanitizeUser(user) });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Database connected");
}

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
