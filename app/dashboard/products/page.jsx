
import { FetchProducts } from '@/app/actions/action';
import ProductList from '@/app/components/product/product-list'


export default async function Products() {

  const data = await FetchProducts();

  return (
    <div className='flex min-h-full w-full'>
      <ProductList products={data} />

    </div>

  )
}



