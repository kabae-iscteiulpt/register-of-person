import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const url = "http://localhost:8080/users";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { registMode: true, id: 0, name: "", address: "", list: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditUser = this.handleEditUser.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
  }

  async handleSubmit(event) {
    const person = {
      id: this.state.id,
      name: this.state.name,
      address: this.state.address,
    };

    let response;
    // if the state is in the registMode will be call the post and in the other option will be calling put.
    if (this.state.registMode) {
      response = await axios.post(url, person, {
        headers: { "Content-Type": "application/json" },
      });
      this.getAllUsers();
    } else {
      response = await axios.put(url, person, {
        headers: { "Content-Type": "application/json" },
      });
    }
    this.getAllUsers();
    this.handleReset();
    return response.data;
  }

  getAllUsers() {
    axios.get(url).then((res) => {
      const users = res.data;
      this.setState({ list: users });
    });
  }

  async componentDidMount() {
    this.getAllUsers();
  }

  handleEditUser(u) {
    this.setState({
      id: u.id,
      name: u.name,
      address: u.address,
      registMode: false,
    });
  }

  handleReset() {
    this.setState({ id: 0, name: "", address: "", registMode: true });
    window.location.reload(false);
  }

  async handleDeleteUser(u) {
    const person = {
      id: u.id,
      name: u.name,
      address: u.address,
    };

    axios.delete(url, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(person),
    });

    this.getAllUsers();
    this.handleReset();
  }
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1>
            {this.state.registMode
              ? "Register"
              : "Edit " + this.state.name + "'s data"}
          </h1>
        </div>

        <div className="container-fluid">
          <form id="register">
            <fieldset>
              <label>
                <p>Name:</p>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
                  }
                />
                <p>Address:</p>
                <input
                  type="address"
                  name="address"
                  value={this.state.address}
                  onChange={(event) =>
                    this.setState({ address: event.target.value })
                  }
                />
              </label>
            </fieldset>
            <br />
            <input
              className="btn btn-primary m-1 "
              type="button"
              value="Save"
              onClick={this.handleSubmit}
            />
            <input
              className="btn btn-secondary m-1"
              type="button"
              value="Reset"
              onClick={this.handleReset}
            />
          </form>
        </div>
        <fieldset id="listOfUser">
          <div className="container-fluid">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.list.map((person) => (
                  <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.name}</td>
                    <td>{person.address}</td>
                    <td>
                      <input
                        className="btn btn-info m-1"
                        type="button"
                        value="Edit"
                        onClick={() => this.handleEditUser(person)}
                      />
                      <input
                        className="btn btn-danger m-1"
                        type="button"
                        value="Delete"
                        onClick={() => this.handleDeleteUser(person)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default App;
