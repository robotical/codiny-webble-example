import martyCommands from "../../MartyCommands";

function Step3Commands() {

    return (
        <div>
            <div style={{
                display: "grid",
                rowGap: "1rem",
            }}>
                <div>
                    <p>Motion</p>
                    {martyCommands.motionCommands.map((command, index) => {
                        return <button style={{margin: 2}} key={index} onClick={() => (martyCommands.motionInstance[command] as () => void)?.()} >{command}</button>
                    })}
                </div>

                <div>
                    <p>Looks</p>
                    {martyCommands.looksCommands.map((command, index) => {
                        return <button style={{margin: 2}} key={index} onClick={() => (martyCommands.looksInstance[command] as () => void)?.()} >{command}</button>
                    })}
                </div>

                <div>
                    <p>Sound Stream</p>
                    {martyCommands.streamCommands.map((command, index) => {
                        return <button style={{margin: 2}} key={index} onClick={() => (martyCommands.streamInstance[command] as () => void)?.()} >{command}</button>
                    })}
                </div>

            </div>
        </div>
    );
}

export default Step3Commands;