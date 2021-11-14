const DataLoader = require("dataloader");
const User = require("../../models/user");
const Event = require("../../models/event");
const { dateToString } = require("../../helpers/date");

const eventLoader = new DataLoader((eventsIDs) => {
  return events(eventsIDs);
});

const userLoader = new DataLoader((userIds) => {
  console.log(userIds);
  return User.find({ _id: { $in: userIds } });
});

const events = async (eventsIDs) => {
  try {
    const events = await Event.find({ _id: { $in: eventsIDs } });

    events.sort((a, b) => {
      return (
        eventsIDs.indexOf(a._id.toString()) -
        eventsIDs.indexOf(b._id.toString())
      );
    });

    return events.map((event) => {
      return transFormEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    // const event = await Event.findById(eventId); // with data loader
    const event = await eventLoader.load(eventId.toString());
    // return transFormEvent(event); //without data loader
    return event;
  } catch (error) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    // const user = await User.findById(userId);//without dataloder
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
      // createdEvents: eventLoader.load.bind(this, user._doc.createdEvents),
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transFormEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    // creator: user.bind(this, event._doc.creator),//without dataloader
    creator: user.bind(this, event.creator),
  };
};

const transFormBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transFormBooking = transFormBooking;
exports.transFormEvent = transFormEvent;

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;
