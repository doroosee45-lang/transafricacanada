import React from 'react';
import {render,screen} from '@testing-library/react';
import {describe,it,expect} from 'vitest';
import {jsPDF} from 'jspdf';
import {invoicePackages,drawInvoicePackages} from './invoicePackages';
import {PaymentInvoice} from '../pages/Payments/PaymentDetail';
const p={_id:'one',trackingNumber:'TEST-001',origin:'Canada',destination:'RDC',weight:2.5,status:'transit',service:'express'};
describe('Informations colis des factures',()=>{
 it('ancien lien singulier',()=>expect(invoicePackages({package:p})[0]).toMatchObject({tracking:'TEST-001',weight:'2.5 kg',status:'En transit',service:'Express'}));
 it('multi-colis sans doublon, prefere le document peuple',()=>expect(invoicePackages({packages:['one',{...p,_id:'two'}],package:p})).toHaveLength(2));
 it('aucune valeur standard inventee, champs absents explicites',()=>{const row=invoicePackages({package:{_id:'one',weight:0}})[0];expect(row.weight).toBe('0 kg');expect(row.service).toBe('Service non renseigné');expect(row.route).toContain('Départ non renseigné');expect(row.status).toBe('Statut non renseigné');});
 it('references orphelines visibles',()=>expect(invoicePackages({packages:[{_id:'gone',missing:true} ]})[0].tracking).toContain('Colis introuvable'));
 it('aucune association ne produit de faux colis',()=>expect(invoicePackages({})).toEqual([]));
 it('service du contrat conserve',()=>expect(invoicePackages({package:{...p,financial:{service:'premium'}}})[0].service).toBe('Premium'));
 it('apercu et DOM imprime contiennent une ligne par colis',()=>{render(<PaymentInvoice payment={{amount:50,packages:[p,{...p,_id:'two',trackingNumber:'TEST-002',weight:7}]}}/>);expect(screen.getByText('TEST-001')).toBeTruthy();expect(screen.getByText('TEST-002')).toBeTruthy();expect(screen.getByText('2.5 kg')).toBeTruthy();expect(screen.getByText('7 kg')).toBeTruthy();});
 it('PDF multipage sans troncature des references',()=>{const doc=new jsPDF();const rows=invoicePackages({packages:Array.from({length:55},(_,i)=>({...p,_id:String(i),trackingNumber:'TEST-REF-'+i}))});drawInvoicePackages(doc,rows,{y:150});expect(doc.getNumberOfPages()).toBeGreaterThan(1);const out=doc.output();expect(out).toContain('TEST-REF-0');expect(out).toContain('TEST-REF-54');});
});
