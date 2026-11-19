export const environment = {
  production: true,
  // Caddy proxies this path to Django, so browser requests stay on the HTTPS origin.
  apiUrl: '/api',
};
