let mongoose = require("mongoose");

let UserSchema = mongoose.Schema(
    {
        username: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        fullName: { type: String, default: "" },
        avatarUrl: { type: String, default: "" },
        status: { type: Boolean, default: false },
        role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
        loginCount: { type: Number, default: 0, min: 0 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
