const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, enum: ["single", "double", "triple"], required: true },
  acType: { type: String, enum: ["ac", "non-ac"], required: true },
  capacity: { type: Number, required: true },
  occupied: { type: Number, default: 0 },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bills: Array,
  facilities: Array,
  rent: { type: Number, required: true },
  
  currentRentStatus: {
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'partial'],
      default: 'unpaid',
    },
    month: String,
    year: Number,
    totalRent: Number,
    rentPaid: Number,
    rentDue: Number,
    paidOn: Date,
    totalDue: {
      type : Number,
      default : function () {
        return this.rentDue;
      },
    },
    electricity: {
      ratePerUnit: {
        type: Number,
        default: 10,
      },
      unitsConsumed: {
        type: Number,
        default: 0,
      },
      amountDue: {
        type: Number,
        default: 0,
      },
      amountPaid: Number,
      status: {
        type: String,
        enum: ['paid', 'unpaid', 'partial'],
        default: 'unpaid',
      }
    },
    remarks: String,
  },
  
  // ✅ Added image/photo key for storing image URL
  photo: { type: String, default: "" },
  alloted: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
