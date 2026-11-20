import React,{useEffect,useRef,useState} from 'react';
import {ActivityIndicator,Pressable,StyleSheet,Text,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {supabase} from '../src/auth/supabase';
import {useAuth} from '../src/auth/AuthProvider';
import {parseAuthCallback} from '../src/auth/redirect';
import {colors as c} from '../src/theme';
export default function AuthCallback(){
 const params=useLocalSearchParams(); const {setRecoveryReady}=useAuth();const started=useRef(false); const [error,setError]=useState('');
 const invalid=!parseAuthCallback(params.code,params.flow)||!supabase;
 useEffect(()=>{
  if(started.current)return;
  const callback=parseAuthCallback(params.code,params.flow);
  if(!callback||!supabase)return;
  started.current=true;
  supabase.auth.exchangeCodeForSession(callback.code).then(({data,error})=>{
   if(error||!data.session){setError('Lien invalide, expiré ou ouvert sur un autre appareil. Demandez un nouveau lien.');return;}
   if(callback.flow==='recovery'){setRecoveryReady(true);router.replace('/reset-password');}else router.replace('/');
  }).catch(()=>setError('Impossible de vérifier ce lien. Vérifiez votre connexion.'));
 },[params.code,params.flow,setRecoveryReady]);
 const message=invalid?'Lien invalide ou authentification non configurée.':error;
 return <View style={s.container}>{message?<><Text accessibilityRole="alert" style={s.message}>{message}</Text><Pressable accessibilityRole="button" onPress={()=>router.replace('/auth')} style={s.button}><Text style={s.text}>Retour à la connexion</Text></Pressable></>:<><ActivityIndicator color={c.blue}/><Text style={s.message}>Vérification de votre lien sécurisé…</Text></>}</View>;
}
const s=StyleSheet.create({container:{flex:1,justifyContent:'center',alignItems:'center',padding:24,backgroundColor:c.background},message:{color:c.ink,textAlign:'center',lineHeight:22,marginVertical:20},button:{padding:15,backgroundColor:c.blue,borderRadius:12},text:{color:'white',fontWeight:'700'}});
