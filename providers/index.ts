import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class NotionProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { Notion } = await import('../src/Notion')

    Ally.extend('notion', (_, __, config, ctx) => {
      return new Notion(ctx, config)
    })
  }
}
