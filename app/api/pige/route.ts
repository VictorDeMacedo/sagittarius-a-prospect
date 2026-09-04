import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(){
  try{
    const payload = {
      limit: 35,
      filters: {
        category: { id: "2" },
        enums: { ad_type: ["offer"] },
        location: { locations: [{ city: "Orleans", lat: 47.9025, lng: 1.909, radius: 30000 }] },
        keywords: {},
        ranges: {}
      }
    }

    const r = await fetch('https://api.leboncoin.fr/finder/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://www.leboncoin.fr',
        'Referer': 'https://www.leboncoin.fr/',
        'api_key': 'ba0c2dad52b3ec'
      },
      body: JSON.stringify(payload)
    })

    const txt = await r.text()
    
    if(!r.ok){
      return NextResponse.json({ 
        error: `LeBonCoin bloque ${r.status} - DataDome`,
        details: txt.slice(0,400),
        fallback: true,
        listings: []
      }, { status: 200 })
    }

    let j:any = {}
    try{ j = JSON.parse(txt) }catch{}

    const ads = j.ads || j.results || []
    const listings = ads.map((ad:any,i:number)=>({
      address: ad.location?.city || 'Orleans',
      city: ad.location?.city || 'Orleans',
      price: ad.price?.[0] || ad.price || 150000,
      title: ad.subject || 'Annonce LBC',
      url: ad.url || `https://www.leboncoin.fr/ad/${ad.list_id||''}`,
      days_online: 1,
      score_vendeur: 80+(i%20),
      is_pro: false
    }))

    return NextResponse.json({ count: listings.length, listings })

  }catch(e:any){
    return NextResponse.json({ error: `V8 Error: ${String(e)} cause:${String(e.cause||'')}`, fallback:true, listings:[] }, { status:200 })
  }
}
