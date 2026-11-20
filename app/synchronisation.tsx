import React,{useCallback,useRef,useState} from 'react';
import {ActivityIndicator,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {useFocusEffect} from 'expo-router';
import {useAuth} from '../src/auth/AuthProvider';
import {queueStore} from '../src/sync/store';
import type {QueueItem} from '../src/sync/types';
import {colors as c} from '../src/theme';
const labels={pending:'En attente de validation',accepted:'Acceptée par le serveur',rejected:'Rejetée par le serveur',conflict:'Conflit à résoudre'};
export default function Synchronisation(){
 const {session}=useAuth();const userId=session?.user.id;
 return <QueueScreen key={userId??'guest'} userId={userId}/>;
}
function QueueScreen({userId}:{userId?:string}){
 const [items,setItems]=useState<QueueItem[]>([]);const [loading,setLoading]=useState(false);const [error,setError]=useState('');const generation=useRef(0);
 const load=useCallback(()=>{const current=++generation.current;setItems([]);setError('');if(!userId){setLoading(false);return;}setLoading(true);queueStore.list(userId).then(v=>{if(generation.current===current)setItems(v);}).catch((cause:unknown)=>{if(generation.current===current)setError(cause instanceof Error&&cause.message==='SQLCipher indisponible sur cet appareil.'?'La file chiffrée est indisponible dans Expo Go : elle nécessite SQLCipher et un build natif compatible.':'Impossible de lire la file locale.');}).finally(()=>{if(generation.current===current)setLoading(false);});},[userId]);
 useFocusEffect(useCallback(()=>{load();return()=>{generation.current++;};},[load]));
 return <ScrollView style={s.root} contentContainerStyle={s.content}><Text style={s.title}>Synchronisation</Text><Text style={s.subtitle}>Opérations conservées sur cet appareil</Text><View style={s.notice}><Text style={s.noticeTitle}>Synchronisation non configurée</Text><Text style={s.body}>La transmission nécessite un contrat Core API validé. Les opérations locales ne constituent pas une confirmation de réception ou de livraison.</Text></View>{!userId?<Text style={s.empty}>Connectez-vous pour consulter votre file locale.</Text>:loading?<ActivityIndicator style={{margin:30}} color={c.blue}/>:error?<Text accessibilityRole="alert" style={s.empty}>{error}</Text>:items.length===0?<Text style={s.empty}>Aucune opération locale pour ce compte.</Text>:items.map(item=><View key={item.id} style={s.card}><Text style={s.cardTitle}>{item.type}</Text><Text style={s.body}>Référence : {item.reference}</Text><Text style={s.body}>Créée : {new Date(item.createdAt).toLocaleString()}</Text><Text style={s.state}>{labels[item.status]}</Text>{item.serverMessage&&<Text style={s.body}>{item.serverMessage}</Text>}</View>)}<Pressable accessibilityRole="button" onPress={load} style={s.reload}><Text style={s.reloadText}>Actualiser la liste locale</Text></Pressable></ScrollView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:c.background},content:{padding:22,maxWidth:700,width:'100%',alignSelf:'center'},title:{fontSize:28,fontWeight:'800',color:c.ink},subtitle:{color:c.muted,marginTop:8},notice:{backgroundColor:'#FDF0E2',padding:18,borderRadius:16,marginTop:24},noticeTitle:{fontWeight:'800',color:c.ink},body:{color:c.muted,lineHeight:21,marginTop:6},empty:{color:c.muted,lineHeight:22,marginVertical:30},card:{backgroundColor:'white',borderWidth:1,borderColor:c.border,borderRadius:16,padding:16,marginTop:14},cardTitle:{fontWeight:'800',color:c.ink},state:{color:c.blue,fontWeight:'700',marginTop:10},reload:{borderWidth:1,borderColor:c.blue,borderRadius:12,padding:14,alignItems:'center',marginTop:20},reloadText:{color:c.blue,fontWeight:'700'}});
