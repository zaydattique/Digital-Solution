"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "@/src/components/brand/Brand";
import { serviceMenuGroups, getServiceItemHref } from "@/src/features/services/data/services";
export function ServicePageHeader({backHref, backLabel="Back to home"}:{backHref?:string;backLabel?:string}){
 const [open,setOpen]=useState(false),[servicesOpen,setServicesOpen]=useState(false);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);setServicesOpen(false)}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[]);
 return <header className="hx-nav" role="banner">
  <a className="hx-nav-brand" href="/" aria-label="HavocX Agency homepage"><Brand compact /></a>
  <nav aria-label="Primary navigation" className={open?"hx-nav-links is-open":"hx-nav-links"}>
   <a href="/#work" onClick={()=>setOpen(false)}>Work</a>
   <div className="hx-nav-dropdown">
     <button type="button" className="hx-services-trigger" aria-expanded={servicesOpen} aria-controls="hx-service-menu" onClick={()=>setServicesOpen(v=>!v)}>Services <ChevronDown size={15}/></button>
     <div id="hx-service-menu" className={servicesOpen?"hx-mega is-open":"hx-mega"}>
       {serviceMenuGroups.map(group=><div className="hx-mega-group" key={group.id}><a className="hx-mega-title" href={`/services/${group.id}`} onClick={()=>{setOpen(false);setServicesOpen(false)}}>{group.title}<ArrowUpRight size={15}/></a>{group.services.map(service=><a href={getServiceItemHref(service,group.id)} key={service} onClick={()=>{setOpen(false);setServicesOpen(false)}}>{service}</a>)}</div>)}
     </div>
   </div>
   {backHref&&<a href={backHref} className="hx-context-back" onClick={()=>setOpen(false)}>{backLabel}</a>}<a href="/#about" onClick={()=>setOpen(false)}>Studio</a><a href="/#approach" onClick={()=>setOpen(false)}>Approach</a>
  </nav>
  <a className="hx-nav-cta" href="/book-a-demo">Start a project <ArrowUpRight size={18}/></a>
  <button className="hx-menu" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label={open?"Close navigation":"Open navigation"}>{open?<X/>:<Menu/>}</button>
 </header>
}