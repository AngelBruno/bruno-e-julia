import"./firebase-config-Cap9RXTK.js";class a{constructor(){this.mesas=[],this.totalKeys=1e3,this.isLoading=!1,this.urlLogoJB="https://i.imgur.com/H0lljWw.png",this.urlFechadura="https://i.imgur.com/roNFBG5.png",this.urlChave="https://i.imgur.com/UlRQH5U.png",this.loadRanking=this.loadRanking.bind(this),this.renderRanking=this.renderRanking.bind(this),this.autoRefreshInterval=setInterval(()=>{this.loadRanking()},3e4)}async loadRanking(){if(!this.isLoading){this.isLoading=!0,this.showLoading();try{const e=await this.getMockData();this.mesas=e.sort((n,i)=>i.chaves-n.chaves),this.renderRanking(),this.hideLoading()}catch(e){console.error("Erro ao carregar ranking:",e),this.showError()}finally{this.isLoading=!1}}}async getMockData(){return[{id:1,nome:"MESA 05",chaves:420},{id:2,nome:"MESA 02",chaves:330},{id:3,nome:"MESA 11",chaves:250},{id:4,nome:"MESA 08",chaves:180},{id:5,nome:"MESA 15",chaves:100},{id:6,nome:"MESA 03",chaves:50},{id:7,nome:"MESA 01",chaves:20}]}renderRanking(){this.renderWinner(),this.renderMesasList()}renderWinner(){const e=document.getElementById("winner-podium"),n=document.getElementById("winner-name");if(this.mesas.length>0){const i=this.mesas[0];n.textContent=i.nome,e.style.display="flex"}else e.style.display="none"}renderMesasList(){const e=document.getElementById("ranking-list");e.innerHTML="",this.mesas.forEach(n=>{const i=this.totalKeys>0?n.chaves/this.totalKeys*100:0,s=document.createElement("div");s.className="mesa-row",s.innerHTML=`
                <div class="progress-fill" style="width: ${i}%"></div>
                <div class="mesa-content">
                    <span>${n.nome}</span>
                    <div class="keys">
                        <img src="${this.urlChave}" alt="Ícone Chave" class="key-image-icon" onerror="this.style.display='none';" />
                        <svg class="key-icon fallback-icon" viewBox="0 0 100 100">
                            <circle cx="30" cy="30" r="20" fill="none" stroke="#FFC107" stroke-width="6"/>
                            <rect x="45" y="25" width="40" height="10" fill="#FFC107"/>
                            <rect x="75" y="20" width="5" height="8" fill="#FFC107"/>
                            <rect x="75" y="32" width="5" height="8" fill="#FFC107"/>
                        </svg>
                        <span>${n.chaves}</span>
                    </div>
                </div>
            `,e.appendChild(s)})}showLoading(){document.getElementById("loading").style.display="block",document.getElementById("error").style.display="none",document.getElementById("ranking-list").style.opacity="0.5"}hideLoading(){document.getElementById("loading").style.display="none",document.getElementById("ranking-list").style.opacity="1"}showError(){document.getElementById("loading").style.display="none",document.getElementById("error").style.display="block",document.getElementById("ranking-list").style.opacity="0.5"}destroy(){this.autoRefreshInterval&&clearInterval(this.autoRefreshInterval)}}let t;document.addEventListener("DOMContentLoaded",()=>{t=new a,t.loadRanking()});window.loadRanking=()=>{t&&t.loadRanking()};window.addEventListener("beforeunload",()=>{t&&t.destroy()});
