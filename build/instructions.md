The package has been configured successfully!

Make sure to first define the mapping inside the `contracts/ally.ts` file as follows.

```ts
import { Notion, NotionConfig } from 'ally-driver-notion/build/standalone'

declare module '@ioc:Adonis/Addons/Ally' {
  interface SocialProviders {
    // ... other mappings
    notion: {
      config: NotionConfig
      implementation: Notion
    }
  }
}
```
