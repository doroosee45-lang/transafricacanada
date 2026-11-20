import React,{useCallback,useEffect,useRef,useState} from 'react';
import {ActivityIndicator,Pressable,ScrollView,Text,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {useAuth} from '../src/auth/AuthProvider';
import {useRecordsService} from '../src/features/records/context';
import {isRecordKind,recordKinds,uniqueRecords} from '../src/features/records/model';
import type {RecordSummary} from '../src/features/records/model';
import {formatDate} from '../src/features/parcels/format';
import {parcelStyles as s} from '../src/features/parcels/styles';
import {colors as c} from '../src/theme';
export default function RecordsScreen(){
 const {kind:raw}=useLocalSearchParams<{kind:string}>();const kind=isRecordKind(raw)?raw:null;const service=useRecordsService();const {session,loading:authLoading}=useAuth();const userId=session?.user.id;
 const [items,setItems]=useState<RecordSummary[]>([]);const [owner,setOwner]=useState('');const [cursor,setCursor]=useState<string|null>(null);const [loaded,setLoaded]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const current=useRef<AbortController|null>(null);const locked=useRef(false);
 const load=useCallback(async(next:string|null,append:boolean)=>{
  if(!kind||!service||!userId||locked.current)return;locked.current=true;const aborter=new AbortController();current.current=aborter;setBusy(true);setError('');
  try{const page=await service.list(kind,{cursor:next,signal:aborter.signal});if(aborter.signal.aborted)return;setOwner(`${userId}:${kind}`);setItems(old=>append?uniqueRecords(old,page.items):uniqueRecords([],page.items));setCursor(page.nextCursor);setLoaded(true);}catch{if(!aborter.signal.aborted)setError('Impossible de charger les données. Vérifiez votre connexion ou vos autorisations.');}finally{if(current.current===aborter){locked.current=false;if(!aborter.signal.aborted)setBusy(false);}}
 },[kind,service,userId]);
 useEffect(()=>{setOwner('');setItems([]);setCursor(null);setLoaded(false);setBusy(false);setError('');locked.current=false;if(service&&userId&&kind)void load(null,false);return()=>{current.current?.abort();};},[service,userId,kind,load]);
 if(!kind)return <View style={s.content}><Text style={s.title}>Page introuvable</Text></View>;
 const meta=recordKinds[kind],visible=owner===`${userId}:${kind}`?items:[];
 return <ScrollView style={s.root} contentContainerStyle={s.content}><Text style={s.title}>{meta.title}</Text><Text style={s.lead}>{meta.description}</Text>{authLoading?<ActivityIndicator color={c.blue}/>:!session?<View style={s.notice}><Text style={s.cardTitle}>Connexion nécessaire</Text><Text style={s.body}>Connectez-vous pour consulter ces informations.</Text><Pressable style={s.button} onPress={()=>router.push('/auth')} accessibilityRole="button"><Text style={s.buttonText}>Se connecter</Text></Pressable></View>:!service?<View style={s.notice}><Text style={s.cardTitle}>Service non configuré</Text><Text style={s.body}>Ce module nécessite le service Core API et ses autorisations.</Text></View>:<>{!!error&&<Text style={s.empty} accessibilityRole="alert">{error}</Text>}{loaded&&!busy&&visible.length===0&&!error&&<Text style={s.empty}>{meta.empty}</Text>}{visible.map(item=><Pressable style={s.card} key={item.id} accessibilityRole="button" onPress={()=>router.push({pathname:'/record-detail',params:{kind,id:item.id}})}><Text style={s.cardTitle}>{item.unread?'●  ':''}{item.title}</Text>{item.subtitle&&<Text style={s.body}>{item.subtitle}</Text>}{item.status&&<Text style={s.status}>{item.status}</Text>}{item.updatedAt&&<Text style={s.small}>Actualisé : {formatDate(item.updatedAt)}</Text>}</Pressable>)}{busy&&<ActivityIndicator style={{margin:20}} color={c.blue}/>}<>{!!cursor&&!busy&&<Pressable style={s.outline} onPress={()=>void load(cursor,true)} accessibilityRole="button"><Text style={s.outlineText}>Charger la suite</Text></Pressable>}<Pressable style={s.outline} disabled={busy} onPress={()=>void load(null,false)} accessibilityRole="button"><Text style={s.outlineText}>Actualiser</Text></Pressable></></>}</ScrollView>;
}
