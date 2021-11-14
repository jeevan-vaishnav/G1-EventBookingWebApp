const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const { transFormEvent } = require("./merges");

module.exports = {
  events: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }

    try {
      const events = await Event.find();

      return events.map((event) => {
        // return { ...event._doc };
        return transFormEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: dateToString(args.eventInput.date),
      creator: req.userId,
    });

    let createdEvent;

    try {
      const result = await event.save();

      createdEvent = transFormEvent(result);

      const creatorUser = await User.findById(req.userId);

      if (!creatorUser) {
        throw new Error("User not found");
      }
      creatorUser.createdEvents.push(event);
      await creatorUser.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
