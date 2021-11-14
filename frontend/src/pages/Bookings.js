import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../Spinner/Spinner";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingChart from "../components/Bookings/BookingChart/BookingChart";
import BookingControls from "../components/Bookings/BookingControls/BookingControls";
class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "chart",
  };

  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {
    this.fatchBooking();
  }

  fatchBooking = () => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
      query{
        bookings{
          _id
          createdAt
      
          event{
            _id
             title
             date 
             price
          }
          user{
            email
          }
          
        }
      }
      `,
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        console.log(bookings);
        if (this.isActive) {
          this.setState({ bookings: bookings, isLoading: false });
        }
      })
      .catch((err) => {
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  deleteBookingHandler = (bookingId) => {
    this.setState({ isLoading: true });

    const requestBody = {
      query: `
      mutation CancelBooking($id:ID!){
        cancelBooking(bookingId:$id){
          _id
          title 
        }
      }
      `,
      variables: {
        id: bookingId,
      },
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updateBookings = prevState.bookings.filter((booking) => {
            return booking._id !== bookingId;
          });
          return { bookings: updateBookings, isLoading: false };
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  };

  changeOutTypeHandler = (outputType) => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingControls
            activeOutputType={this.state.outputType}
            onChange={this.changeOutTypeHandler}
          />
          <div>
            {this.state.outputType === "list" ? (
              <BookingList
                booking={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }

    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
