const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guildRolesSchema = new Schema(
  {
    guildName: {
      type: String,
      require: true,
    },
    guildID: {
      type: String,
      require: true,
    },
    role: {
      type: Object,
      require: true,
    },
  },
  { timestamps: true }
);

function initModel(name) {
  return mongoose.model(name, guildRolesSchema);
}
module.exports.initModel = initModel;
