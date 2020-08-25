import { useRef, useCallback } from "react";

export type RefCallback<T> = (ref: T) => void;

/**
 * @param onInit called on new ref when new ref is a non-null value.
 * @param onCleanup called on old ref if it exists when ref value is updated to a new value.
 * @see https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
 */
export const useRefCallback = <T>(onInit: RefCallback<T>, onCleanup?: RefCallback<T>) => {
  const ref = useRef<T | null>(null);
  return useCallback(
    (newRef: T | null) => {
      if (ref.current) {
        onCleanup?.(ref.current);
      }

      if (newRef) {
        onInit(newRef);
      }

      ref.current = newRef;
    },
    [onCleanup, onInit]
  );
};