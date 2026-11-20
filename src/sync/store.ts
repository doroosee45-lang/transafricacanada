import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import {bytesToKey,keyPragma} from './encryption';
import type {QueueItem, QueueStatus, QueueStore} from './types';

let dbPromise: Promise<SQLite.SQLiteDatabase>|undefined;
async function db(){
 if(!dbPromise) dbPromise=(async()=>{
  // SQLCipher requires a custom native build. Never silently fall back to plaintext.
  const keyName='canada_queue_cipher_key_v1';
  let key=await SecureStore.getItemAsync(keyName);
  if(!key){key=bytesToKey(await Crypto.getRandomBytesAsync(32));await SecureStore.setItemAsync(keyName,key,{keychainAccessible:SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY});}
  const database=await SQLite.openDatabaseAsync('canada-queue-encrypted-v1.db');
  try {
   const cipher=await database.getFirstAsync<{cipher_version:string}>('PRAGMA cipher_version;');
   if(!cipher?.cipher_version) throw new Error('SQLCipher indisponible sur cet appareil.');
   await database.execAsync(keyPragma(key));
   // This read fails if the key does not open an existing database.
   await database.getFirstAsync('SELECT count(*) AS count FROM sqlite_master');
   await database.execAsync(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS operation_queue (
      id TEXT PRIMARY KEY NOT NULL, user_id TEXT NOT NULL, type TEXT NOT NULL,
      reference TEXT NOT NULL, created_at TEXT NOT NULL, idempotency_key TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK(status IN ('pending','accepted','rejected','conflict')),
      payload TEXT NOT NULL, server_message TEXT
    );
    CREATE INDEX IF NOT EXISTS queue_user_status ON operation_queue(user_id,status,created_at);`);
   return database;
  } catch (error) { await database.closeAsync(); throw error; }
 })().catch(err=>{dbPromise=undefined;throw err;});
 return dbPromise;
}
type Row={id:string;user_id:string;type:string;reference:string;created_at:string;idempotency_key:string;status:QueueStatus;payload:string;server_message:string|null};
export const queueStore:QueueStore & { enqueue:(userId:string,type:string,reference:string,payload:Record<string,unknown>)=>Promise<QueueItem> }={
 async enqueue(userId,type,reference,payload){
  if(!userId||!type||!reference) throw new Error('Champs obligatoires manquants.');
  // Do not persist credentials. Callers are also responsible for data minimization.
  const json=JSON.stringify(payload);
  if(/"(?:password|access_token|refresh_token|authorization)"\s*:/i.test(json)) throw new Error('Données sensibles interdites dans la file.');
  const item:QueueItem={id:Crypto.randomUUID(),userId,type,reference,createdAt:new Date().toISOString(),idempotencyKey:Crypto.randomUUID(),status:'pending',payload};
  const database=await db();
  await database.runAsync('INSERT INTO operation_queue (id,user_id,type,reference,created_at,idempotency_key,status,payload) VALUES (?,?,?,?,?,?,?,?)',item.id,userId,type,reference,item.createdAt,item.idempotencyKey,item.status,json);
  return item;
 },
 async list(userId){
  if(!userId) return [];
  const database=await db();
  const rows=await database.getAllAsync<Row>('SELECT * FROM operation_queue WHERE user_id=? ORDER BY created_at ASC,id ASC',userId);
  return rows.map(row=>({id:row.id,userId:row.user_id,type:row.type,reference:row.reference,createdAt:row.created_at,idempotencyKey:row.idempotency_key,status:row.status,payload:JSON.parse(row.payload),serverMessage:row.server_message??undefined}));
 },
 async setResult(id,userId,status,message){
  if(status==='pending') throw new Error('Résultat non définitif.');
  const database=await db();
  await database.runAsync("UPDATE operation_queue SET status=?, server_message=? WHERE id=? AND user_id=? AND status='pending'",status,message??null,id,userId);
 }
};
