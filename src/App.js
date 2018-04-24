import React, { Component } from 'react';
import logo from './logo.svg';
import fire from './fire';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { checkedInUsers: [] }
  }

  componentWillMount() {
    let users = fire.database().ref('users').orderByKey().limitToLast(10);
    users.on('child_added', snapshot => {
      let user = { name: snapshot.val(), checkedIn: true, id: snapshot.key };
      this.setState({ checkedInUsers: [...this.state.checkedInUsers, user] });
    });
    users.on('child_removed', snapshot => {
      let user = { name: snapshot.val(), checkedIn: true, id: snapshot.key };
      this.setState({ checkedInUsers: [...this.state.checkedInUsers.filter(u => u.id != user.id)] });
    })
  }

  checkinUser(e) {
    e.preventDefault();
    localStorage.setItem("user", this.name.value);
    fire.database().ref('users').orderByChild("name")
      .equalTo(this.name.value).once('value', snapshot => {
        if (snapshot.val()) {
          //if the user exists delete them
          let base = fire.database().ref('users').equalTo(this.name.value);
          base.getRef().remove();
        }
        else{
          fire.database().ref('users').push({ name: this.name.value, checkedIn: true });
        }
      });
  }

  render() {
    let name = localStorage.getItem("user");
    if(this.name != null){
      this.name.value = name;
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Scrounge Checkin</h1>
        </header>
        <form onSubmit={this.checkinUser.bind(this)}>
          <input type="text" ref={el => this.name = el} />
          <input type="submit" />
          <div style={{ textAlign: 'center' }}>
            {
              this.state.checkedInUsers.map(user => <h3 key={user.id}>{user.name.name}</h3>)
            }
          </div>
        </form>
      </div>
    );
  }
}

export default App;
