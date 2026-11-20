import React, {createContext, useContext, useEffect, useState} from 'react';
import type {Session} from '@supabase/supabase-js';
import {supabase} from './supabase';
type AuthState={session:Session|null; loading:boolean; error:string|null};
type AuthContext=AuthState & {recoveryReady:boolean; setRecoveryReady:(value:boolean)=>void};
const Context=createContext<AuthContext>({session:null,loading:true,error:null,recoveryReady:false,setRecoveryReady:()=>{}});
export function AuthProvider({children}:{children:React.ReactNode}) {
 const [recoveryReady,setRecoveryReady]=useState(false);
 const [state,setState]=useState<AuthState>({session:null,loading:!!supabase,error:null});
 useEffect(()=>{
  if(!supabase) return;
  let active=true; let eventSeen=false;
  const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{eventSeen=true;if(active){if(!session)setRecoveryReady(false);setState({session,loading:false,error:null});}});
  supabase.auth.getSession().then(({data,error})=>{if(active&&!eventSeen)setState({session:data.session,loading:false,error:error?'Impossible de restaurer la session.':null});}).catch(()=>{if(active&&!eventSeen)setState({session:null,loading:false,error:'Impossible de restaurer la session.'});});
  return ()=>{active=false;subscription.unsubscribe();};
 },[]);
 return <Context.Provider value={{...state,recoveryReady,setRecoveryReady}}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
