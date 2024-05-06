import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, NavLink, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([])
    const {totalProducts} = useLoaderData()
    const [itemPerPage,setItemPerPage]=useState(10)
    const [currentPage,setCurrentPage ]=useState(0)

    
    let totalPage = Math.ceil(totalProducts/itemPerPage)

    // const pages =[];
    // for(let i=0; i<totalPage; i++){
    //     pages.push(i)
    // }

    const pages = [...Array(totalPage).keys()];
    console.log(currentPage);
   
    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage,itemPerPage]);

    useEffect(() => {
        const storedCart = getShoppingCart();
        const savedCart = [];
        // step 1: get id of the addedProduct
        for (const id in storedCart) {
            // step 2: get product from products state by using id
            const addedProduct = products.find(product => product._id === id)
            if (addedProduct) {
                // step 3: add quantity
                const quantity = storedCart[id];
                addedProduct.quantity = quantity;
                // step 4: add the added product to the saved cart
                savedCart.push(addedProduct);
            }
            // console.log('added Product', addedProduct)
        }
        // step 5: set the cart
        setCart(savedCart);
    }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    const handelItemPerPage = (e)=>{
        const value =parseInt( e.target.value)
        console.log(value);
        setItemPerPage(value)
        setCurrentPage(0)
    }
    const handelPrevPage = (e)=>{
        currentPage>0&& setCurrentPage(currentPage-1)
        
    }
    console.log(currentPage,totalPage);
    const handelNextPage = (e)=>{
        currentPage<totalPage-1&& setCurrentPage(currentPage+1)
        
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className="pagination">
                <button onClick={handelPrevPage} className={`${currentPage===0?'hidden':''}`} >Prev</button>
                {
                    pages.map((data,index)=><button 
                        key={index}
                        onClick={()=>setCurrentPage(data)}
                        className={`  ${data===currentPage?'selacted':''}`}
                        >Page:{index}</button>)
                }
                 <button onClick={handelNextPage} className={`${currentPage===totalPage-1?'hidden':''}`}  >Next</button>
                <div>
                    <select name="" onChange={handelItemPerPage}  value={itemPerPage} className='btn-proceed' style={{backgroundColor:'white',color:'black'}}>
                        <option value="5">5 Items</option>
                        <option value="10">10 Items</option>
                        <option value="20">20 Items</option>
                        <option value="30">30 Items</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default Shop;