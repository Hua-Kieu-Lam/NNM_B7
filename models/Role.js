let mongoose = require("mongoose");

let RoleSchema = mongoose.Schema(
    {
        name: { type: String, unique: true, required: true },
        description: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);
