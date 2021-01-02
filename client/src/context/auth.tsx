import { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "types";
import useApi from "api/index";

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action {
  type: string;
  payload?: any;
}

const StateContext = createContext<State>({
  authenticated: false,
  user: null,
  loading: true,
});
const DispatchContext = createContext(null);

function reducer(state: State, { type, payload }: Action) {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };

    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };

    case "SET_LOADING":
      return { ...state, loading: false };

    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });
  const { API } = useApi();

  useEffect(() => {
    API.post("/auth/me")
      .then((res: any) => {
        dispatch({ type: "LOGIN", payload: res.data });
      })
      .catch(err => console.log({ authContextMeError: err }))
      .finally(() => {
        dispatch({ type: "SET_LOADING" });
      });
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
