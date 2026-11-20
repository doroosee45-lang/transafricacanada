import React,{useCallback,useEffect,useRef,useState} from 'react';
import {ActivityIndicator,Pressable,ScrollView,Text,View} from 'react-native';
import {router} from 'expo-router';
import {useAuth} from '../src/auth/AuthProvider';
import {useParcelsService} from '../src/features/parcels/context';
import {formatDate} from '../src/features/parcels/format';
import type {ParcelSummary} from '../src/features/parcels/types';
import {parcelStyles as s} from '../src/features/parcels/styles';
import {colors as c} from '../src/theme';
export default function Parcels(){
 const {session,loading:authLoading}=useAuth();const service=useParcelsService();const userId=session?.user.id;
 const [items,setItems]=useState<ParcelSummary[]>([]);const [cursor,setCursor]=useState<string|null>(null);const [loaded,setLoaded]=useState(false);const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [owner,setOwner]=useState<string|undefined>();const controller=useRef<AbortController|null>(null);const inFlight=useRef(false);
 const load=useCallback(async(next:string|null,append:boolean)=>{
  if(!service||!userId||inFlight.current)return;inFlight.current=true;controller.current?.abort();const request=new AbortController();controller.current=request;setLoading(true);setError('');
  try{const page=await service.list({cursor:next,signal:request.signal});if(request.signal.aborted)return;setItems(previous=>append?[...previous,...page.items.filter(item=>!previous.some(old=>old.id===item.id))]:page.items);setCursor(page.nextCursor);setOwner(userId);setLoaded(true);}catch{if(!request.signal.aborted)setError('Impossible de charger vos colis. Vérifiez votre connexion et réessayez.');}finally{if(controller.current===request){if(!request.signal.aborted)setLoading(false);inFlight.current=false;}}
 },[service,userId]);
 useEffect(()=>{setItems([]);setLoaded(false);setOwner(undefined);setCursor(null);setError('');setLoading(false);inFlight.current=false;if(userId&&service)void load(null,false);return()=>{controller.current?.abort();};},[service,userId,load]);
 const visible=owner===userId?items:[];
 return <ScrollView style={s.root} contentContainerStyle={s.content}><Text style={s.title}>Mes colis</Text><Text style={s.lead}>Consultez les étapes confirmées de vos colis.</Text>{authLoading?<ActivityIndicator color={c.blue}/>:!session?<View style={s.notice}><Text style={s.cardTitle}>Connexion nécessaire</Text><Text style={s.body}>Connectez-vous pour accéder à vos colis.</Text><Pressable style={s.button} accessibilityRole="button" onPress={()=>router.push('/auth')}><Text style={s.buttonText}>Se connecter</Text></Pressable></View>:!service?<View style={s.notice}><Text style={s.cardTitle}>Service non configuré</Text><Text style={s.body}>La consultation sera disponible après intégration et validation du Core API.</Text></View>:<>{!!error&&<Text accessibilityRole="alert" style={s.empty}>{error}</Text>}{!loading&&loaded&&!visible.length&&!error&&<Text style={s.empty}>Aucun colis à afficher.</Text>}{visible.map(item=><Pressable key={item.id} style={s.card} accessibilityRole="button" accessibilityLabel={`Colis ${item.reference}`} onPress={()=>router.push({pathname:'/parcel-detail',params:{id:item.id}})}><Text style={s.cardTitle}>{item.reference}</Text><Text style={s.body}>{item.origin??'Origine indisponible'} → {item.destination??'Destination indisponible'}</Text><Text style={s.status}>{item.statusLabel}</Text><Text style={s.small}>Actualisé : {formatDate(item.updatedAt)}</Text></Pressable>)}{loading&&<ActivityIndicator color={c.blue} style={{margin:20}}/>}{!!cursor&&!loading&&<Pressable style={s.outline} onPress={()=>void load(cursor,true)} accessibilityRole="button"><Text style={s.outlineText}>Charger la suite</Text></Pressable>}<Pressable style={s.outline} onPress={()=>void load(null,false)} disabled={loading} accessibilityRole="button"><Text style={s.outlineText}>Actualiser</Text></Pressable></>}</ScrollView>;
}
