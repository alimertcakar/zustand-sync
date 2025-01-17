# Zustand Sync Middleware

This middleware for Zustand allows you to synchronize store data between different browser tabs. When the state changes in one tab, the updated state will be reflected in all other open tabs. You can use this with zustand/persist with no issues.

## Installation

To install the middleware, you can use pnpm, npm or yarn:

```sh
pnpm add @alimert/zustand-sync
# or
npm install @alimert/zustand-sync
# or
yarn add @alimert/zustand-sync
```

## Usage

To use the middleware, import it and apply it to your Zustand store:

```typescript
import create from "zustand";
import sync from "zustand-sync";

const useStore = create(
  sync((set) => ({
    // ...your state and actions...
  }))
);
```

## Usage with zustand/persist

You have to put `sync` middleware before `persist` middleware.

```typescript
import create from "zustand";
import sync from "zustand-sync";

const useStore = create(
  sync(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      enabled: true,
      name: "counter-store",
    }
  )
);

export default useStore;
```

## License

This project is licensed under the MIT License. Meaning: do whatever you want with it as long as you don't sue me.
