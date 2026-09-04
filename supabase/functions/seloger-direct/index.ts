// supabase/functions/seloger-direct/index.ts - Gratuit
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { city = "Orléans", department = null, zone_id, owner_id } = await req.json().catch(() => ({}))
  // Mock gratuit pour démo - en prod on parse SeLoger
  const listings = Array.from({ length: 22 }, (_, i) => ({
    zone_id, owner_id, source: 'seloger_direct', external_id: `seloger_${Date.now()}_${i}`,
    title: Math.random()>0.5?'Maison':'Appartement', address: city, city, department_code: department||"45",
    price: 190000+Math.floor(Math.random()*180000), surface: 75+Math.floor(Math.random()*70),
    property_type: Math.random()>0.5?'maison':'appart', days_online: 10+Math.floor(Math.random()*100),
    price_drop:0, price_drop_percent:0, url: `https://www.seloger.com/annonce-${i}.htm`,
    score_vendeur: Math.min(100, Math.round(Math.random()*40+20)), lat:47.9, lng:1.9, is_pro:false
  }))
  if (zone_id && owner_id) await supabase.from('pige_listings').upsert(listings, { onConflict: 'external_id,zone_id' })
  return new Response(JSON.stringify({ success:true, count:listings.length, listings }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
})
