import type { AllyUserContract, ApiRequestContract } from '@ioc:Adonis/Addons/Ally'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone'

/**
 * Define the access token object properties in this type. It
 * must have "token" and "type" and you are free to add
 * more properties.
 */
export type NotionAccessToken = {
  token: string
  type: 'bearer'
}

/**
 * As of June 28, 2022, Notion's OAuth implementation does not use scopes.
 * https://developers.notion.com/docs/authorization#authorizing-public-integrations
 */
export type NotionScopes = string

export type NotionConfig = {
  driver: 'notion'
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string
}

/**
 * Driver implementation. It is mostly configuration driven except the user calls
 */
export class Notion extends Oauth2Driver<NotionAccessToken, NotionScopes> {
  protected authorizeUrl = 'https://api.notion.com/v1/oauth/authorize'
  protected accessTokenUrl = 'https://api.notion.com/v1/oauth/token'
  protected userInfoUrl = 'https://api.notion.com/v1/users/me'
  protected codeParamName = 'code'
  protected errorParamName = 'error'
  protected stateCookieName = 'notion_oauth_state'
  protected stateParamName = 'state'

  /**
   * As of June 28, 2022, Notion's OAuth implementation does not use scopes.
   * https://developers.notion.com/docs/authorization#authorizing-public-integrations
   */
  protected scopeParamName = 'scope'

  /**
   * As of June 28, 2022, Notion's OAuth implementation does not use scopes.
   * https://developers.notion.com/docs/authorization#authorizing-public-integrations
   */
  protected scopesSeparator = ' '

  constructor(ctx: HttpContextContract, public config: NotionConfig) {
    super(ctx, config)

    /**
     * Extremely important to call the following method to clear the
     * state set by the redirect request.
     *
     * DO NOT REMOVE THE FOLLOWING LINE
     */
    this.loadState()
  }

  protected configureRedirectRequest(request: RedirectRequest<NotionScopes>) {
    request.param('response_type', 'code')
    request.param('owner', 'user')
    if (!this.isStateless) {
      request.param(this.stateParamName, this.stateCookieValue)
    }
  }

  protected configureAccessTokenRequest(request: ApiRequest) {
    request.requestType = 'json'
    request.field(this.codeParamName, this.getCode())
    request.header('Content-Type', 'application/json')
    const base64Auth = Buffer.from(
      `${request.fields.client_id}:${request.fields.client_secret}`
    ).toString('base64')
    request.header('Authorization', `Basic ${base64Auth}`)
    request.clearField('client_id')
    request.clearField('client_secret')
  }

  public accessDenied() {
    return this.ctx.request.input('error') === 'access_denied'
  }

  /**
   * Returns the HTTP request with the authorization header set
   */
  /*!
   * @license MIT
   * Copyright 2022 Harminder Virk, contributors
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  protected getAuthenticatedRequest(url: string, token: string) {
    const request = this.httpClient(url)
    request.header('Authorization', `Bearer ${token}`)
    request.header('Accept', 'application/json')
    request.header('Notion-Version', '2022-02-22')
    request.parseAs('json')
    return request
  }

  /**
   * Fetches the user info from the Notion API
   */
  /*!
   * @license MIT
   * Copyright 2022 Harminder Virk, contributors
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  protected async getUserInfo(token: string, callback?: (request: ApiRequestContract) => void) {
    const request = this.getAuthenticatedRequest(this.userInfoUrl, token)
    if (typeof callback === 'function') {
      callback(request)
    }

    const body = await request.get()

    return {
      id: body.bot.owner.user.id,
      nickName: body.bot.owner.user.name,
      name: body.bot.owner.user.name,
      email: body.bot.owner.user.person.email,
      avatarUrl: body.bot.owner.user.avatar_url || null,
      emailVerificationState: 'unsupported' as const,
      original: body,
    }
  }

  /**
   * Get the user details by query the provider API.
   */
  /*!
   * @license MIT
   * Copyright 2022 Harminder Virk, contributors
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  public async user(
    callback?: (request: ApiRequest) => void
  ): Promise<AllyUserContract<NotionAccessToken>> {
    const token = await this.accessToken(callback)
    const user = await this.getUserInfo(token.token, callback)

    return {
      ...user,
      token,
    }
  }

  /**
   * Finds the user by the access token
   */
  /*!
   * @license MIT
   * Copyright 2022 Harminder Virk, contributors
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  public async userFromToken(token: string, callback?: (request: ApiRequestContract) => void) {
    const user = await this.getUserInfo(token, callback)

    return {
      ...user,
      token: { token, type: 'bearer' as const },
    }
  }
}
