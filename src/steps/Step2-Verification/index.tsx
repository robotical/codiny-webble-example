import { RICConnEvent, RICUpdateEvent } from "@robotical/ricjs";
import { useEffect, useState } from "react";

import LEDs from "../../components/LEDs";
import martyConnector from "../../MartyConnector/MartyConnector";

// Define the type for the properties this component expects
type Props = {
    nextStep: () => void;
}

// Define the Step2Verification functional component
function Step2Verification({ nextStep }: Props) {
    // Declare state variables
    const [randomColours, setRandomColours] = useState<string[]>([]);
    const [martyName, setMartyName] = useState("");
    const [feedback, setFeedback] = useState<string>("");

    // When the component mounts, set Marty's name and initiate verification
    useEffect(() => {
        setMartyName(martyConnector.RICFriendlyName);
        martyConnector.verifyMarty();
    }, []);

    // Function to finalise the connection when user confirms the LEDs' colours
    const onYes = async () => {
        setFeedback("Finalising connection...");
        await martyConnector.stopVerifyingMarty(true);
        setFeedback("");
        nextStep();
    };

    // Helper object for subscribing to Marty connector's events
    const martyConnectorSubscriptionHelper = {
        // Event handler
        notify(
            eventType: string,
            eventEnum: RICConnEvent | RICUpdateEvent,
            eventName: string,
            eventData: string | object | null | undefined
        ) {
            // For connection events
            switch (eventType) {
                case "conn":
                    switch (eventEnum) {
                        // When Marty's LEDs are being verified, set the colours state
                        case RICConnEvent.CONN_VERIFYING_CORRECT_RIC:
                            setRandomColours(eventData as string[]);
                            break;
                        default:
                            break;
                    }
                    break;
            }
        },
    };

    // Subscribe to Marty connector's events when the component mounts, and unsubscribe when it unmounts
    useEffect(() => {
        martyConnector.subscribe(martyConnectorSubscriptionHelper, ["conn"]);
        return () => {
            martyConnector.unsubscribe(martyConnectorSubscriptionHelper);
        };
    }, []);

    // Render the component
    return (
        <div>
            <p>{martyName}</p>
            <p>Look on Marty's back, is it displaying these lights?</p>
            <div>
                <LEDs coloursArr={randomColours} />
            </div>
            <p>{feedback}</p>
            <button onClick={onYes}> Yes </button>
        </div>
    );
}

export default Step2Verification;
