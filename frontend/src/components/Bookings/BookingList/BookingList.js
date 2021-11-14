import React from "react";

import "./BookingList.css";

const bookingList = (props) => {
  return (
    <ul className="bookings__list">
      {props.booking.map((booking) => {
        return (
          <li key={booking._id} className="bookings__item">
            <div className="bookings_item_data">
              {" "}
              {booking.event.title} -{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-GB")}
            </div>
            <div className=" bookings_item_actions">
              <button
                className="btn"
                onClick={props.onDelete.bind(this, booking._id)}
              >
                {" "}
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default bookingList;
