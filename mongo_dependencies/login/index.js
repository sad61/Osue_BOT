const mongoose = require("mongoose");

const mongoLogin = () => {
  const dbURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.v7bk3.mongodb.net/osue-repository?retryWrites=true`;
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Conectado ao mongos"))
    .catch((err) => console.log(err));
};

module.exports.mongoLogin = mongoLogin;
