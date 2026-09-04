import { NextResponse } from 'next/server'

export async function POST(){
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const base = supaUrl.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')
  const funcUrl = `${base}/functions/v1/leboncoin-direct`

  try{
    const r = await fetch(funcUrl, {
      method:'POST',
      headers:{
        'Authorization':`Bearer ${supaKey}`,
        'apikey':supaKey,
        'Content-Type':'application/json'
      },
      body: JSON.stringify({ city:'Orléans', lat:47.9025, lng:1.909, radius:30000, limit:35 })
    })
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  }catch(e:any){
    return NextResponse.json({ error: 'Proxy error: '+String(e), fallback: true }, { status: 200 })
  }
}
