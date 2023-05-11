import { RICHWElem, RICMsgHandler } from "@robotical/ricjs";
import { MartyConnector } from "./MartyConnector";

export class RICNotificationsManager {
  private martyConnector: MartyConnector;
  constructor(martyConnector: MartyConnector) {
    this.martyConnector = martyConnector;
  }

  setNotificationsHandler(ricMsgHandler: RICMsgHandler) {
    ricMsgHandler.reportMsgCallbacksSet(
      "notifyCB",
      this.reportNofication.bind(this)
    );
  }


  msgBodyDecider(report: any, hwElems: RICHWElem[]) {
    switch (report.msgBody) {
      case "overCurrentDet":
        if (!report.hasOwnProperty("IDNo")) break;
        let motor = report.IDNo;
        const motorElem = hwElems.find(({ IDNo }) => IDNo === report.IDNo);

        if (motorElem !== undefined) {
          motor = motorElem.name;
        }
        break;

      case "freefallDet":
        break;

      // Button A pressed Case
      case "btnAPressed":
        break;
    }
  }

  // REPORT notifications are messages generated by RIC in response to certain events, including raw i2c events and motor safeties
  reportNofication(report: any): void {
    const ricSystem = this.martyConnector._ricConnector.getRICSystem();
    const hwElems = ricSystem.getCachedAllHWElems();

    console.log(`reportNotification Report callback ${JSON.stringify(report)}`);

    if (report.hasOwnProperty("msgType")) {
      if (report.msgType === "raw") {
        // raw messages are the responses to i2c commands, we don't want to tell the user about these
        return;
      }

      if (report.msgType === "warn" && report.hasOwnProperty("msgBody")) {
        this.msgBodyDecider(report, hwElems);
      }
    }
  }
}
