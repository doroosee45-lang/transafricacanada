import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bytesToKey,keyPragma} from '../src/sync/encryption';
test('génération du format de clé 256 bits',()=>{const key=bytesToKey(new Uint8Array(32).fill(15));assert.equal(key,'0f'.repeat(32));assert.equal(keyPragma(key),`PRAGMA key = "x'${key}'";`);});
test('refuse toute clé non hexadécimale et longueur incorrecte',()=>{assert.throws(()=>bytesToKey(new Uint8Array(31)));assert.throws(()=>keyPragma("abc';drop table x;--"));assert.throws(()=>keyPragma('ff'.repeat(31)));});
