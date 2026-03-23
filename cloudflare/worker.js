export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.BACKEND_ORIGIN;

    if (!origin) {
      return new Response('BACKEND_ORIGIN is not configured', { status: 500 });
    }

    const target = new URL(url.pathname + url.search, origin);
    const proxiedRequest = new Request(target.toString(), request);

    const response = await fetch(proxiedRequest, {
      cf: {
        cacheTtl: 0,
        cacheEverything: false
      }
    });

    return response;
  }
};
