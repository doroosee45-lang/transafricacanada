import React,{createContext,useContext} from 'react';
import type {RecordsService} from './model';
const Context=createContext<RecordsService|null>(null);
export function RecordsProvider({service,children}:{service:RecordsService|null;children:React.ReactNode}){return <Context.Provider value={service}>{children}</Context.Provider>;}
export function useRecordsService(){return useContext(Context);}
