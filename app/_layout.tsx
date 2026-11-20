import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { RecordsProvider } from '../src/features/records/context';
import { ParcelsProvider } from '../src/features/parcels/context';
import { AuthProvider } from '../src/auth/AuthProvider';
import { coreParcels, coreRecords } from '../src/backend';
export default function Layout() { return <AuthProvider><ParcelsProvider service={coreParcels}><RecordsProvider service={coreRecords}><StatusBar style="dark"/><Stack screenOptions={{animation:'slide_from_right',headerShadowVisible:false,headerTintColor:'#171614',headerStyle:{backgroundColor:'#FAF8F5'},headerTitleStyle:{fontWeight:'800'},contentStyle:{backgroundColor:'#FAF8F5'}}}><Stack.Screen name="index" options={{headerShown:false}}/><Stack.Screen name="auth-callback" options={{title:'Vérification'}}/><Stack.Screen name="reset-password" options={{title:'Récupération'}}/><Stack.Screen name="auth" options={{title:'Votre compte'}}/><Stack.Screen name="records" options={{title:'Mes informations'}}/><Stack.Screen name="record-detail" options={{title:'Détails'}}/><Stack.Screen name="parcels" options={{title:'Mes colis'}}/><Stack.Screen name="parcel-detail" options={{title:'Suivi'}}/><Stack.Screen name="scan" options={{title:'Scanner'}}/><Stack.Screen name="synchronisation" options={{title:'File locale'}}/><Stack.Screen name="s/[name]" options={{title:'Trans Africa Canada'}}/><Stack.Screen name="section" options={{title:'Trans Africa Canada'}}/></Stack></RecordsProvider></ParcelsProvider></AuthProvider>; }
