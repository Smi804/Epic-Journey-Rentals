import React, { createContext,useState } from "react";
import all_product from "./Assets/all_product";

export const ShopContext = createContext();

const getDefaultCart=()=>
    {
        let cart ={};
        for(let index=0;index<all_product.length+1;index++)
            {
                cart[index]=0;
            }
            return cart;
    }


const ShopContentProvider = (props) => 
    {
     
    const [cartItems,setCartItems] = useState(getDefaultCart());

    let addToCart = (itemId)=>
        {
            setCartItems((currentItem)=>
                {
                  let setCurrentcart = {...currentItem};
                  setCurrentcart[itemId]+=1;
                  return setCurrentcart;
                });
        }

let removeFromCart = (itemId)=>
    {
    setCartItems((currentItem)=>
        {
            let setCurrentcart = {...currentItem};
            setCurrentcart[itemId]-=1;
            return setCurrentcart;
        });
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(let items in cartItems) {
            if(cartItems[items] > 0) {
                let product = all_product.find((e) => e.id === parseInt(items));
                if(product) { 
                    totalAmount += product.new_price * cartItems[items];
                }
            }
        }
        return totalAmount;
    }


    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) 
            {
                if(cartItems[item]>0)
                {
                    totalItem+=cartItems[item];
                }
            }
            return totalItem;
    }

let contextValue = {all_product,getTotalCartItems,cartItems,addToCart,removeFromCart,getTotalCartAmount};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
}

export default ShopContentProvider;