import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: '', message: '', dwld_message: '', selectedFile: null};
    this.submitClick = this.submitClick.bind(this);
    this.upClick = this.upClick.bind(this);
    this.downClick = this.downClick.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
  }

  // getVerification() {
  //   fetch("http://localhost:8080" + "/verify" + "?firstName=" + this.state.firstname + "&lastName=" + this.state.lastname, {
  //     method: 'GET',
  //     credentials: 'include',
  //     mode: 'cors'
  //   }).then(res => res.text()).then((response) => {
  //     this.setState({message: response});
  //   });
  // }

  nameChange(event) {
    this.setState({name: event.target.value});
  }

  messageChange(event) {
    this.setState({message: event.target.value});
  }

  submitClick(event) {
    event.preventDefault();
    this.setState({dwld_message: "Your file is downloading"});
    const data = new FormData();
    data.append('file', this.state.selectedFile);
    axios.post("http://localhost:8000/upload", data, {})
        .catch(e => {
          console.log(e.message);
        })
        .then(res => {
          console.log(res.statusText);
        });
  }

  onUploadClick(event) {
    this.setState({selectedFile: event.target.files[0]});
  }

  upClick(event) {
    document.getElementsByClassName('upButton').background = "blue";
    document.getElementsByClassName('downButton').background = "white";
  }

  downClick(event) {
    document.getElementsByClassName('downButton').background = "blue";
    document.getElementsByClassName('upButton').background = "white";
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
          <div className="file-upload">
            <label>
              Upload
            </label>
            <input type="file" className = "uploadFile" onChange={this.onUploadClick}/>
          </div>
          <div className = "transpose">
            <h4>Tranpose: 
              <button type="number">number</button>
              half steps
              <button className = "upButton" onClick = {this.upClick}>up</button>
              <button className = "downButton" onClick = {this.downClick}>down</button>
            </h4>
          </div>  
          <div>
            <button className = "submit" onClick = {this.submitClick}>Submit</button>
          </div>
          <div>
            <h1>{this.state.message} </h1>
          </div>    
        </div>
        <div className = "questionsForm">
          <h2>Questions or Concerns? Shoot me a message below.</h2>
          <label>
            Name:
            <input className = "nameInput" type="text" value={this.state.name} onChange={this.nameChange} />
          </label>
          <label>
            Message:
            <input className = "messageInput" type="text" value={this.state.message} onChange={this.messageChange} />
          </label>
          <button className = "submit">Submit</button>
        </div>  
      </div>
    );
  }
}

export default App;
