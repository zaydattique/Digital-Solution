"use client";
import { useState, type MouseEvent } from "react";
import { ArrowUpRight, Instagram, Linkedin, Facebook, Mail, Phone } from "lucide-react";
import { Brand } from "@/src/components/brand/Brand";
import { useSite } from "@/src/components/brand/SiteContext";
import { getServiceItemHref, serviceMenuGroups } from "@/src/features/services/data/services";
import { claimMailSendPermission } from "@/src/lib/mailRateLimit";
export function AgencyFooter(){
 const site=useSite();const [message,setMessage]=useState("");
 const name=site["brand.name"]||"HavocX Agency";
 const email=site["contact.email"];
 const onEmail=(event:MouseEvent<HTMLAnchorElement>)=>{const permission=claimMailSendPermission();if(!permission.allowed){event.preventDefault();setMessage(permission.message)}};
 return <footer className="hx-footer" id="contact"><div className="hx-footer-inner">
  <div className="hx-footer-top"><div><span className="hx-footer-eyebrow">/ HAVE A PROJECT IN MIND?</span><h2>Let&apos;s make<br/><em>it happen.</em></h2></div><a className="hx-footer-contact" href="/book-a-demo">Start a project <ArrowUpRight size={25}/></a></div>
  <div className="hx-footer-grid">
    <div className="hx-footer-brand"><a href="/" aria-label={name+" homepage"}><Brand /></a><p>{site["brand.description"]||"Strategy, design and digital experiences built with purpose."}</p>
      {email&&<a href={`mailto:${email}`} onClick={onEmail}><Mail size={16}/>{email}</a>}
      {[site["contact.phone"],site["contact.phoneSecondary"]].filter(Boolean).map(phone=><a key={phone} href={`tel:${phone.replace(/[^+\d]/g,"")}`}><Phone size={16}/>{phone}</a>)}
      {message&&<p role="status">{message}</p>}
      <div className="hx-footer-social">{site["social.instagram"]&&<a href={site["social.instagram"]} aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={19}/></a>}{site["social.linkedin"]&&<a href={site["social.linkedin"]} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin size={19}/></a>}{site["social.facebook"]&&<a href={site["social.facebook"]} aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={19}/></a>}</div>
    </div>
    {serviceMenuGroups.map(group=><div className="hx-footer-links" key={group.id}><h3><a href={`/services/${group.id}`}>{group.title}</a></h3>{group.services.map(service=><a href={getServiceItemHref(service,group.id)} key={service}>{service}</a>)}</div>)}
  </div>
  <div className="hx-footer-bottom"><span>© {new Date().getFullYear()} {name}. All rights reserved.</span><div><a href="/privacy-policy">Privacy Policy</a><a href="/terms-of-service">Terms of Service</a><a href="/#top">Back to top ↑</a></div></div>
 </div></footer>
}
export default AgencyFooter;
