/* eslint-disable @typescript-eslint/ban-ts-comment */

import { StateCreator } from "zustand";
import { PersistOptions } from "zustand/middleware";

const safeParseJSON = (json: string | undefined | null) => {
  try {
    // @ts-ignore
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
};

export interface SyncOptions extends PersistOptions<unknown> {
  enabled: boolean;
}

const sync =
  <T extends object>(
    stateCreator: StateCreator<T>,
    options = {} as SyncOptions
  ): StateCreator<T> =>
  (set, get, api) => {
    const { enabled, name } = options;

    const shouldSync = enabled && globalThis?.localStorage;
    if (shouldSync) {
      window.addEventListener("storage", (e) => {
        const isStoreUpdate = e.key === name;
        if (!isStoreUpdate) return;

        const currentState = get() as Record<string, unknown>;
        const newState = safeParseJSON(e.newValue)?.state;

        const hasShallowUpdate = Object.keys(newState).some((key) => {
          return newState[key] !== currentState[key];
        });

        if (!hasShallowUpdate) return;
        set(newState);
      });
    }

    return stateCreator(set, get, api);
  };

export default sync;
