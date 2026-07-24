---
title: "Log out of Liveblocks"
---

# Log out of Liveblocks

Occasionally it's useful to log out of Liveblocks, for example when you have an
SPA where you wish to reauthenticate a user without refreshing the page. Here's
how to do it:

```ts
client.logout();
```

In React, get your client like this inside a component or custom hook:

```tsx
import { useClient } from "@liveblocks/react/suspense";

function useLogout() {
  const client = useClient();
  return () => client.logout();
}
```
