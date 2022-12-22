export const ITEMS = '/items/*';
export const ITEM = '/items/:id';
export const NEW_ITEM = '/items/new';

export const GROUPS = '/groups/*';
export const GROUP = '/groups/:id';
export const NEW_GROUP = '/groups/new';

export const SETTINGS = '/settings/*';

export const SETTINGS_ROUTES = ['general', 'appearance', 'security'];

export function items(groupId?: string): string {
  return `/items?group=${groupId}`;
}
export function item(id: string): string {
  return `/items/${id}`;
}
export function newItem(): string {
  return `/items/new`;
}

export function groups(): string {
  return `/groups`;
}
export function group(id: string): string {
  return `/groups/${id}`;
}
export function newGroup(): string {
  return `/groups/new`;
}

export function settings(): string {
  return `/settings`;
}

export function setting(route: string): string {
  return `/settings/${route}`;
}
