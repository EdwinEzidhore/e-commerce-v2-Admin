
import { FetchCategory } from '@/app/actions/CategoryActions'
import Newproduct from '@/app/components/product/create'
import Category from '@/lib/modals/Category.js'
import React from 'react'




const page = async() => {

  const categories = await FetchCategory();

  return <Newproduct categories={ categories} />  
      
}

export default page