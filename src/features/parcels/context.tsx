import React,{createContext,useContext} from 'react';
import type {ParcelsService} from './types';
/** Null means unconfigured, never a mocked production service. */
const Context=createContext<ParcelsService|null>(null);
export function ParcelsProvider({service,children}:{service:ParcelsService|null;children:React.ReactNode}){return <Context.Provider value={service}>{children}</Context.Provider>;}
export const useParcelsService=()=>useContext(Context);
