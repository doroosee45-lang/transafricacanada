const {test}=require('node:test'); const assert=require('node:assert/strict'); const fs=require('node:fs');
test('navigation et thèmes présents',()=>{ for(const f of ['app/index.tsx','app/section.tsx','app/_layout.tsx','src/theme.ts','src/api.ts']) assert.ok(fs.existsSync(f),f); });
test('statut de service non configuré explicite',()=>{assert.match(fs.readFileSync('app/section.tsx','utf8'),/Service non configuré/)});
