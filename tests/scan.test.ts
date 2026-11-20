import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPermissionChecks,createScanGate} from '../src/features/scan';

test('un seul événement est traité jusqu’à la reprise, sans modifier les données',()=>{
 const gate=createScanGate();
 assert.deepEqual(gate.take('  https://example.test/a?b=1  '),{kind:'value',data:'  https://example.test/a?b=1  '});
 assert.deepEqual(gate.take('second'),{kind:'duplicate'});
 gate.reset();
 assert.deepEqual(gate.take('second'),{kind:'value',data:'second'});
});

test('un QR vide est signalé et ne provoque pas de rafale d’événements',()=>{
 const gate=createScanGate();
 assert.deepEqual(gate.take(''),{kind:'empty'});
 assert.deepEqual(gate.take('autre'),{kind:'duplicate'});
 gate.reset();
 assert.deepEqual(gate.take('autre'),{kind:'value',data:'autre'});
});

test('une ancienne vérification ne remplace pas une autorisation plus récente',async()=>{
 let resolveOld!:(value:string)=>void;
 const old=new Promise<string>(resolve=>{resolveOld=resolve;});
 const values:string[]=[];
 const checks=createPermissionChecks<string>(value=>values.push(value),()=>values.push('erreur'));
 const pending=checks.run(()=>old);
 await checks.run(async()=>'accordée');
 resolveOld('refusée');
 await pending;
 assert.deepEqual(values,['accordée']);
});

test('une vérification invalidée au départ ou en arrière-plan ne modifie pas l’écran',async()=>{
 let reject!:(reason:Error)=>void;
 const pendingResult=new Promise<string>((_,fail)=>{reject=fail;});
 const values:string[]=[];
 const checks=createPermissionChecks<string>(value=>values.push(value),()=>values.push('erreur'));
 const pending=checks.run(()=>pendingResult);
 checks.invalidate();
 reject(new Error('caméra indisponible'));
 await pending;
 assert.deepEqual(values,[]);
 await checks.run(async()=>{throw new Error('échec');});
 assert.deepEqual(values,['erreur']);
});
