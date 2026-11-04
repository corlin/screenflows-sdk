/*! ScreenFlows sf.js v1.3.0 | (c) ScreenFlows | MIT License
 * 源码公开，服务端点由 screenflows.dev 提供。
 * 用法见同目录的 README.md。
 */
(function(w,d){"use strict";
if(w.screenflows&&w.screenflows._v)return;
var s=d.currentScript||d.querySelector('script[data-key][src*="/sdk/v1/sf.js"]');if(!s)return;
var key=s.getAttribute("data-key");if(!key)return;
var host=s.getAttribute("data-host")||new URL(s.src).origin;
var endpoint=host+"/ingest/v1/collect?k="+encodeURIComponent(key);
var needConsent=s.getAttribute("data-consent")==="required";
var respectDnt=s.getAttribute("data-respect-dnt")!=="false";
var autoPv=s.getAttribute("data-auto-pageview")!=="false";
var nav=w.navigator||{};
var dnt=respectDnt&&(nav.doNotTrack==="1"||w.doNotTrack==="1"||nav.globalPrivacyControl===true);
var ls={get:function(k){try{return w.localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{w.localStorage.setItem(k,v)}catch(e){}},del:function(k){try{w.localStorage.removeItem(k)}catch(e){}}};
function rid(){var a=new Uint8Array(12);(w.crypto||w.msCrypto).getRandomValues(a);return Array.prototype.map.call(a,function(b){return("0"+b.toString(16)).slice(-2)}).join("")}
var consent=ls.get("sf_consent");
function allowed(){if(ls.get("sf_optout")==="1")return false;if(needConsent)return consent==="1";return !dnt}
function anon(){var u=ls.get("sf_uid");if(!u){u="v_"+rid();ls.set("sf_uid",u)}return u}
function uid(){return ls.get("sf_user")||anon()}
function sid(){var now=Date.now(),raw=ls.get("sf_sid"),p=raw?raw.split("."):null;
if(!p||now-Number(p[1])>18e5){p=["s_"+rid(),now]}p[1]=now;ls.set("sf_sid",p[0]+"."+p[1]);return p[0]}
var q=[],timer=null,lastUrl=null;
function send(useBeacon){if(!q.length)return;for(var j=0;j<q.length;j++)titled(q[j]);var body=JSON.stringify({events:q.splice(0,50)});
if(useBeacon&&nav.sendBeacon&&nav.sendBeacon(endpoint,body))return;
try{fetch(endpoint,{method:"POST",body:body,keepalive:true,mode:"cors",credentials:"omit",headers:{"Content-Type":"text/plain"}})}catch(e){}}
function schedule(){if(!timer)timer=setTimeout(function(){timer=null;send(false)},5e3)}
function push(e){if(!allowed())return;e.uid=uid();e.aid=anon();e.sid=sid();e.ts=Date.now();e.url=e.url||w.location.href;q.push(e);if(q.length>=20)send(false);else schedule()}
function titled(e){if(e.type==="pageview"&&!e.title&&e.url===w.location.href&&d.title)e.title=String(d.title).slice(0,200)}
function pv(u,ref,title){var e={type:"pageview",url:u,ref:ref};if(title)e.title=String(title).slice(0,200);push(e);if(!e.title)setTimeout(function(){titled(e)},1e3)}
function pageview(){var u=w.location.href;if(u===lastUrl)return;var ref=lastUrl||d.referrer||"";lastUrl=u;pv(u,ref)}
function clean(props){var o={},n=0;if(props&&typeof props==="object")for(var k in props){if(n>=20)break;var v=props[k];if(typeof v==="string"||typeof v==="number"||typeof v==="boolean"){o[k]=v;n++}}return o}
var api={_v:1,
track:function(name,props){if(typeof name==="string"&&name)push({type:"event",name:name.slice(0,300),props:clean(props)})},
page:function(path,opts){if(path&&typeof path==="object"){opts=path;path=null}var title=opts&&typeof opts.title==="string"?opts.title:"";if(typeof path==="string"&&path.charAt(0)==="/"&&path.charAt(1)!=="/"){var u=w.location.origin+path.slice(0,500);if(u===lastUrl)return;var ref=lastUrl||d.referrer||"";lastUrl=u;pv(u,ref,title)}else{var cu=w.location.href,cr=lastUrl||d.referrer||"";lastUrl=cu;pv(cu,cr,title)}},
identify:function(id){if(id){id=String(id).slice(0,128);var prev=ls.get("sf_user");ls.set("sf_user",id);if(prev!==id)push({type:"identify"})}else{ls.del("sf_user")}},
consent:function(ok){consent=ok?"1":"0";ls.set("sf_consent",consent);if(ok&&autoPv){lastUrl=null;pageview()}},
optOut:function(){ls.set("sf_optout","1");q.length=0},
optIn:function(){ls.del("sf_optout")}};
var pending=(w.screenflows&&w.screenflows.q)||[];w.screenflows=api;
for(var i=0;i<pending.length;i++){var c=pending[i];if(api[c[0]])api[c[0]].apply(api,[].slice.call(c,1))}
if(autoPv){var hp=w.history;["pushState","replaceState"].forEach(function(m){var o=hp&&hp[m];if(!o)return;hp[m]=function(){for(var j=0;j<q.length;j++)titled(q[j]);var r=o.apply(this,arguments);setTimeout(pageview,0);return r}});
w.addEventListener("popstate",pageview);w.addEventListener("hashchange",pageview);
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",pageview);else pageview()}
d.addEventListener("visibilitychange",function(){if(d.visibilityState==="hidden")send(true)});
w.addEventListener("pagehide",function(){send(true)});
})(window,document);
