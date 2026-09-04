// supabase/functions/leboncoin-direct/index.ts
// VRAIE Edge Function - LeBonCoin Direct - 100% gratuit sans Apify
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const LBC_API_KEY = "ba0c2dad52b3ec"
const LBC_FINDER_URL = "https://api.leboncoin.fr/finder/search"
const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const body = await req.json().catch(() => ({}))
  const { lat = 47.9025, lng = 1.909, radius = 30000, city = "Orléans", department = null, property_types = ["1","2"], price_min = 50000, price_max = 2000000, limit = 35, zone_id = null, owner_id = null } = body

  const isPro = property_types.includes("6")
  const categoryId = isPro ? "10" : "9"

  const payload: any = {
    limit, limit_alu: 3, offset: 0,
    filters: {
      category: { id: categoryId },
      enums: { ad_type: ["offer"] },
      ranges: { price: { min: price_min, max: price_max } },
      location: {}
    },
    sort_by: "time", sort_order: "desc", listing_source: "direct-search", extend: true
  }

  if (!isPro) payload.filters.enums.real_estate_type = property_types
  else payload.filters.enums.real_estate_type = ["6"]

  if (department && !city) {
    payload.filters.location = { locations: [], departments: [department] }
  } else {
    payload.filters.location = { locations: [{ locationType: "city", label: city, city, lat, lng, radius, department: department || undefined }] }
  }

  if (!isPro) payload.filters.enums.owner_type = ["private"]

  try {
    const res = await fetch(LBC_FINDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api_key': LBC_API_KEY, 'User-Agent': 'Mozilla/5.0', 'Origin': 'https://www.leboncoin.fr', 'Referer': 'https://www.leboncoin.fr/' },
      body: JSON.stringify(payload)
    })

    if (res.status === 403) {
      return new Response(JSON.stringify({ error: "DataDome 403 - Utilise Option C GitHub Actions ou import manuel gratuit" }), { status: 403, headers: corsHeaders })
    }

    const data = await res.json()
    const ads = data.ads || []

    const normalized = ads.map((ad: any) => {
      const firstPub = ad.first_publication_date ? new Date(ad.first_publication_date) : new Date()
      const daysOnline = Math.floor((Date.now() - firstPub.getTime()) / (1000*60*60*24))
      const price = ad.price?.[0] || ad.price || 0
      return {
        zone_id, owner_id, source: 'leboncoin_direct', external_id: `lbc_${ad.list_id || ad.id}`,
        title: ad.subject, address: ad.location?.city || city, city: ad.location?.city || city,
        department_code: department || ad.location?.department_id || "45",
        price, surface: parseInt(ad.attributes?.find((a:any)=>a.key==="square")?.value || "0"),
        property_type: ad.attributes?.find((a:any)=>a.key==="real_estate_type")?.value === "1" ? "maison" : "appart",
        days_online: daysOnline, price_drop: 0, price_drop_percent: 0,
        url: ad.url || `https://www.leboncoin.fr/ad/ventes_immobilieres/${ad.list_id}`,
        score_vendeur: Math.min(100, Math.round(daysOnline*0.6)), lat: ad.location?.lat || lat, lng: ad.location?.lng || lng, is_pro: ad.owner?.type === "pro"
      }
    })

    if (zone_id && owner_id && normalized.length > 0) {
      await supabase.from('pige_listings').upsert(normalized, { onConflict: 'external_id,zone_id' })
      await supabase.from('zones').update({ last_scrape_at: new Date().toISOString(), annonces_count: normalized.length }).eq('id', zone_id)
    }

    return new Response(JSON.stringify({ success: true, count: normalized.length, listings: normalized }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders })
  }
})
