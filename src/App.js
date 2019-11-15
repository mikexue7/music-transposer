import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {firstname: '', lastname: '', message: ''};
  }

  getVerification() {
    fetch("http://localhost:8080" + "/verify" + "?firstName=" + this.state.firstname + "&lastName=" + this.state.lastname, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    }).then(res => res.text()).then((response) => {
      this.setState({message: response});
    });
  }

  firstNameChange(event) {
    this.setState({firstname: event.target.value});
  }

  lastNameChange(event) {
    this.setState({lastname: event.target.value});
  }

  submitClick(event) {
    event.preventDefault();
    this.getVerification();
  }

  render() {
    return (
      <div>
        <div className = "header" >
          <h1 className = "title"> Music Transposition </h1>
        </div>
        <div className = "description">
          <h2 className = "descriptionTitle">Description</h2>
          Music Transposition enables you to import an audio file and transpose it to a different key.
          If you've ever wanted to sing along to that song that's just too high, this is for you.
        </div>
        <div className = "upload" >
          <h2 className = "uploadFile">Upload File</h2>
          <button className = "uploadButton" onClick = {this.buttonClick.bind(this)}>From Computer</button>
          <div className = "transpose">
            <h4>Tranpose: 
              <button onClick = {this.buttonClick.bind(this)}>number</button>
              half steps
              <button onClick = {this.buttonClick.bind(this)}>up/down</button>
            </h4>
          </div>  
          <div>
            <button className = "submit" onClick = {this.submitClick}>Submit</button>
          </div>
          <div>
            {this.state.message}  
          </div>      
        </div>
      </div>
    );
  }
}

export default App;
