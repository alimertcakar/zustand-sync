# Zustand Sync Middleware

This middleware for Zustand allows you to synchronize store data between different browser tabs. When the state changes in one tab, the updated state will be reflected in all other open tabs. You can use this with zustand/persist with no issues.
Syncing is only supported with localStorage (duh).

Demo: https://zustand-sync.netlify.app/  
Codesandbox: https://codesandbox.io/p/sandbox/zustand-sync-zk5dvg

## Installation

To install the middleware, you can use pnpm, npm or yarn:

```sh
pnpm add zustand-sync-middleware
# or
npm install zustand-sync-middleware
# or
yarn add zustand-sync-middleware
```

## Usage

To use the middleware, import it and apply it to your Zustand store:

```typescript
import create from "zustand";
import sync from "zustand-sync-middleware";

const useStore = create(
  sync((set) => ({
    // ...your slices
  }))
);
```

## Usage with zustand/persist

You have to put `sync` middleware before `persist` middleware. Share the key you used to persist your store at. (This is used to watch `localStorage[persistanceKey]`)
Additionally, you can add `enabled: false` to skip the middleware.

```typescript
const storageUnit = localStorage;
const persistanceKey = "persisted-store";

const persistOptions = {
  name: persistanceKey,
  storage: createJSONStorage(() => storageUnit),
  partialize: (state) => ({
    count: state.count,
    name: state.name,
  }),
};

const syncOptions = {
  name: persistanceKey,
  enabled: storageUnit === localStorage,
};

const useStore = create(
  persist(
    sync(
      (set) => ({
        // ...your slices
      }),
      syncOptions
    ),
    persistOptions
  )
);
```

## Thank you! ❤️

⭐ If you liked the library, can you star this repo? ⭐
https://github.com/alimertcakar/zustand-sync

Also, the source code is super simple and pr's are welcome!

## License

This project is licensed under the MIT License. Meaning: do whatever you want with it as long as you don't sue me.
