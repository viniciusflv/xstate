import React from "react";
import { useXMachine, FormStates } from "./machine";

function App() {
  const [state, actions] = useXMachine();

  return (
    <div>
      {state.matches(FormStates.FINAL) && (
        <span>
          Data collected {state.context.name} {state.context.email}
        </span>
      )}
      {state.matches(FormStates.CONFIRMATION) && (
        <div>
          <span>
            Confirm {state.context.name} {state.context.email}
          </span>
          <button onClick={actions.NEXT}>confirm</button>
          <button onClick={actions.RESET}>reset</button>
        </div>
      )}
      {state.matches(FormStates.COLLECT_INPUT) && (
        <form>
          <input
            onChange={({ target: { value } }: any) =>
              actions.CHANGE({ name: value })
            }
          />
          <input
            type="email"
            onChange={({ target: { value } }: any) =>
              actions.CHANGE({ email: value })
            }
          />
          <button onClick={actions.NEXT}>submit</button>
        </form>
      )}
    </div>
  );
}

export default App;
