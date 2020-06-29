import {
  Machine,
  AnyStateNodeDefinition,
  assign,
  InterpreterOptions,
  MachineOptions,
  EventObject,
  StateConfig,
} from "xstate";
import { useMachine } from "@xstate/react";

const context = {
  name: "",
  email: "",
};

export enum FormStates {
  COLLECT_INPUT = "COLLECT_INPUT",
  CONFIRMATION = "CONFIRMATION",
  FINAL = "FINAL",
}

export enum FormEvents {
  NEXT = "NEXT",
  CHANGE = "CHANGE",
  RESET = "RESET",
}

type XEvent<T> = { type: T };

type XStateSchema<T extends string | number> = {
  states: { [key in T]: AnyStateNodeDefinition };
};

interface UseMachineOptions<TContext, TEvent extends EventObject> {
  context?: Partial<TContext>;
  immediate: boolean;
  state?: StateConfig<TContext, TEvent>;
}

type XMachineOptions<C, E extends EventObject> = Partial<InterpreterOptions> &
  Partial<UseMachineOptions<C, E>> &
  Partial<MachineOptions<C, E>>;

const XMachine = Machine<
  typeof context,
  XStateSchema<FormStates>,
  XEvent<FormEvents>
>({
  id: "X",
  initial: FormStates.COLLECT_INPUT,
  context,
  states: {
    COLLECT_INPUT: {
      on: {
        CHANGE: {
          actions: assign((_, value: object) => ({ ...value })),
        },
        NEXT: {
          target: FormStates.CONFIRMATION,
        },
      },
    },
    CONFIRMATION: {
      on: {
        NEXT: { target: FormStates.FINAL },
        RESET: { target: FormStates.COLLECT_INPUT },
      },
    },
    FINAL: { type: 'final' },
  },
});

export const useXMachine = (
  options?: XMachineOptions<typeof context, XEvent<FormEvents>>
) => {
  const [state, dispatch, interpreter] = useMachine(XMachine, options);
  const actions = {
    RESET: () => dispatch({ type: FormEvents.RESET }),
    NEXT: () => dispatch({ type: FormEvents.NEXT }),
    CHANGE: (payload = {}) => dispatch({ type: FormEvents.CHANGE, ...payload }),
  };
  return [state, actions, interpreter] as [
    typeof state,
    typeof actions,
    typeof interpreter
  ];
};
