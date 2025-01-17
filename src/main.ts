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
    options = { enabled: true } as SyncOptions
  ): StateCreator<T> =>
  (set, get, api) => {
    const { enabled, name } = options;

    const shouldSyncFromLocalStorage =
      enabled && name && globalThis?.localStorage;
    const shouldSyncWithoutStorage =
      enabled && !name && globalThis?.BroadcastChannel;

    let _set = set;

    if (shouldSyncFromLocalStorage) {
      window.addEventListener("storage", (e) => {
        const isStoreUpdate = e.key === name;
        if (!isStoreUpdate) return;

        const currentState = get() as Record<string, unknown>;
        const newState = safeParseJSON(e.newValue)?.state;

        const hasShallowChange = Object.keys(newState).some((key) => {
          return newState[key] !== currentState[key];
        });

        if (!hasShallowChange) return;
        set(newState);
      });
    } else if (shouldSyncWithoutStorage) {
      const channel = new BroadcastChannel("zustand-sync-tabs-channel");

      channel.onmessage = (e) => {
        const newState = e.data;
        set(newState);
      };

      _set = (newState) => {
        const currentState = get() as Record<string, unknown>;
        const hasShallowChange = Object.keys(newState).some((key) => {
          return newState[key] !== currentState[key];
        });

        if (!hasShallowChange) return;
        channel.postMessage(newState);
        set(newState);
      };
    }

    return stateCreator(_set, get, api);
  };

export default sync;
