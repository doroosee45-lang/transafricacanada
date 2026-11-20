import React from 'react';
import {Redirect} from 'expo-router';
import type {Href} from 'expo-router';
import type {Params} from '../nav';
import * as agent from './agent';
import * as client from './client';
import * as start from './auth';
import * as publicScreens from './public';

type Screen = (props: {params: Params}) => React.ReactElement | null;

const redirect = (to: (params: Params) => Href): Screen => function RedirectScreen({params}) {
  return <Redirect href={to(params)} />;
};

/** 49 entrées fonctionnelles : 8 démarrage/authentification, 25 client, 16 agent. */
export const screens: Record<string, Screen> = {
  // Pages publiques (hors des 48 écrans fonctionnels)
  about: publicScreens.About,
  solutions: publicScreens.Solutions,
  // A. Authentification et démarrage
  splash: start.Splash,
  intro: start.Intro,
  language: start.Language,
  welcome: start.Welcome,
  login: redirect(() => ({pathname: '/auth', params: {mode: 'login'}})),
  register: redirect(() => ({pathname: '/auth', params: {mode: 'register'}})),
  forgot: redirect(() => ({pathname: '/auth', params: {mode: 'reset'}})),
  'verify-code': start.VerifyCode,
  // B. Espace client
  'client-dashboard': client.ClientDashboard,
  'request-new': client.RequestNew,
  'request-confirm': client.RequestConfirm,
  requests: client.Requests,
  'request-detail': client.RequestDetail,
  quote: client.Quote,
  'quote-decision': client.QuoteDecision,
  'payment-select': client.PaymentSelect,
  'payment-result': client.PaymentResult,
  parcels: redirect(() => '/parcels'),
  'parcel-detail': redirect(p => ({pathname: '/parcel-detail', params: {id: p.id ?? ''}})),
  'parcel-tracking': client.ParcelTracking,
  shipments: redirect(() => ({pathname: '/records', params: {kind: 'shipments'}})),
  'shipment-detail': redirect(p => ({pathname: '/record-detail', params: {kind: 'shipments', id: p.id ?? ''}})),
  flights: client.Flights,
  'flight-detail': client.FlightDetail,
  notifications: redirect(() => ({pathname: '/records', params: {kind: 'notifications'}})),
  support: client.Support,
  'ticket-new': client.TicketNew,
  'ticket-detail': client.TicketDetail,
  profile: client.Profile,
  'profile-edit': client.ProfileEdit,
  addresses: client.Addresses,
  'payments-history': client.PaymentsHistory,
  settings: client.Settings,
  // C. Espace agent
  'agent-dashboard': agent.AgentDashboard,
  tasks: agent.Tasks,
  'task-detail': agent.TaskDetail,
  scan: redirect(() => '/scan'),
  'scan-result': agent.ScanResult,
  receive: agent.Receive,
  warehouse: agent.Warehouse,
  transfer: agent.Transfer,
  deliveries: agent.Deliveries,
  'delivery-detail': agent.DeliveryDetail,
  proof: agent.Proof,
  'incident-new': agent.IncidentNew,
  incidents: agent.Incidents,
  'incident-detail': agent.IncidentDetail,
  'offline-queue': redirect(() => '/synchronisation'),
  'agent-profile': agent.AgentProfile,
};
