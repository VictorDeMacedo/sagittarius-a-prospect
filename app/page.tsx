'use client'
import { useState } from 'react'
export default function Dashboard(){
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const scrape = async () => {
    setLoading(true)
    setStatus('Connexion LeBonCoin live...')
    try{
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')
      const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const res = await fetch(`${base}/functions/v1/leboncoin-direct`,{
        method:'POST',
        headers:{'Authorization':`Bearer ${anon}`,'Content-Type':'application/json','apikey':anon},
        body: JSON.stringify({ city:'Orléans', lat:47.9025, lng:1.909, radius:30000, limit:35 })
      })
      const data = await res.json()
      if(res.ok && data.listings && data.listings.length>0){
        setListings(data.listings)
        setStatus(`✅ ${data.count} vraies annonces LeBonCoin live!`)
        setLoading(false)
        return
      }
      if(res.status===403) setStatus('⚠️ LeBonCoin bloqué par DataDome - mode démo')
      else setStatus(`Erreur ${res.status}: ${data.error||''} - mode démo`)
    }catch(e:any){
      setStatus(`Erreur: ${e.message} - mode démo`)
    }
    const villes = ['Orléans','Olivet','Saran','Fleury','St-Jean-de-Braye','Chécy','Ingré','La Chapelle']
    const rues = ['Rue de la République','Av. Libération','Rue des Murlins','Allée des Roses','Rue Jeanne d Arc']
    const mock = Array.from({length:42},(_,i)=>({
      address:`${10+i*3} ${rues[i%rues.length]}, ${villes[i%villes.length]}`,
      price:145000 + (i*7349)%300000, days_online:(i*7)%45+1, score_vendeur:72+(i*3)%28,
      city:villes[i%villes.length], url:'#', is_pro:false
    }))
    setTimeout(()=>{ setListings(mock); setLoading(false)},600)
  }
  return (
    <div style={{padding:20, fontFamily:'system-ui', background:'#f8fafc', minHeight:'100vh'}}>
      <h1 style={{fontSize:26, fontWeight:800}}>Sagittarius A Prospect - VRAIE APP</h1>
      <p>Orléans 30km + Loiret Pro + France entière | Supabase ✅ Fonction ✅</p>
      <div style={{display:'flex', gap:20, marginTop:20, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:280, background:'white', padding:20, borderRadius:12}}>
          <h3>Mes Zones</h3>
          <div style={{border:'1px solid #eee', padding:12, borderRadius:8, marginTop:10}}><b>Orléans 30km</b> - 142 annonces</div>
          <button onClick={scrape} style={{marginTop:16, background:'#ff6f00', color:'white', padding:'12px 20px', borderRadius:8, border:0, fontWeight:700, cursor:'pointer', width:'100%'}}>{loading? '⏳ '+status : 'Lancer scrape Orléans LIVE'}</button>
          {status && <div style={{marginTop:12, background: status.includes('✅')?'#dcfce7':'#fef3c7', padding:10, borderRadius:8}}>{status}</div>}
        </div>
        <div style={{flex:2, minWidth:400, background:'white', padding:20, borderRadius:12}}>
          <h3>Pige Live - {listings.length} annonces {listings[0]?.url && listings[0].url!=='#'? '(LIVE LBC)' : '(DÉMO)'}</h3>
          <table style={{width:'100%', marginTop:10, borderCollapse:'collapse'}}><thead><tr style={{textAlign:'left', borderBottom:'2px solid #eee'}}><th style={{padding:8}}>Adresse / Ville</th><th>Prix</th><th>Jours</th><th>Score</th><th>Lien</th></tr></thead><tbody>{listings.map((l:any,i:number)=><tr key={i} style={{borderBottom:'1px solid #f5f5f5'}}><td style={{padding:8}}>{l.address||l.city}</td><td>{(l.price||0).toLocaleString('fr-FR')} €</td><td>{l.days_online}j</td><td>🔥{l.score_vendeur}</td><td>{l.url && l.url!=='#'? <a href={l.url} target='_blank' style={{color:'#ff6f00'}}>Voir</a> : '-'}</td></tr>)}</tbody></table>
        </div>
      </div>
    </div>
  )
}
