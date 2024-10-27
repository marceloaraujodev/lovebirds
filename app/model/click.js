import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema({
  clicks: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

const Click = mongoose.models?.Click || mongoose.model('Click', ClickSchema);

export default Click;