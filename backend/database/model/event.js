import mongoose from "mongoose";

const locationSchema = mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: [true, "latitude required"],
    },
    longitude: {
      type: Number,
      required: [true, "longitude required"],
    },
  },
  {
    _id: false,
  }
);

const eventSchema = mongoose.Schema(
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
    location: [locationSchema],
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
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

eventSchema.methods.toJSON = function () {
  const event = this;
  const eventObject = event.toObject();
  delete eventObject.owners;

  return eventObject;
};

const Event = mongoose.model("Event", eventSchema);

export default Event;
