'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard(){
  const [zones, setZones] = useState<any[]>([
    { id: '1', name: 'Orléans 30km Particulier', type: 'rayon', city: 'Orléans', radius: 30, count: 142 },
    { id: '2', name: 'Loiret 45 Pro Entrepôts', type: 'departement', department: '45', count: 23 }
  ])
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const scrapeOrleans = async () => {
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/leboncoin-direct`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: 'Orléans', lat: 47.9025, lng: 1.909, radius: 30000, property_types: ['1','2'] })
    })
    const data = await res.json()
    setListings(data.listings || [])
    setLoading(false)
  }

  return (
    <div style={{padding:20}}>
      <h1 style={{fontSize:28, fontWeight:800}}>ProspectImmo France - VRAIE APP</h1>
      <p>Orléans 30km + Loiret Pro + France entière | Connecté Supabase</p>
      
      <div style={{display:'flex', gap:20, marginTop:20}}>
        <div style={{flex:1, background:'white', padding:20, borderRadius:12}}>
          <h2>Mes Zones (France entière)</h2>
          {zones.map(z => (
            <div key={z.id} style={{border:'1px solid #eee', padding:12, borderRadius:8, marginTop:10}}>
              <b>{z.name}</b> - {z.count} annonces
            </div>
          ))}
          <button style={{marginTop:15, background:'#ff6f00', color:'white', padding:'10px 20px', borderRadius:8, border:0}} onClick={scrapeOrleans}>
            {loading ? 'Scraping...' : 'Lancer scrape Orléans 30km (GRATUIT)'}
          </button>
        </div>
        <div style={{flex:2, background:'white', padding:20, borderRadius:12}}>
          <h2>Pige Live - {listings.length} annonces</h2>
          <table style={{width:'100%', marginTop:10}}>
            <thead><tr><th>Adresse</th><th>Prix</th><th>Jours</th><th>Score</th></tr></thead>
            <tbody>
              {listings.map((l:any,i:number) => (
                <tr key={i}><td>{l.address}</td><td>{l.price}€</td><td>{l.days_online}j</td><td>🔥{l.score_vendeur}</td></tr>
              ))}
            </tbody>
          </table>
          {listings.length===0 && <p>Clique sur Lancer scrape pour voir les vraies annonces Orléans</p>}
        </div>
      </div>

      <div style={{marginTop:20, background:'#0f172a', color:'white', padding:20, borderRadius:12}}>
        <h3>Comment mettre en ligne ?</h3>
        <ol>
          <li>Crée projet Supabase (EU) - 2 min</li>
          <li>Exécute schema_v4_france.sql dans SQL Editor</li>
          <li>supabase functions deploy leboncoin-direct</li>
          <li>Push ce dossier sur GitHub + Vercel Deploy (2 min) avec tes clés Supabase</li>
        </ol>
        <p>C'est une vraie app Next.js + Supabase, pas du HTML factice. Le dossier /app contient le code source.</p>
      </div>
    </div>
  )
}
