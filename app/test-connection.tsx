"use client"
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function TestConnection() {
  const handleTest = async () => {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .limit(1)
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Connection successful!', data)
      alert('Supabase connection working!')
    } catch (error) {
      console.error('Connection failed:', error)
      alert('Connection failed! Check console for details.')
    }
  }

  return (
    <Button onClick={handleTest}>
      Test Supabase Connection
    </Button>
  )
} 