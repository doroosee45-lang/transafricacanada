export function createScanGate(){
 let locked=false;
 return {
  take(data:string):{kind:'duplicate'}|{kind:'empty'}|{kind:'value';data:string} {
   if(locked)return {kind:'duplicate'};
   locked=true;
   return data.length?{kind:'value',data}:{kind:'empty'};
  },
  reset(){locked=false;}
 };
}

export function createPermissionChecks<T>(onSuccess:(value:T)=>void,onError:()=>void){
 let generation=0;
 return {
  async run(load:()=>Promise<T>){
   const current=++generation;
   try {
    const value=await load();
    if(current===generation)onSuccess(value);
   } catch {
    if(current===generation)onError();
   }
  },
  invalidate(){generation++;}
 };
}
