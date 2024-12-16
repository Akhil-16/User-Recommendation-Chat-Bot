import { useEffect, useState } from 'react'
import '../Homecss/New_products.css'
import grid2 from '../../../images/grid2.png'
import grid3 from '../../../images/grid3.png'
import grid4 from '../../../images/grid4.png'


function New_products() {
  

  const [products,setproducts]=useState([])

  async function newpro(){
    const response=await fetch("http://127.0.0.1:5001/newproducts")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
    const data = await response.json();
    console.log("new products received:", data);
     setproducts(data.images)
  }
  console.log("length of products is ",products)
  useEffect(() => {
    newpro(); 
  }, []);
  if(products.length===0){
    return null
  }

  

  return (
   
  
    <div className='New-produ'>
     <div className='Title' style={{fontSize: '23px', fontWeight: 700, margin: '20px 0px 0px 45px'}}>
         <span className='new' style={{textDecoration: 'underline', color: 'red', borderWidth: '3px'}}>NEW P</span>RODUCTS
      </div>
      <div className='produ_list'>
        <ul className='list'>
        {products.map((product, index) =>
  <li key={index} className='product_item'>
    <div className='imag_box'>
      <img
        className="images"
        src={`data:image/jpeg;base64,${product.image_data}`}
        alt={`Image ${index}`}
      />
    </div>
    <div className='product_details'>
      <p className='product_name'>{product.combined_text}</p>
    </div>
  </li>
)}


          
        </ul>
      </div>
    </div>
  )
}

export default New_products