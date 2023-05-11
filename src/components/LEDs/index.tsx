import "./styles.css";

type LEDsProps = {
  coloursArr: string[];
};

export default function LEDs({ coloursArr }: LEDsProps) {
  return (
    <div className="leds-colours-container">
      <div
        className="leds-colour-1"
        style={{ backgroundColor: coloursArr[0] }}
      ></div>
      <div
        className="leds-colour-2"
        style={{ backgroundColor: coloursArr[1] }}
      ></div>
      <div
        className="leds-colour-3"
        style={{ backgroundColor: coloursArr[2] }}
      ></div>
    </div>
  );
}
