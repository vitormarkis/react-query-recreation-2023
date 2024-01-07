import { KeyState, QueryStorageContext } from "@/hooks/QueryStorageContext";
import React from "react";

type Options<T> = {
  queryKey: string;
  queryFn(): Promise<T>;
};

export function useQuery<T>(options: Options<T>): KeyState<T> {
  const { queryFn, queryKey } = options;

  const storage = React.useContext(QueryStorageContext);
  const [queryState, queryStateSetters] = storage.getState<T>(queryKey);

  React.useEffect(() => {
    if (!queryState) {
      queryStateSetters.setIsLoading(true);
      queryFn()
        .then(queryStateSetters.setData)
        .catch(queryStateSetters.setError)
        .finally(() => queryStateSetters.setIsLoading(false));
    }
  }, []);

  return (
    queryState ??
    ({
      data: null,
      error: null,
      isLoading: true,
    } satisfies KeyState<T>)
  );
}
