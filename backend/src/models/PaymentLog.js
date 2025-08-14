import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    chainId: { type: Number, required: true },
    amountWei: { type: String, required: true },
    txHash: { type: String, required: true, unique: true },
    confirmed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("PaymentLog", paymentLogSchema);
