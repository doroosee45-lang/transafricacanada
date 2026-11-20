/** The generated URL must be allowlisted in Supabase Auth. */
export function authRedirect(flow:'confirmation'|'recovery', callbackUrl:string) {
 return `${callbackUrl}${callbackUrl.includes('?')?'&':'?'}flow=${flow}`;
}
export function parseAuthCallback(code:unknown, flow:unknown):{code:string;flow:'confirmation'|'recovery'}|null {
 if(typeof code!=='string'||code.length<1||code.length>4096) return null;
 if(flow!=='confirmation'&&flow!=='recovery') return null;
 return {code,flow};
}
