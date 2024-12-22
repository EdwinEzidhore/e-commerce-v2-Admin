import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center min-h-full'>
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  )
}

export default Loading