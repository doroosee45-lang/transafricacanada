import {router} from 'expo-router';
import type {Href} from 'expo-router';

export type Params = Record<string, string | undefined>;

function clean(params: Params): Record<string, string> {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== '')) as Record<string, string>;
}

/** Opens one of the screens registered in src/screens/index.ts. */
export function go(name: string, params: Params = {}) {
  router.push({pathname: '/s/[name]', params: {name, ...clean(params)}});
}

export function goReplace(name: string, params: Params = {}) {
  router.replace({pathname: '/s/[name]', params: {name, ...clean(params)}});
}

export type Target = {name: string; params?: Params} | {href: Href};

export function open(target: Target) {
  if ('href' in target) router.push(target.href);
  else go(target.name, target.params);
}
