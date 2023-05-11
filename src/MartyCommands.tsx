import martyConnector from "./MartyConnector/MartyConnector";

class MotionCommands {
    public commands: string[] = [];
    [key: string]: (() => void) | string[] | undefined;
    constructor() {
        //take all the methods in this class and add them to the commands array
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
            if (prop !== "constructor") {
                this.commands.push(prop);
            }
        }
        );
    }
    dance() {
        let marty_cmd = `traj/dance/1?moveTime=3000`;
        martyConnector.sendRestMessage(marty_cmd);
    }

    getReady() {
        martyConnector.sendRestMessage(`traj/getReady/?moveTime=3000`);
    }

    kickLeft() {
        martyConnector.sendRestMessage(`traj/kick/1/?moveTime=3000&side=0`);
    }

    kickRight() {
        martyConnector.sendRestMessage(`traj/kick/1/?moveTime=3000&side=1`);
    }

    circle() {
        martyConnector.sendRestMessage("traj/circle/1/?moveTime=2000&side=0");
    }

    hold() {
        martyConnector.sendRestMessage("traj/hold/?moveTime=1000");
    }

    lean() {
        martyConnector.sendRestMessage("traj/lean/1/?moveTime=1000&side=0");
    }

    liftFoot() {
        martyConnector.sendRestMessage("traj/liftFoot/1/?side=0");
    }

    lowerFoot() {
        martyConnector.sendRestMessage("traj/lowerFoot/1/?side=0");
    }

    joint() {
        martyConnector.sendRestMessage("traj/joint/1/?jointID=0&angle=10&moveTime=1000");
    }

    sidestep() {
        martyConnector.sendRestMessage("traj/sidestep/1/?side=0&moveTime=1000");
    }

    standStraight() {
        martyConnector.sendRestMessage("traj/standStraight/?moveTime=1000");
    }

    step1() {
        martyConnector.sendRestMessage("traj/step/1/?moveTime=1500&turn=20&stepLength=1");
    }

    step2Forward() {
        martyConnector.sendRestMessage("traj/step/2/?moveTime=1500&stepLength=25");
    }

    step2Backward() {
        martyConnector.sendRestMessage("traj/step/2/?moveTime=1500&stepLength=-25");
    }

    step1Turn() {
        martyConnector.sendRestMessage("traj/step/1/?stepLength=0&moveTime=1000&turn=1");
    }

    waveRight() {
        martyConnector.sendRestMessage("traj/wave/1/?side=0");
    }

    waveLeft() {
        martyConnector.sendRestMessage("traj/wave/1/?side=1");
    }

    wiggle() {
        martyConnector.sendRestMessage("traj/wiggle/1/?moveTime=4000");
    }
}

class LooksCommands {
    public commands: string[] = [];
    [key: string]: (() => void) | string[] | undefined;
    constructor() {
        //take all the methods in this class and add them to the commands array
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
            if (prop !== "constructor") {
                this.commands.push(prop);
            }
        }
        );
    }
    // LOOKS
    ledEyesRed() {
        martyConnector.sendRestMessage("led/LEDeye/color/ff0000");
    }

    leftLedEyeRed() {
        martyConnector.sendRestMessage("led/LeftLEDeye/color/ff0000");
    }

    turnOffEyes() {
        martyConnector.sendRestMessage("led/LEDeye/off");
    }

    eyesExcited() {
        martyConnector.sendRestMessage("traj/eyesExcited");
    }

    eyesWide() {
        martyConnector.sendRestMessage("traj/eyesWide");
    }

    eyesWiggle() {
        martyConnector.sendRestMessage("traj/wiggleEyes");
    }

    eyesNormal() {
        martyConnector.sendRestMessage("traj/eyesNormal");
    }

    ledShowOff() {
        martyConnector.sendRestMessage("led/LEDeye/pattern/show-off");
    }

    ledPinwheel() {
        martyConnector.sendRestMessage("led/LEDeye/pattern/pinwheel");
    }

    ledOff() {
        martyConnector.sendRestMessage("led/LEDeye/off");
    }

    ledSetLed() {
        martyConnector.sendRestMessage("led/LEDeye/setled/5/ff0000");
    }


}

class StreamCommands {
    public commands: string[] = [];
    [key: string]: (() => void) | string[] | undefined;
    constructor() {
        //take all the methods in this class and add them to the commands array
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((prop) => {
            if (prop !== "constructor") {
                this.commands.push(prop);
            }
        }
        );
    }
    async streamAudio() {
        const filePath = "./sounds/sound1.mp3";
        const audioDuration = 3000;
        const fileData = await fetch(filePath);
        console.log(fileData);
        const audioBuffer = await fileData.arrayBuffer();
        const audioData = new Uint8Array(audioBuffer);
        martyConnector.streamAudio(audioData, audioDuration, true);
    }
}

export class MartyCommands {
    public motionInstance: MotionCommands = new MotionCommands();
    public looksInstance: LooksCommands = new LooksCommands();
    public streamInstance: StreamCommands = new StreamCommands();

    public motionCommands: string[] = this.motionInstance.commands;
    public looksCommands: string[] = this.looksInstance.commands;
    public streamCommands: string[] = this.streamInstance.commands;
    [key: string]: (() => void) | string[] | undefined | MotionCommands | LooksCommands | StreamCommands;
}

const martyCommands = new MartyCommands();
export default martyCommands;