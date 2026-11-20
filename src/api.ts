/** Infrastructure de transport uniquement : aucune route ou réponse métier n'est présumée. */
export type ApiErrorCode = 'configuration'|'authentication'|'forbidden'|'not_found'|'conflict'|'validation'|'rate_limit'|'server'|'network'|'timeout'|'cancelled'|'invalid_response';
export class ApiError extends Error {
  constructor(public readonly code:ApiErrorCode, message:string, public readonly status?:number) { super(message); this.name='ApiError'; }
}
type Parser<T> = (data:unknown)=>T;
type Options<T> = {method?:'GET'|'POST'|'PATCH'|'PUT'|'DELETE'; body?:unknown; idempotencyKey?:string; signal?:AbortSignal; timeoutMs?:number; authenticated?:boolean; parse:Parser<T>};
type Fetcher = typeof fetch;
const statusError=(status:number):ApiError=>{
 if(status===401)return new ApiError('authentication','Session expirée ou non autorisée.',status);
 if(status===403)return new ApiError('forbidden','Vous ne disposez pas des autorisations nécessaires.',status);
 if(status===404)return new ApiError('not_found','Élément introuvable.',status);
 if(status===409||status===412)return new ApiError('conflict','Les données ont changé. Actualisez avant de réessayer.',status);
 if(status===400||status===422)return new ApiError('validation','Les informations envoyées ne sont pas valides.',status);
 if(status===429)return new ApiError('rate_limit','Trop de tentatives. Réessayez plus tard.',status);
 return new ApiError('server','Le service est momentanément indisponible.',status);
};
export function apiClient(baseUrl:string,getAccessToken:()=>Promise<string|null>,fetcher:Fetcher=fetch){
 let base:URL;
 try {base=new URL(baseUrl);} catch {throw new ApiError('configuration','URL du service invalide.');}
 if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash||base.pathname!=='/') throw new ApiError('configuration','Une URL HTTPS sans identifiants est requise.');
 // A fixed origin prevents absolute URLs and scheme-relative paths from sending a token elsewhere.
 return async function request<T>(path:string, options:Options<T>):Promise<T>{
  if(!path.startsWith('/')||path.startsWith('//')||path.includes('\\')||/[\u0000-\u001f]/.test(path)) throw new ApiError('configuration','Chemin API invalide.');
  let target:URL; try {target=new URL(path,base.origin);}catch{throw new ApiError('configuration','Chemin API invalide.');}
  if(target.origin!==base.origin||target.hash)throw new ApiError('configuration','Chemin API invalide.');
  if(options.signal?.aborted)throw new ApiError('cancelled','Requête annulée.');
  let token:string|null=null;
  try {token=options.authenticated===false?null:await getAccessToken();}catch{throw new ApiError('authentication','Impossible de vérifier la session.');}
  if(options.authenticated!==false&&!token)throw new ApiError('authentication','Connectez-vous pour continuer.');
  if(options.signal?.aborted)throw new ApiError('cancelled','Requête annulée.');
  const headers:Record<string,string>={'Accept':'application/json'};
  if(token)headers.Authorization=`Bearer ${token}`;
  if(options.body!==undefined)headers['Content-Type']='application/json';
  if(options.idempotencyKey){if(!/^[A-Za-z0-9._:-]{1,200}$/.test(options.idempotencyKey))throw new ApiError('configuration','Clé d’idempotence invalide.');headers['Idempotency-Key']=options.idempotencyKey;}
  let encodedBody:string|undefined;
  try {if(options.body!==undefined)encodedBody=JSON.stringify(options.body);}catch{throw new ApiError('validation','Impossible de préparer les données.');}
  const timeoutMs=options.timeoutMs??15000;
  if(!Number.isFinite(timeoutMs)||timeoutMs<1||timeoutMs>120000)throw new ApiError('configuration','Délai de requête invalide.');
  const controller=new AbortController();let timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
  const cancel=()=>controller.abort();options.signal?.addEventListener('abort',cancel,{once:true});
  try {
   const response=await fetcher(target.toString(),{method:options.method??'GET',headers,body:encodedBody,signal:controller.signal,redirect:'error'});
   if(!response.ok)throw statusError(response.status);
   let data:unknown;
   if(response.status!==204){try {data=await response.json();}catch{throw new ApiError('invalid_response','Réponse du service illisible.',response.status);}}
   try{return options.parse(data);}catch{throw new ApiError('invalid_response','Réponse du service incompatible.',response.status);}
  } catch(error){
   if(error instanceof ApiError)throw error;
   if(timedOut)throw new ApiError('timeout','Le service met trop de temps à répondre.');
   if(options.signal?.aborted)throw new ApiError('cancelled','Requête annulée.');
   throw new ApiError('network','Connexion impossible. Vérifiez votre réseau.');
  }finally{clearTimeout(timer);options.signal?.removeEventListener('abort',cancel);}
 };
}
