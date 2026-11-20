import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, AppState, Linking, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Camera, CameraView} from 'expo-camera';
import type {PermissionResponse} from 'expo-camera';
import {router, useFocusEffect} from 'expo-router';
import {colors as c} from '../src/theme';
import {createPermissionChecks,createScanGate} from '../src/features/scan';

export default function ScanScreen() {
 const [permission,setPermission]=useState<PermissionResponse|null>(null);
 const [active,setActive]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [result,setResult]=useState<string|null>(null);
 const gate=useRef(createScanGate()).current;
 const focused=useRef(false);
 const requesting=useRef(false);
 const permissionChecks=useRef(createPermissionChecks<PermissionResponse>(
  status=>{setPermission(status);setError('');setActive(AppState.currentState==='active');},
  ()=>setError('Impossible de vérifier l’autorisation de la caméra. Réessayez.')
 )).current;
 const [refreshAttempt,setRefreshAttempt]=useState(0);

 useFocusEffect(useCallback(()=>{
  focused.current=true;
  setBusy(requesting.current);
  if(refreshAttempt>0)setPermission(null);
  async function refreshPermission(){
   setActive(false);
   await permissionChecks.run(()=>Camera.getCameraPermissionsAsync());
  }
  void refreshPermission();
  const listener=AppState.addEventListener('change',state=>{
   if(state==='active')void refreshPermission();
   else {permissionChecks.invalidate();setActive(false);}
  });
  return ()=>{focused.current=false;permissionChecks.invalidate();listener.remove();setActive(false);};
 },[permissionChecks,refreshAttempt]));

 async function requestPermission(){
  if(requesting.current)return;
  requesting.current=true;
  setBusy(true);setError('');
  try {await permissionChecks.run(()=>Camera.requestCameraPermissionsAsync());}
  finally {requesting.current=false;if(focused.current)setBusy(false);}
 }
 async function openSettings(){
  try {await Linking.openSettings();}
  catch {setError('Impossible d’ouvrir les réglages. Autorisez la caméra dans les réglages de votre appareil.');}
 }
 function scan(data:string){
  const outcome=gate.take(data);
  if(outcome.kind==='duplicate')return;
  if(outcome.kind==='empty'){setError('Ce QR code ne contient aucune donnée.');return;}
  setResult(outcome.data);
 }
 function retry(){gate.reset();setResult(null);setError('');setRefreshAttempt(value=>value+1);}

 return <ScrollView style={s.root} contentContainerStyle={s.content}>
  <Text style={s.title}>Scanner un QR code</Text>
  <Text style={s.body}>Placez le QR code dans le cadre. Aucune opération métier n’est effectuée automatiquement.</Text>
  {!permission&&!error?<ActivityIndicator color={c.blue} style={s.loading}/>:null}
  {permission&&!permission.granted&&<View style={s.card}>
   <Text style={s.body}>L’accès à la caméra est nécessaire pour lire un QR code.</Text>
   <Pressable accessibilityRole="button" disabled={busy} onPress={()=>void (permission.canAskAgain?requestPermission():openSettings())} style={s.button}>
    <Text style={s.buttonText}>{busy?'Chargement…':permission.canAskAgain?'Autoriser la caméra':'Ouvrir les réglages'}</Text>
   </Pressable>
   {!permission.canAskAgain&&<Text style={s.body}>Autorisez la caméra pour Expo Go dans les réglages, puis revenez dans l’application.</Text>}
  </View>}
  {permission?.granted&&active&&!result&&!error&&<CameraView
   style={s.camera}
   facing="back"
   autofocus="on"
   barcodeScannerSettings={{barcodeTypes:['qr']}}
   onBarcodeScanned={({data})=>scan(data)}
   onMountError={()=>setError('Impossible d’ouvrir la caméra. Fermez les autres applications utilisant la caméra et réessayez.')}
  />}
  {!!error&&<View style={s.card}><Text accessibilityRole="alert" style={s.error}>{error}</Text>
   <Pressable accessibilityRole="button" onPress={retry} style={s.button}><Text style={s.buttonText}>Réessayer</Text></Pressable>
  </View>}
  {result!==null&&<View style={s.card}>
   <Text style={s.heading}>Données lues</Text>
   <Text selectable style={s.result}>{result}</Text>
   <Text style={s.body}>Le contenu n’est ni ouvert ni transmis. La vérification du colis nécessite un service et un format de QR validés.</Text>
   <Pressable accessibilityRole="button" onPress={()=>router.push({pathname:'/s/[name]',params:{name:'scan-result',code:result}})} style={s.button}><Text style={s.buttonText}>Identifier le colis</Text></Pressable>
   <Pressable accessibilityRole="button" onPress={retry}    style={s.button}><Text style={s.buttonText}>Scanner un autre code</Text></Pressable>
  </View>}
 </ScrollView>;
}

const s=StyleSheet.create({
 root:{flex:1,backgroundColor:c.background},content:{padding:22,maxWidth:700,width:'100%',alignSelf:'center'},
 title:{fontSize:28,fontWeight:'800',color:c.ink},heading:{fontSize:17,fontWeight:'800',color:c.ink},
 body:{color:c.muted,lineHeight:22,marginTop:10},loading:{margin:30},camera:{width:'100%',height:350,marginTop:24,borderRadius:16,overflow:'hidden'},
 card:{backgroundColor:c.white,borderColor:c.border,borderWidth:1,borderRadius:16,padding:18,marginTop:24},
 error:{color:'#8A6520',lineHeight:22},result:{color:c.ink,lineHeight:22,marginTop:12},
 button:{backgroundColor:c.blue,borderRadius:10,padding:15,alignItems:'center',marginTop:18},buttonText:{color:c.white,fontWeight:'800'}
});
