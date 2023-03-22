import { useEffect, useRef, useState } from "react";

export const useViewTransition = <T>(state: T): T => {
  const [internalState, setInternalState] = useState(state);
  const isTransitioning = useRef(false);
  const resolveUpdate = useRef<() => void>();

  if (
    // @ts-expect-error
    document.startViewTransition &&
    state !== internalState &&
    !isTransitioning.current
  ) {
    isTransitioning.current = true;
    // @ts-expect-error
    document.startViewTransition(() => {
      setInternalState(state);

      return new Promise<void>((r) => {
        resolveUpdate.current = r;
      });
    });
  }

  useEffect(() => {
    if (resolveUpdate.current) {
      resolveUpdate.current();
      resolveUpdate.current = undefined;
      isTransitioning.current = false;
    }
  }, [internalState]);

  // @ts-expect-error
  return document.startViewTransition ? internalState : state;
};
