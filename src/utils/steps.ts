export const insertName = (template: string, name: string) =>
  template.replace(/<<name>>/g, name);
