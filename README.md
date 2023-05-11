# Marty Robot Connection Manager

This project is an interface to connect with and control a Marty robot. The application consists of three steps:

1. Scan for Marty
2. Verify your Marty
3. Marty Commands

## Application Structure

The project is divided into a few key parts:

### MartyConnector

This class is responsible for managing the connection to a Marty robot. It is also a bridge between the RICJS library and the rest of the application. It includes methods to:

- Connect to a robot
- Verify the robot
- Disconnect from the robot
- Send messages to the robot
- Stream audio to the robot

### Steps

These are the main steps user goes through to connect with and control a Marty:

- `Step1Scan`: This component initiates a scan for Marty robots using Web Bluetooth API and establishes a connection with the selected device.

- `Step2Verification`: This component sends random LED color signals to the Marty robot and asks the user to verify if the colors match. This ensures the user is connecting to the correct Marty robot in case there are multiple Martys in the room.

- `Step3Commands`: This is where the user would send commands to the robot.

### App

This is the main component of the application, which manages the current step and transitions between steps.

## Installation

1. Clone the repository: `git clone https://github.com/robotical/codiny-webble-example.git`
2. Navigate to the project directory: `cd codiny-webble-example`
3. Install the dependencies: `npm install`
4. Start the application: `npm start`
