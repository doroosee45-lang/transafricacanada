/** Format checked before insertion into PRAGMA. Never log or transmit this key. */
export function bytesToKey(bytes:Uint8Array):string {
 if(bytes.length!==32) throw new Error('Longueur de clé invalide.');
 return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
export function keyPragma(key:string):string {
 if(!/^[0-9a-f]{64}$/.test(key)) throw new Error('Clé de base locale invalide.');
 return `PRAGMA key = "x'${key}'";`;
}
