// models/Rent.js
const mongoose = require('mongoose');

const RentSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalRent: {
    type: Number,
    required: true,
  },
  rentPaid: {
    type: Number,
    default: 0,
  },
  due: {
    type: Number,
    default: function () {
      return this.totalRent - this.rentPaid;
    },
  },
  paidOn: {
    type: Date,
  },
  electricity: {
    unitsConsumed: {
      type: Number,
      default: 0,
    },
    ratePerUnit: {
      type: Number,
      default: 10, // You can make this dynamic if needed
    },
    amountDue: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid', 'partial'],
      default: 'unpaid',
    },
  },
  remarks: String,
}, { timestamps: true });

// Automatically calculate electricity amount due before saving
RentSchema.pre('save', function (next) {
  if (this.electricity.unitsConsumed) {
    this.electricity.amountDue = this.electricity.unitsConsumed * this.electricity.ratePerUnit;
  }
  next();
});

module.exports = mongoose.model('Rent', RentSchema);
