/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function resolveDynamicPath(
  template: string,
  params: Record<string, any>,
) {
  if (!template) return template;

  return template.replace(/{(\w+)}/g, (_, key) => {
    return params?.[key] !== undefined ? params[key] : `{${key}}`;
  });
}
