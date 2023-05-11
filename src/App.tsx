import { useState, useEffect, JSX } from "react"; 
import Step1Scan from "./steps/Step1-Scan"; 
import styles from "./styles/app.module.css"; 
import Step2Verification from "./steps/Step2-Verification"; 
import Step3Commands from "./steps/Step3Commands"; 

// Define the main App component
export default function App() {
  // Declare state variables
  const [steps, setSteps] = useState<{ component: JSX.Element, label: string }[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // When the component mounts, set the steps array
  useEffect(() => {
    setSteps([
      { component: <Step1Scan nextStep={() => setCurrentStep(currStep => currStep + 1)} />, label: "Scan" },
      { component: <Step2Verification nextStep={() => setCurrentStep(currStep => currStep + 1)} />, label: "Verify your Marty" },
      { component: <Step3Commands />, label: "Marty Commands" }
    ])
  }, []);

  // Render the component
  return (
    <div className={styles.container}>
      <h1>Step {currentStep + 1}: {steps[currentStep]?.label}</h1>  {/* Display the current step number and label */}
      {steps[currentStep]?.component} {/* Display the component for the current step */}
    </div>
  );
}
