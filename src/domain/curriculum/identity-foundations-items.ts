import type { IdentityTopic } from './identity-foundations';
const definition = (
  family: string,
  variant: string,
  objectives: ('IDF01' | 'IDF02' | 'IDF03')[],
  pair: readonly [number, number],
  repeat: IdentityTopic,
  sources: string[],
) => ({
  family,
  variant,
  objectives,
  accepted: [pair],
  repeat,
  sources,
  itemVersion: '1.0.0',
  rubricVersion: '1.0.0',
});
/** Original fixed first-attempt relations. No historical rubric is reinterpreted. */
export const identityItems = {
  if01: definition(
    'directory-boundary',
    'shared-workforce-subscriptions',
    ['IDF01'],
    [1, 2],
    'directory',
    ['IF03', 'IF23'],
  ),
  if02: definition(
    'directory-capability',
    'schema-required-without-customer-domain-operations',
    ['IDF01'],
    [0, 1],
    'domain',
    ['IF04', 'IF17'],
  ),
  if03: definition(
    'directory-synchronization',
    'correct-source-for-synced-user',
    ['IDF01'],
    [2, 0],
    'domain',
    ['IF04', 'IF16'],
  ),
  if04: definition('signin-context', 'separate-idps-with-mfa', ['IDF02'], [1, 0], 'sso', [
    'IF05',
    'IF07',
  ]),
  if05: definition('authentication-factors', 'two-independent-stores', ['IDF02'], [2, 1], 'mfa', [
    'IF07',
    'IF18',
  ]),
  if06: definition(
    'passwordless-strength',
    'relay-phishing-requirement',
    ['IDF02'],
    [0, 2],
    'passwordless',
    ['IF18', 'IF19', 'IF24'],
  ),
  if07: definition(
    'passwordless-strength',
    'replacement-device-without-hello-credential',
    ['IDF02'],
    [0, 2],
    'passwordless',
    ['IF18', 'IF26'],
  ),
  if08: definition(
    'external-authorization',
    'existing-guest-new-app',
    ['IDF03'],
    [1, 2],
    'external',
    ['IF09', 'IF21', 'IF22'],
  ),
  if09: definition(
    'external-purpose',
    'customer-becomes-partner-with-work-identity',
    ['IDF03'],
    [2, 1],
    'external',
    ['IF08', 'IF09', 'IF20', 'IF25'],
  ),
  if10: definition(
    'external-direct-connect',
    'mutual-channel-boundary',
    ['IDF03'],
    [2, 1],
    'external',
    ['IF10', 'IF21'],
  ),
} as const;
export type IdentityItemId = keyof typeof identityItems;
export const identityItemIds = Object.keys(identityItems) as IdentityItemId[];
export interface IdentityAnswer {
  decision: number | null;
  reason: number | null;
}
export function evaluateIdentity(item: IdentityItemId, answer: IdentityAnswer) {
  const pairs: readonly (readonly [number, number])[] = identityItems[item].accepted;
  const relation = pairs.some(([d, r]) => d === answer.decision && r === answer.reason);
  return {
    decision: pairs.some(([d]) => d === answer.decision),
    relation,
    misconceptions: relation
      ? []
      : [`identity.${item}.incompatible.${answer.decision}.${answer.reason}`],
  };
}
