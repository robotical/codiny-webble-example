import { useState } from "react";
import martyConnector from "../../MartyConnector/MartyConnector";
import { RICChannelWebBLE } from "@robotical/ricjs";

// Define the type for the properties this component expects
type Props = {
    nextStep: () => void;
}

// Define the Step1Scan functional component
export default function Step1Scan({ nextStep }: Props) {
    // Declare state variables for Bluetooth device and feedback string
    const [device, setDevice] = useState<BluetoothDevice | null>(null);
    const [feedback, setFeedback] = useState<string>("");

    // Define a function to connect to Marty via Web Bluetooth
    async function connectToMarty() {
        // Check if Web Bluetooth is supported
        if (navigator.bluetooth === undefined) {
            return alert("Web Bluetooth is not supported in this browser, or bluetooth is disabled/permission denied. Please try again in a different browser.");
        }
        // Request a device using the specific service UUID
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [RICChannelWebBLE.RICServiceUUID] }],
            optionalServices: [],
        });
        // Update feedback state
        setFeedback("Connecting to Marty...");
        console.log(`Selected device: ${device.name} id ${device.id}`);
        // Attempt to connect to Marty using the device selected
        if (await martyConnector.connect("WebBLE", device)) {
            // Update device state
            setDevice(device);
            // Proceed to next step
            nextStep();
        } else {
            console.log("Failed to connect to BLE");
        }
        // Reset feedback state
        setFeedback("");
    }

    // Render the component
    return (
        <div>
            <p>{device ? `Connected to: ${device.name}` : 'No device connected'}</p>
            <p>{feedback}</p>
            <button onClick={connectToMarty}>Scan for Marty</button>
        </div>
    );
}
