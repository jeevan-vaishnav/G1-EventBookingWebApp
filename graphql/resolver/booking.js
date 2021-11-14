const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transFormBooking, transFormEvent } = require("./merges");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      const bookings = await Booking.find({ user: req.userId });

      return bookings.map((booking) => {
        return transFormBooking(booking);
      });
    } catch (error) {
      console.log(error);
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) {
      throw new Error("Event Id does not exist");
    }
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });

    const result = await booking.save();
    return transFormBooking(result);
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      if (!booking) {
        throw new Error("Booking Id does not exist");
      }
      await Booking.deleteOne({ _id: args.bookingId });
      return transFormEvent(booking.event);
    } catch (error) {
      console.log(err);
      throw err;
    }
  },
};
