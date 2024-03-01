const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'

export default {
  async fetch(
    request: Request,
    env: Record<string, string>,
    ctx: ExecutionContext
  ): Promise<Response> {
    const redirectUrl = `${env.APP_URL}/oauth_result.html`

    const code = new URL(request.url).searchParams.get('code')
    if (!code) {
      const searchParams = new URLSearchParams({
        error: 'bad_verification_code',
        error_description: 'The code passed is incorrect or expired.',
      }).toString()
      return Response.redirect(`${redirectUrl}?${searchParams}`, 302)
    }

    const accessTokenUrl = new URL(ACCESS_TOKEN_URL)
    accessTokenUrl.search = new URLSearchParams({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      code,
    }).toString()

    const githubResponse = await fetch(accessTokenUrl.href, {
      method: 'POST',
    })
    const searchParams = await githubResponse.text()
    return Response.redirect(`${redirectUrl}?${searchParams}`, 302)
  },
}
