import type {QueueStore, SendOperation} from './types';

/** No endpoint is assumed: the caller must provide a contract-validated authenticated transport.
 * Instances serialize runs; only records belonging to the currently authenticated user are sent.
 * Retries always retain the original idempotency key. */
export function createSyncEngine(store:QueueStore, send:SendOperation) {
 let running=false;
 return { async synchronize(userId:string, isSessionCurrent:()=>Promise<boolean>) {
  if(running) return {started:false, processed:0};
  running=true; let processed=0;
  try {
   const records=await store.list(userId);
   for(const item of records){
    if(item.userId!==userId || item.status!=='pending') continue;
    if(!await isSessionCurrent()) break;
    let result;
    try {result=await send(item);} catch {break;}
    if(result.kind==='retry') break;
    if(result.kind==='accepted') await store.setResult(item.id,userId,'accepted');
    else await store.setResult(item.id,userId,result.kind,result.message);
    processed++;
   }
   return {started:true,processed};
  } finally {running=false;}
 }};
}
