/// <reference types="@adonisjs/ally" />
/// <reference types="@adonisjs/http-server/build/adonis-typings" />
import type { AllyUserContract, ApiRequestContract } from '@ioc:Adonis/Addons/Ally';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone';
/**
 * Define the access token object properties in this type. It
 * must have "token" and "type" and you are free to add
 * more properties.
 */
export declare type NotionAccessToken = {
    token: string;
    type: 'bearer';
};
/**
 * As of June 28, 2022, Notion's OAuth implementation does not use scopes.
 * https://developers.notion.com/docs/authorization#authorizing-public-integrations
 */
export declare type NotionScopes = string;
export declare type NotionConfig = {
    driver: 'notion';
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    authorizeUrl?: string;
    accessTokenUrl?: string;
    userInfoUrl?: string;
};
/**
 * Driver implementation. It is mostly configuration driven except the user calls
 */
export declare class Notion extends Oauth2Driver<NotionAccessToken, NotionScopes> {
    config: NotionConfig;
    protected authorizeUrl: string;
    protected accessTokenUrl: string;
    protected userInfoUrl: string;
    protected codeParamName: string;
    protected errorParamName: string;
    protected stateCookieName: string;
    protected stateParamName: string;
    /**
     * As of June 28, 2022, Notion's OAuth implementation does not use scopes.
     * https://developers.notion.com/docs/authorization#authorizing-public-integrations
     */
    protected scopeParamName: string;
    /**
     * As of June 28, 2022, Notion's OAuth implementation does not use scopes.
     * https://developers.notion.com/docs/authorization#authorizing-public-integrations
     */
    protected scopesSeparator: string;
    constructor(ctx: HttpContextContract, config: NotionConfig);
    protected configureRedirectRequest(request: RedirectRequest<NotionScopes>): void;
    protected configureAccessTokenRequest(request: ApiRequest): void;
    accessDenied(): boolean;
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
    protected getAuthenticatedRequest(url: string, token: string): ApiRequest;
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
    protected getUserInfo(token: string, callback?: (request: ApiRequestContract) => void): Promise<{
        id: any;
        nickName: any;
        name: any;
        email: any;
        avatarUrl: any;
        emailVerificationState: "unsupported";
        original: any;
    }>;
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
    user(callback?: (request: ApiRequest) => void): Promise<AllyUserContract<NotionAccessToken>>;
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
    userFromToken(token: string, callback?: (request: ApiRequestContract) => void): Promise<{
        token: {
            token: string;
            type: "bearer";
        };
        id: any;
        nickName: any;
        name: any;
        email: any;
        avatarUrl: any;
        emailVerificationState: "unsupported";
        original: any;
    }>;
}
