(this.webpackJsonpinstatext=this.webpackJsonpinstatext||[]).push([[0],{155:function(e,t,a){e.exports=a(344)},160:function(e,t,a){},167:function(e,t,a){},344:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(7),c=a.n(r),o=(a(160),a(161),a(21)),s=(a(66),a(18)),m=(a(165),a(40)),i=(a(167),a(349)),u=a(350),d=a(351),p=a(64),E=a(33),h=(a(343),a(152)),g=a(154),f=(a(176),a(153)),v=a(135),b=a.n(v),x=a(136),y=a.n(x),k=a(107),w=a(348),S=Object(w.a)("%B %d, %Y"),I=[{title:"Recipients",dataIndex:"recipients",width:"20%"},{title:"Message",dataIndex:"message",ellipsis:!0,sorter:{compare:function(e,t){return e.message.localeCompare(t.message)},multiple:1}},{title:"sent",width:"20%",dataIndex:"timestamp",render:function(e,t){return S(t.timestamp)},sorter:{compare:function(e,t){return e.timestamp-t.timestamp},multiple:2}}];var N=f.a.Search,C=function(){var e=Object(n.useState)(function(e){for(var t=[],a=0;a<e;a++){var n=[k.a[Math.ceil(Math.random()*k.a.length)]],l=y()({min:5,max:30}).join(" "),r=1e3*b()(),c=a.toString();t.push({key:c,recipients:n,message:l,timestamp:r})}return t}(10)),t=Object(g.a)(e,2),a=t[0];t[1];return Object(n.useEffect)((function(){}),[]),l.a.createElement("div",{className:"inbox"},l.a.createElement(N,{placeholder:"input search text",enterButton:"Search",size:"large",onSearch:function(e){return console.log(e)}}),l.a.createElement(h.a,{columns:I,dataSource:a,onChange:function(){}}))},M=m.a.Header,j=m.a.Footer,B=m.a.Sider,H=m.a.Content,O=function(){return l.a.createElement("span",null," Home")},A=function(){return l.a.createElement("span",null," Home")};var W=function(){return l.a.createElement(p.a,null,l.a.createElement(m.a,null,l.a.createElement(B,{breakpoint:"lg",collapsedWidth:"0",onBreakpoint:function(e){console.log(e)},onCollapse:function(e,t){console.log(e,t)}},l.a.createElement("div",{className:"logo"},"Instatext"),l.a.createElement("div",{className:"main-nav"},l.a.createElement(s.a,{className:"add-message",type:"primary",shape:"round",icon:l.a.createElement(i.a,null)},"Add new message"),l.a.createElement(o.a,{theme:"dark",mode:"inline",defaultSelectedKeys:["1"]},l.a.createElement(o.a.Item,{key:"1"},l.a.createElement(p.b,{to:"/inboc"},l.a.createElement(u.a,null),l.a.createElement("span",{className:"nav-text"},"Inbox"))),l.a.createElement(o.a.Item,{key:"2"},l.a.createElement(p.b,{to:"/contact"},l.a.createElement(d.a,null),l.a.createElement("span",{className:"nav-text"},"Contacts"))))),l.a.createElement(p.b,{to:"/admin"},l.a.createElement("div",{className:"bottom-nav"},"Manage Account"))),l.a.createElement(m.a,null,l.a.createElement(M,{className:"site-layout-sub-header-background",style:{padding:0}}),l.a.createElement(H,{style:{margin:"24px 16px 0"}},l.a.createElement("div",{className:"site-layout-background",style:{padding:24,minHeight:360}},l.a.createElement(E.c,null,l.a.createElement(E.a,{path:"/inbox"}),l.a.createElement(C,null),l.a.createElement(E.a,{path:"/contact"},l.a.createElement(A,null)),l.a.createElement(E.a,{path:"/"},l.a.createElement(O,null))))),l.a.createElement(j,{style:{textAlign:"center"}},"I.T System Prod M.C D.C \xa92021"))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(W,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[155,1,2]]]);
//# sourceMappingURL=main.a3c313a2.chunk.js.map