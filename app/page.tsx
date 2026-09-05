'use client'
import { useState, useEffect } from 'react'

type Listing = { address:string, city:string, price:number, url:string, days_online:number, score_vendeur:number, title?:string }

export default function DashboardV9(){
  const [listings, setListings] = useState<Listing[]>([])
  const [filter, setFilter] = useState('all')
  const [source, setSource] = useState('Chargement...')

  useEffect(()=>{
    (async()=>{
      try{
        const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        if(supaUrl){
          const r = await fetch(`${supaUrl}/rest/v1/listings?order=created_at.desc&limit=100`, {
            headers: { apikey: anon!, Authorization: `Bearer ${anon}` }
          })
          const data = await r.json()
          if(Array.isArray(data) && data.length>0){
            setListings(data)
            setSource(`🟢 LIVE Supabase (${data.length} vraies annonces via GitHub Action)`)
            return
          }
        }
      }catch{}
      const villes = ['Orléans','Olivet','Saran','Fleury','Chécy','Ingré','La Chapelle','St-Jean-de-Braye']
      const mock = Array.from({length:42},(_,i)=>({
        address: `${10+i*3} Rue de la République, ${villes[i%villes.length]}`,
        city: villes[i%villes.length],
        price: 145000 + (i*7349)%300000,
        url: '#',
        days_online: (i*7)%45+1,
        score_vendeur: 72+(i*3)%28,
        title: `Maison ${70+i*2}m² ${villes[i%villes.length]}`
      }))
      setListings(mock)
      setSource('🟡 DÉMO - Lance la GitHub Action pour avoir les vraies annonces')
    })()
  },[])

  const filtered = listings.filter(l => filter==='all' || l.city.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div style={{padding:24, fontFamily:'system-ui', background:'#f8fafc', minHeight:'100vh'}}>
      <h1 style={{fontSize:28, fontWeight:900}}>Sagittarius A Prospect - V9 PRO</h1>
      <p style={{color:'#64748b'}}>{source} | Orléans 30km | Score vendeur</p>
      <div style={{marginTop:16, display:'flex', gap:8}}>
        {['all','Orléans','Olivet','Chécy','Saran'].map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{padding:'8px 12px', borderRadius:20, border:c===filter?'2px solid #ff6f00':'1px solid #e2e8f0', background:c===filter?'#fff7ed':'white', cursor:'pointer', fontWeight:600}}>{c==='all'?'Toutes':c}</button>
        ))}
      </div>
      <table style={{width:'100%', marginTop:20, background:'white', borderRadius:12, borderCollapse:'collapse'}}>
        <thead><tr style={{borderBottom:'2px solid #f1f5f9', textAlign:'left', color:'#64748b'}}><th style={{padding:10}}>Adresse</th><th>Prix</th><th>Jours</th><th>Score</th><th>Lien</th></tr></thead>
        <tbody>{filtered.map((l,i)=><tr key={i} style={{borderBottom:'1px solid #f8fafc'}}><td style={{padding:10}}><b>{l.title}</b><br/><span style={{fontSize:12, color:'#64748b'}}>{l.city}</span></td><td style={{fontWeight:700}}>{l.price.toLocaleString('fr-FR')} €</td><td>{l.days_online}j</td><td>🔥{l.score_vendeur}</td><td>{l.url!=='#'?<a href={l.url} target='_blank' style={{background:'#ff6f00', color:'white', padding:'6px 10px', borderRadius:8, textDecoration:'none'}}>Voir</a>:'-'}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
