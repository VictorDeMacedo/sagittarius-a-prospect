import { NextResponse } from 'next/server'
export async function POST(){
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')}/functions/v1/leboncoin-direct`
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  try{
    const r = await fetch(url, {
      method:'POST',
      headers:{'Authorization':`Bearer ${key}`,'apikey':key,'Content-Type':'application/json'},
      body: JSON.stringify({ city:'Orléans', lat:47.9025, lng:1.909, radius:30000, limit:35 })
    })
    const data = await r.json()
    return NextResponse.json(data)
  }catch(e:any){
    return NextResponse.json({ error: String(e), fallback: true }, { status: 200 })
  }
}
