import React, { Component } from 'react';
import { Header } from './Header';
import { Main } from './Main';

class App extends Component {
    state = {
        isLoggedIn: false
    }

    handleLogin = () => {
        this.setState({ isLoggedIn: true});
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false});
    }

  render() {
    console.log("isLoggedIn: " + this.state.isLoggedIn);
    return (
      <div className="App">
          <Header isLoggedIn={this.state.isLoggedIn} handleLogout={this.handleLogout}/>
          <Main isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin}/>
      </div>
    );
  }
}

export default App;
