import "./App.css";
import React, { Component } from "react";
// import Paho from "paho-mqtt/paho-mqtt";
import pahoMqtt from "paho-mqtt/paho-mqtt";
import qr from "./qrcode_feeitadmin.github.io.png";
import home from "./home.png";

class App extends Component {
  state = {
    subject: "VirtualSmartHome/v2/",
    host: "broker.emqx.io",
    port: "8084",
    // host: "broker.mqttdashboard.com",
    // port: "8000",
    rooms: [
      { Name: "Bedroom_1", displayStyle: "block" },
      { Name: "Bedroom_2", displayStyle: "block" },
      { Name: "Bedroom_3", displayStyle: "block" },
      { Name: "Hallway_1F", displayStyle: "block" },
      { Name: "Bathroom_1F", displayStyle: "block" },
      { Name: "Bathroom_GF", displayStyle: "block" },
      { Name: "Kitchen", displayStyle: "block" },
      { Name: "Stairs", displayStyle: "block" },
      { Name: "Living_Room", displayStyle: "block" },
      { Name: "Cloakroom", displayStyle: "block" },
    ],
    connected: false,
    topic: "",
    client: {},
    messages: [],
  };

  toggleConnect = () => {
    if (this.state.connected) {
      console.log("Disconnect");
      this.startDisconnect();
    } else {
      console.log("Connect");
      this.startConnect();
    }
  };

  // Called after form input is processed
  startConnect = () => {
    // Generate a random client ID
    let clientID = "clientID-" + parseInt(Math.random() * 100);

    this.pushMessages([
      `Connecting to: ${this.state.host} on port: ${this.state.port}`,
      `Using the following client value: ${clientID}`,
      `-------------------------------------------------------------`,
    ]);

    // console.log(pahoMqtt.C)

    const client = new pahoMqtt.Client(
      this.state.host,
      Number(this.state.port),
      clientID
    );
    console.log(client);
    // Initialize new Paho client connection

    // Set callback handlers
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({
      onSuccess: this.onConnect,
      useSSL: true,
    });
    this.setState({ client });
  };

  // Called when the client connects
  onConnect = () => {
    for (let i = 0; i < this.state.rooms.length; i++) {
      let topic = `${this.state.subject}${this.state.rooms[i].Name}/Light`;
      this.state.client.subscribe(topic);

      this.pushMessages([`Subscribing to: ${topic}`]);
    }
    this.setState({ connected: true });
  };

  // Called when the client loses its connection
  onConnectionLost(responseObject) {
    console.log("onConnectionLost: Connection Lost");
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost: " + responseObject.errorMessage);
    }
    this.setState({ connected: false });
  }

  changeLight = (destination, payload) => {
    let room_name = destination.substring(
      this.state.subject.length,
      destination.indexOf("/Light")
    );
    console.log(room_name);
    console.log(this.state);
    console.log(destination);
    const rooms = this.state.rooms.map((r) => {
      if (r.Name === room_name) {
        r.displayStyle = payload === "1" ? "none" : "block";
      }
      return r;
    });
    this.setState({ rooms });
  };

  // Called when a message arrives
  onMessageArrived = (message) => {
    console.log("onMessageArrived: " + message.payloadString);

    this.pushMessages([
      `Topic: ${message.destinationName} | ${message.payloadString}`,
    ]);

    this.changeLight(message.destinationName, message.payloadString);

    this.updateScroll(); // Scroll to bottom of window
  };

  pushMessages = (messageArray) => {
    const messages = [...this.state.messages];
    for (let i = 0; i < messageArray.length; i++) {
      const message = messageArray[i];
      messages.push(message);
    }
    this.setState({ messages });
  };

  // Called when the disconnection button is pressed
  startDisconnect = () => {
    // this.setState({ connected: false });
    this.state.client.disconnect();
    this.pushMessages(["Disconnected"]);
    this.updateScroll(); // Scroll to bottom of window
  };

  // Updates #messages div to auto-scroll
  updateScroll() {
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
  }

  render() {
    return (
      <div className="wrapper">
        <h1>Connected Homes Demonstrator</h1>
        <div id="qr">
          <h3>Scan to Control</h3>
          <img
            src={qr}
            style={{ width: "100%" }}
            alt="QR code for virtual smart home controller"
          />
          <input
            type="button"
            onClick={() => this.toggleConnect()}
            value={this.state.connected ? "Disconnect" : "Connect"}
            style={{ background: this.state.connected ? "#dc3545" : "#28a745" }}
          />
          {/* <input
            type="button"
            onClick={() => this.startDisconnect()}
            disabled={!this.state.connected}
            value="Disconnect"
          /> */}
        </div>
        <div id="home-container">
          <img id="home" src={home} />

          <svg
            id="home-cover"
            width="100%"
            viewBox="0 0 9959 7330"
            version="1.1"
            style={{
              fillRule: "evenodd",
              clipRule: "evenodd",
              strokeLinecap: "round",
              strokeLineJoin: "round",
              strokeMiterLimit: "1.5",
            }}
          >
            <rect
              id="Artboard1"
              x="0"
              y="0"
              width="9958.33"
              height="7329.39"
              style={{ fill: "none" }}
            />
            <path
              id="Bathroom_GF"
              d="M4526.28,3849.31l-16.125,1354.49l1451.24,24.187l-104.812,-1427.05l-1330.3,48.375Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Bathroom_GF")
                  .displayStyle,
              }}
            />
            <path
              id="Kitchen"
              d="M5961.39,4067l201.56,3047.59l3184.65,16.125l-661.118,-3079.84l-2725.1,16.125Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Kitchen")
                  .displayStyle,
              }}
            />
            <path
              id="Cloakroom"
              d="M3728.1,3825.13l-24.188,806.241l838.492,0l16.124,-830.429l-830.428,24.188Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Cloakroom")
                  .displayStyle,
              }}
            />
            <path
              id="Stairs"
              d="M3663.6,4599.12l-24.187,1685.04l911.053,16.125l-16.125,-1707.88l-870.741,6.708Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Stairs")
                  .displayStyle,
              }}
            />
            <path
              id="Living_Room"
              d="M1349.69,3841.25l-532.119,3415.82l5353.44,16.124l-177.374,-1996.84l-1459.3,-16.124l0,1040.05l-911.053,-8.062l48.375,-2480.51l-2321.98,29.54Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Living_Room")
                  .displayStyle,
              }}
            />
            <path
              id="Bathroom_1F"
              d="M7294.91,239.234l109.649,1091.41l1833.15,-0l-193.499,-1104.31l-1749.3,12.9Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Bathroom_1F")
                  .displayStyle,
              }}
            />
            <path
              id="Bedroom_3"
              d="M3364.91,2532.04l-66.048,1022.47l3288.36,-9.908l-205.921,-2474.09l-1070.12,8.488l-0.554,-307.83l-905.469,4.012l-9.907,1743.65l-1030.34,13.21Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Bedroom_3")
                  .displayStyle,
              }}
            />
            <path
              id="Bedroom_2"
              d="M6397.68,1003.81l206.398,2574.78l3082.55,0l-386.996,-2074.08l-1947.88,12.9l-64.499,-515.995l-889.576,2.399Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Bedroom_2")
                  .displayStyle,
              }}
            />
            <path
              id="Bedroom_1"
              d="M887.392,194.212l-594.427,3381.19l2968.78,12.616l231.165,-3414.44l-2605.52,20.64Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Bedroom_1")
                  .displayStyle,
              }}
            />
            <path
              id="Hallway_1F"
              d="M3511.94,212.553l-151.17,2178.21l1007.8,-20.156l50.39,-1602.41l866.71,10.078l20.156,262.029l1089.1,0l-12.11,-230.44l899.654,-0.677l-70.547,-596.635l-3699.99,-0Z"
              style={{
                fillOpacity: "0.85",
                stroke: "#000",
                strokeWidth: "4.17px;",
                display: this.state.rooms.find((r) => r.Name === "Hallway_1F")
                  .displayStyle,
              }}
            />
          </svg>
        </div>
        {/* <form id="connection-information-form">
          <input
            type="button"
            onClick={() => this.startConnect()}
            value="Connect"
          />
          <input
            type="button"
            onClick={() => this.startDisconnect()}
            value="Disconnect"
          />
        </form> */}
        <div id="messages" style={{ visibility: "hidden" }}>
          {this.state.messages.map((m, i) => (
            <p key={i}>{m}</p>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
