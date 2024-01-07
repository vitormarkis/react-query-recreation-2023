import React from "react";

interface IQueryStorageContext {
  getState<T>(queryKey: string): [state: KeyState<T> | null, setter: KeySetter];
  cache: Cache;
}

export const QueryStorageContext = React.createContext(
  {} as IQueryStorageContext
);

export type KeyState<T> = {
  data: T | null;
  isLoading: boolean;
  error: unknown;
};

export type KeySetter = {
  setIsLoading: (isLoading: boolean) => void;
  setData: <T>(data: T) => void;
  setError: (error: unknown) => void;
};

type Cache = Record<string, KeyState<any>>;

type Action<T = any> =
  | {
      type: "SET_IS_LOADING";
      payload: {
        queryKey: string;
        isLoading: boolean;
      };
    }
  | {
      type: "SET_DATA";
      payload: {
        queryKey: string;
        data: T;
      };
    }
  | {
      type: "SET_ERROR";
      payload: {
        queryKey: string;
        error: unknown;
      };
    };

function reducer(state: Cache, action: Action) {
  switch (action.type) {
    case "SET_IS_LOADING": {
      return {
        ...state,
        [action.payload.queryKey]: {
          ...state[action.payload.queryKey],
          isLoading: action.payload.isLoading,
        },
      };
    }
    case "SET_DATA": {
      return {
        ...state,
        [action.payload.queryKey]: {
          ...state[action.payload.queryKey],
          data: action.payload.data,
        },
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        [action.payload.queryKey]: {
          ...state[action.payload.queryKey],
          error: action.payload.error,
        },
      };
    }
  }
}

export function QueryProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(reducer, {} as Cache);

  const setIsLoading = React.useCallback(function setIsLoading(
    queryKey: string,
    isLoading: boolean
  ) {
    dispatch({ type: "SET_IS_LOADING", payload: { queryKey, isLoading } });
  }, []);

  const setData = React.useCallback(function setData<T>(
    queryKey: string,
    data: T
  ) {
    dispatch({ type: "SET_DATA", payload: { queryKey, data } });
  }, []);

  const setError = React.useCallback(function setError<T>(
    queryKey: string,
    error: unknown
  ) {
    dispatch({ type: "SET_ERROR", payload: { queryKey, error } });
  }, []);

  const getSetter = React.useCallback(function getSetter(
    queryKey: string
  ): KeySetter {
    return {
      setIsLoading: (isLoading: boolean) => setIsLoading(queryKey, isLoading),
      setData: <T extends any>(data: T) => setData(queryKey, data),
      setError: (error: unknown) => setError(queryKey, error),
    };
  }, []);

  const getState = React.useCallback(
    function getState<T>(
      queryKey: string
    ): [state: KeyState<T> | null, setter: KeySetter] {
      const foundState = state[queryKey];
      return [foundState ?? null, getSetter(queryKey)];
    },
    [state, getSetter]
  );

  return (
    <QueryStorageContext.Provider
      value={{
        getState,
        cache: state,
      }}
    >
      {children}
    </QueryStorageContext.Provider>
  );
}
