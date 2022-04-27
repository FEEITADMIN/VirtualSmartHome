# Virtual Smart Home

This is a modification of a simple application create for my students on an IoT module at Northumbria University.

The purpose of this application is to demonstrate MQTT brokers and the pub/sub approach for IoT data transmission.

I created a separate project as HIVEMQ (The MQTT broker used on previous project did not have SSL so did not work on GitHub pages)

## Usage

To use this application head to [https://feeitadmin.github.io/VirtualSmartHome/](https://feeitadmin.github.io/VirtualSmartHome/)

Click Connect to connect to the public broker [https://www.emqx.io/](https://www.emqx.io/)

![https://i.imgur.com/nDgdZO8.png](https://i.imgur.com/nDgdZO8.png)

Lights can be turned off by publishing ("0" or "1") messages to the broker using the following variables.

```js
let host = broker.emqx.io;
let port = 8084;
let subject = "VirtualSmartHome/";
let topic = "Bedroom/Light";
```

Alternatively you can go to [https://feeadmin.github.io/VirtualSmartHomeController/](https://feeadmin.github.io/VirtualSmartHomeController/)

This is a very simple application with toggle controls for turning the lights on and off:

![https://i.imgur.com/ww1igiK.png](https://i.imgur.com/ww1igiK.png)

## Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
