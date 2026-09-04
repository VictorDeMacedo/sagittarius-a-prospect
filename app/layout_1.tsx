export const metadata = { title: 'ProspectImmo France', description: 'Orléans 30km + Loiret + France entière' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="fr"><body style={{fontFamily:'Inter, sans-serif', background:'#f8fafc'}}>{children}</body></html>
}
