import mongoose, { Schema } from "mongoose";
import Event from "./event.js";

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name required"],
      trim: true,
      minlength: 1,
    },
    startDate: {
      type: Date,
      required: [true, "Start date required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date required"],
      validate: {
        validator: function (value) {
          return this.startDate <= value;
        },
        message: "End date must be before start date",
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.methods.toJSON = function () {
  const trip = this;
  const tripObject = trip.toObject();
  delete tripObject.owners;

  return tripObject;
};

tripSchema.pre("save", async function (next) {
  const trip = this;

  // synchronize the owners of the events
  if (trip.isModified("owners")) {
    const events = await Event.find({ trip: trip._id });
    events.forEach((event) => {
      event.owners = trip.owners;
      event.save();
    });
  }
});

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;
