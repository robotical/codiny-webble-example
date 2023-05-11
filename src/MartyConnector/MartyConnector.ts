// Import required classes and types
import {
  RICOKFail,
  RICConnector,
  RICConnEvent,
  RICUpdateEvent,
  RICServoParamUpdate,
  RICSystemInfo
} from "@robotical/ricjs";
import { MartyObserver } from "./MartyObserver";
import { RICNotificationsManager } from "./RICNotificationsManager";
import { RICRoboticalAddOns } from "@robotical/ricjs-robotical-addons";

// The MartyConnector class handles the connection and communication with Marty the Robot
export class MartyConnector {
  // RICConnector instance to handle the connection with Marty
  public _ricConnector = new RICConnector();

  // A dictionary of observer instances to handle different types of events
  private _observers: { [key: string]: Array<MartyObserver> } = {};

  // RICNotificationsManager instance to handle RIC notifications
  private _ricNotificationsManager: RICNotificationsManager = new RICNotificationsManager(this);

  // Marty's friendly name
  public RICFriendlyName: string = "";

  // Predefined colours to use for LED patterns
  private ledLcdColours = [
    { led: "#202000", lcd: "#FFFF00" },
    { led: "#880000", lcd: "#FF0000" },
    { led: "#000040", lcd: "#0080FF" },
  ];

  // Marty's version
  public martyVersion: string = "0.0.0";

  // Marty's system info
  public systemInfo: RICSystemInfo | null = null;

  // Constructor
  constructor() {
    // Initialise servo parameters update for downloading servo parameters
    const spu = RICServoParamUpdate.getSingletonInstance(this._ricConnector.getRICMsgHandler());
    spu && spu.init();

    // Register addons with the AddOnManager
    const addOnManager = this._ricConnector.getAddOnManager();
    RICRoboticalAddOns.registerAddOns(addOnManager);

    // Subscribe to RICConnector events
    this._ricConnector.setEventListener(
      (
        eventType: string,
        eventEnum: RICConnEvent | RICUpdateEvent,
        eventName: string,
        eventData: string | object | null | undefined
      ) => {
        console.log(
          `eventType: ${eventType} eventEnum: ${eventEnum} eventName: ${eventName} eventData: ${eventData}`
        );
        this.publish(eventType, eventEnum, eventName, eventData);
      }
    );
  }

  // Method to check if the Marty is connected
  isConnected(): boolean {
    if (this._ricConnector) {
      return this._ricConnector.isConnected();
    }
    return false;
  }

  // Method to connect to a RIC (Marty), takes a method ("WebBLE" or "WebSocket") and a locator (WebSocket URL or WebBLE object)
  async connect(method: string, locator: string | object): Promise<boolean> {
    // Disconnect if already connected
    if (this._ricConnector && this._ricConnector.isConnected()) {
      await this._ricConnector.disconnect();
    }

    // Connect to RIC
    let success = await this._ricConnector.connect(method, locator);
    if (!success) {
      console.log("Failed to connect to RIC");
      return false;
    }

    // Get system info
    const sysInfoOk = await this._ricConnector.retrieveMartySystemInfo();
    if (!sysInfoOk) {
      return false;
    }
    return true;
  }

  // Method to verify if the connected device is the Marty we want to connect to (there may be multiple Martys in the vicinity)
  async verifyMarty() {
    return this._ricConnector.checkCorrectRICStart(this.ledLcdColours);
  }

  // Method to stop verifying Marty, it also handles post-connection setup 
  async stopVerifyingMarty(confirmCorrectRIC: boolean) {
    if (confirmCorrectRIC) {
      // If successful connection to Marty
      const ricSystem = this._ricConnector.getRICSystem();

      // Get system info
      const systemInfo = await ricSystem.getRICSystemInfo(true);
      this.systemInfo = systemInfo;
      this.martyVersion = systemInfo.SystemVersion;

      // Set up notification handler to display warning messages from RIC to the user
      this._ricNotificationsManager.setNotificationsHandler(
        this._ricConnector.getRICMsgHandler()
      );

      // Update servo parameters
      const spu = RICServoParamUpdate.getSingletonInstance();
      spu && spu.setRobotConnected(true);
    }
    return this._ricConnector.checkCorrectRICStop(confirmCorrectRIC);
  }

  // Method to disconnect from RIC
  async disconnect(): Promise<boolean> {
    await this._ricConnector?.disconnect();
    return true;
  }

  // Method to get the cached friendly name of RIC
  getCachedRICName() {
    return this.RICFriendlyName;
  }

  // Method to get the friendly name of RIC from the connected device
  async getRICName() {
    const ricSystem = this._ricConnector.getRICSystem();
    const nameObj = await ricSystem.getRICName();
    this.RICFriendlyName = nameObj.friendlyName;
    return nameObj.friendlyName;
  }

  // Method to send a REST message to the connected device
  async sendRestMessage(msg: string, params?: object): Promise<RICOKFail> {
    if (this._ricConnector) {
      return this._ricConnector.sendRICRESTMsg(msg, params || {});
    }
    return new RICOKFail();
  }

  // Method to stream audio to the connected device
  async streamAudio(audioData: Uint8Array, duration: number, clearExisting?: boolean): Promise<boolean> {
    if (this._ricConnector) {
      this._ricConnector.streamAudio(audioData, !!clearExisting, duration);
      return true;
    }
    return false;
  }

  // Method to subscribe an observer to specific topics
  subscribe(observer: MartyObserver, topics: Array<string>): void {
    for (const topic of topics) {
      if (!this._observers[topic]) {
        this._observers[topic] = [];
      }
      if (this._observers[topic].indexOf(observer) === -1) {
        this._observers[topic].push(observer);
      }
    }
  }

  // Method to unsubscribe an observer from all topics
  unsubscribe(observer: MartyObserver): void {
    for (const topic in this._observers) {
      if (this._observers.hasOwnProperty(topic)) {
        const index = this._observers[topic].indexOf(observer);
        if (index !== -1) {
          this._observers[topic].splice(index, 1);
        }
      }
    }
  }

  // Method to publish an event to all subscribed observers
  publish(
    eventType: string,
    eventEnum: RICConnEvent | RICUpdateEvent,
    eventName: string,
    eventData: string | object | null | undefined
  ): void {
    if (this._observers.hasOwnProperty(eventType)) {
      for (const observer of this._observers[eventType]) {
        // Continue from last line
        // observer.notify method notifies the observer with the event details
        observer.notify(eventType, eventEnum, eventName, eventData);
      }
    }
  }

}

// Instantiate MartyConnector
const martyConnector = new MartyConnector();

// Export the MartyConnector instance
export default martyConnector;