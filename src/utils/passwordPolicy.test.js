import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
import { validatePassword, passwordChecks } from './passwordPolicy';

// La règle du serveur est la référence : le miroir frontend doit rendre EXACTEMENT le même verdict.
const require = createRequire(import.meta.url);
const server = require('../../../backend/services/passwordPolicy.js');

const CORPUS = [
  ['', {}], ['court1A', {}], ['sansmajuscule1', {}], ['SansChiffre', {}], ['Valide2025', {}],
  [' Valide2025', {}], ['Valide2025 ', {}], ['Élan2025x', {}], ['A1' + 'é'.repeat(35), {}], ['A1' + 'é'.repeat(34) + 'x', {}],
  ['Nadia@Test.invalid1', { email: 'nadia@test.invalid1' }], ['Nadia2025', { email: 'nadia2025@test.invalid' }],
  ['Nadia2025', { email: 'autre@test.invalid' }], [12345678, {}], [null, {}],
];

describe('politique de mot de passe', () => {
  it.each(CORPUS)('même verdict que le serveur : %j', (pw, ctx) => {
    expect(validatePassword(pw, ctx)).toBe(server.validatePassword(pw, ctx));
  });

  it('accepte un mot de passe conforme et refuse les cas limites', () => {
    expect(validatePassword('Valide2025')).toBeNull();
    expect(validatePassword('Valid202')).toBeNull(); // exactement 8
    expect(validatePassword('Valid20')).toMatch(/8 caractères/);
    expect(validatePassword('A1' + 'é'.repeat(36))).toMatch(/trop long/); // 74 octets
  });

  it('check-list de saisie', () => {
    expect(passwordChecks('abc').map((c) => c.ok)).toEqual([false, false, false]);
    expect(passwordChecks('Abcdefg1').map((c) => c.ok)).toEqual([true, true, true]);
  });
});
