import{d as r,c as d,q as m,o as y,a as u}from"./firebase-config-CfDjXtCw.js";let s=[];async function g(){try{return!!r}catch(e){return console.error("Firebase connection failed:",e),!1}}function h(){try{console.log("📡 Setting up mesas listener...");const e=d(r,"mesas"),a=m(e,y("chaves","desc")),t=u(a,i=>{s=[],i.forEach(n=>{var o;const l={id:parseInt(n.id),nome:n.data().nome,chaves:n.data().chaves||0,ultimaAtualizacao:((o=n.data().ultimaAtualizacao)==null?void 0:o.toDate())||new Date};s.push(l)}),p()},i=>{console.error("❌ Error in mesas listener:",i),c()});window.rankingUnsubscribe=t}catch(e){console.error("❌ Error setting up mesas listener:",e)}}function p(){f(),w(),v()}function f(){const e=document.getElementById("winner-podium"),a=document.getElementById("winner-name");if(s.length>0){const t=s[0];a.textContent=t.nome,e.style.display="flex"}else e.style.display="none"}function w(){const e=document.getElementById("ranking-list");if(e.innerHTML="",s.length===0){e.innerHTML='<div class="no-data">Nenhuma mesa cadastrada ainda.<br>Use o painel admin para criar mesas.</div>';return}const a=1e3;s.forEach(t=>{const i=t.chaves/a*100,n=document.createElement("div");n.className="mesa-row",n.innerHTML=`
            <div class="progress-fill" style="width: ${i}%"></div>
            <div class="mesa-content">
                <span>${t.nome}</span>
                <div class="keys">
                    <img src="https://i.imgur.com/UlRQH5U.png" alt="Ícone Chave" class="key-image-icon" onerror="this.style.display='none';" />
                    <svg class="key-icon fallback-icon" viewBox="0 0 100 100">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="#FFC107" stroke-width="6"/>
                        <rect x="45" y="25" width="40" height="10" fill="#FFC107"/>
                        <rect x="75" y="20" width="5" height="8" fill="#FFC107"/>
                        <rect x="75" y="32" width="5" height="8" fill="#FFC107"/>
                    </svg>
                    <span>${t.chaves}</span>
                </div>
            </div>
        `,e.appendChild(n)})}function v(){document.getElementById("loading").style.display="none",document.getElementById("ranking-list").style.opacity="1"}document.addEventListener("DOMContentLoaded",async()=>{await g()?h():c()});window.loadRanking=()=>{location.reload()};function c(){document.getElementById("loading").style.display="none",document.getElementById("error").style.display="block",document.getElementById("ranking-list").style.opacity="0.5"}
