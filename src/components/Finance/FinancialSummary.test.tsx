import {describe,it,expect} from 'vitest';
import {amountText,financialLines} from './FinancialSummary';
describe('Montants multidevises sans conversion implicite',()=>{
 it('affiche les centimes et zero',()=>{expect(amountText(0,'CAD')).toBe('0,00 CAD');expect(amountText(127,'CAD')).toBe('1,27 CAD');});
 it('distingue les deux francs CFA',()=>{expect(amountText(125,'XAF')).toBe('125 XAF');expect(amountText(125,'XOF')).toBe('125 XOF');});
 it('conserve un grand nombre de centimes sans division flottante',()=>{expect(amountText(9007199254740991,'CAD').replace(/[\s\u202f]/g,'')).toBe('90071992547409,91CAD');});
 it('ne donne pas de devise par defaut a une valeur inconnue',()=>expect(()=>amountText(100,'UNKNOWN')).toThrow());
 it('la facture utilise le taux et les montants du contrat',()=>{const f={totalMinor:2700,advanceMinor:700,remainingReferenceMinor:2000,referenceCurrency:'CAD',destinationCurrency:'CDF',destinationDueMinor:4000000,destinationPaidMinor:0,rate:'2000',lockedAt:'2026-11-11T00:00:00Z',status:'partial',transactions:[]};const text=financialLines(f).join('\n');expect(text).toContain('27,00 CAD');expect(text).toContain('1 CAD = 2000 CDF');expect(text).toContain('40');});
});
describe('Devises des 4 marchés (correction gestion des colis)',()=>{
 it('TND 3 décimales, EUR et AED 2 : plus de plantage de l\'écran de création',()=>{expect(amountText(24690,'TND')).toBe('24,690 TND');expect(amountText(1600,'EUR')).toBe('16,00 EUR');expect(amountText(6550,'AED')).toBe('65,50 AED');});
});
