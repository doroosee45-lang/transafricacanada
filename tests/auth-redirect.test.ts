import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authRedirect,parseAuthCallback} from '../src/auth/redirect';
test('rappels natifs et Expo Go conservent le flux',()=>{
 assert.equal(authRedirect('recovery','transafricacanada:///auth-callback'),'transafricacanada:///auth-callback?flow=recovery');
 assert.equal(authRedirect('confirmation','exp://192.168.1.2:8081/--/auth-callback'),'exp://192.168.1.2:8081/--/auth-callback?flow=confirmation');
 assert.equal(authRedirect('confirmation','exp://192.168.1.2/--/auth-callback?existing=1'),'exp://192.168.1.2/--/auth-callback?existing=1&flow=confirmation');
 assert.deepEqual(parseAuthCallback('code','confirmation'),{code:'code',flow:'confirmation'});
});
test('refus des paramètres manquants ou multiples',()=>{assert.equal(parseAuthCallback(['x','y'],'recovery'),null);assert.equal(parseAuthCallback('x','unknown'),null);assert.equal(parseAuthCallback('', 'recovery'),null);});
