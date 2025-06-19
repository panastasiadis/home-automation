# Home Automation System on a Raspberry Pi

This project is a comprehensive home automation system developed as part of my diploma thesis, "A home automation system based on Raspberry Pi". It integrates hardware sensors, a backend server, a modern web client to provide real-time monitoring and control of a smart home environment.

## Project Structure

- **arduino/**  
  Contains firmware for various microcontroller-based sensors and actuators:
  - `pir_camera/`: Motion detection using a PIR sensor, reporting events via MQTT.
  - `light_intensity/`: Measures ambient light with a BH1750 sensor and publishes data over MQTT.
  - `dht11_relay/`: Monitors temperature and humidity (DHT11), and controls relays for devices like bulbs and heaters, with MQTT-based remote control.

- **server/**  
  Node.js backend that serves multiple roles:
  - Hosts an Express API for data access and user authentication.
  - Integrates an MQTT broker (Aedes) for real-time communication with IoT devices.
  - Manages device and sensor data storage using MongoDB.
  - Schedules actions and cleans up old sensor data.
  - Serves the web client as a static app.

- **client/**  
  A React-based web application for interacting with the smart home system:
  - Provides dashboards and controls for monitoring sensor data and managing devices.
  - Uses Material-UI for a modern interface.
  - Communicates with the backend via REST APIs and MQTT for real-time updates.

## Key Technologies

- **IoT & Embedded:** Arduino, ESP8266, MQTT, DHT11, BH1750, PIR sensors.
- **Backend:** Node.js, Express, Aedes MQTT broker, MongoDB, JWT authentication.
- **Frontend:** React, Material-UI, MQTT.js, Axios.

## Features

- Real-time sensor data collection and device control via MQTT.
- Secure user authentication and role management.
- Actions scheduling.
- Responsive web dashboard for monitoring and control.
- Modular firmware for easy extension with new sensors or actuators.
