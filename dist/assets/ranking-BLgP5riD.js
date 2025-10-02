import{d as c,c as d,q as m,o as y,a as u}from"./firebase-config-CYVDa9ry.js";let s=[];async function g(){try{return!!c}catch(e){return console.error("Firebase connection failed:",e),!1}}function h(){try{console.log("📡 Setting up mesas listener...");const e=d(c,"mesas"),a=m(e,y("chaves","desc")),o=u(a,n=>{s=[],n.forEach(t=>{var r;const i={id:parseInt(t.id),nome:t.data().nome,chaves:t.data().chaves||0,ultimaAtualizacao:((r=t.data().ultimaAtualizacao)==null?void 0:r.toDate())||new Date};s.push(i)}),p()},n=>{console.error("❌ Error in mesas listener:",n),l()});window.rankingUnsubscribe=o}catch(e){console.error("❌ Error setting up mesas listener:",e)}}function p(){f(),v(),w()}function f(){const e=document.getElementById("winner-podium"),a=document.getElementById("winner-name");if(s.length>0){const o=s[0];a.textContent=o.nome,e.style.display="flex"}else e.style.display="none"}function v(){const e=document.getElementById("ranking-list");if(e.innerHTML="",s.length===0){e.innerHTML='<div class="no-data">Nenhuma mesa cadastrada ainda.<br>Use o painel admin para criar mesas.</div>';return}const a=1e3;[...s].sort((n,t)=>n.id-t.id).sort((n,t)=>t.chaves-n.chaves).slice(0,5).forEach(n=>{const t=n.chaves/a*100,i=document.createElement("div");i.className="mesa-row",i.innerHTML=`
            <div class="progress-fill" style="width: ${t}%"></div>
            <div class="mesa-content">
                <span>${n.nome}</span>
                <div class="keys">
                    <img src="https://i.imgur.com/UlRQH5U.png" alt="Ícone Chave" class="key-image-icon" onerror="this.style.display='none';" />
                    <svg class="key-icon fallback-icon" viewBox="0 0 100 100">
                        <circle cx="30" cy="30" r="20" fill="none" stroke="#FFC107" stroke-width="6"/>
                        <rect x="45" y="25" width="40" height="10" fill="#FFC107"/>
                        <rect x="75" y="20" width="5" height="8" fill="#FFC107"/>
                        <rect x="75" y="32" width="5" height="8" fill="#FFC107"/>
                    </svg>
                    <span>${n.chaves}</span>
                </div>
            </div>
        `,e.appendChild(i)})}function w(){document.getElementById("loading").style.display="none",document.getElementById("ranking-list").style.opacity="1"}document.addEventListener("DOMContentLoaded",async()=>{await g()?h():l()});window.loadRanking=()=>{location.reload()};function l(){document.getElementById("loading").style.display="none",document.getElementById("error").style.display="block",document.getElementById("ranking-list").style.opacity="0.5"}
