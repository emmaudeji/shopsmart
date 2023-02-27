import React, { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  // add product to cart
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

    // if product is in cart, update product quantity nd don't add product to cart
    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        // if ProductIsInCart, then update its qty
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
      });

      setCartItems(updatedCartItems);
    } else {
      // add a new product with a new quantity object
      product.quantity = quantity;

      setCartItems([...cartItems, { ...product }]);
    }

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    );
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    );
    setCartItems(newCartItems);
  };

  const toggleCartItemQuanitity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);

    // method 3 - not so cool. filter item from list and return a newlist. set newlist as cartItem while editting foundproduct using spread operator. this will add foundProduct to the end of the newlist. and that's not cool.
    const newCartItems = cartItems.filter((item) => item._id !== id);

    // method 1 - edit foundproduct and replace it in cartitems according to index. then go back and setCartItem with cartItem to replace old state with mutated cartItem.
    cartItems.splice(index, 1, {
      ...foundProduct,
      quantity: foundProduct.quantity + 1,
    });

    //  method 2 - map cartItem, edit product based on id, and return items acordingly
    const mapList = cartItems.map((item) => {
      if (item._id === id) {
        if (value === "inc") {
          return { ...item, quantity: foundProduct.quantity + 1 };
        } else if (value === "dec") {
          return { ...item, quantity: foundProduct.quantity - 1 };
        }
      }
      return item;
    });

    // check outputs
    // console.log("spliceCart-", cartItems, "mapList-", mapList, "filterCart-",  newCartItems);

    if (value === "inc") {
      setCartItems(mapList);
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        setCartItems(mapList);
        // setCartItems([
        //   ...newCartItems,
        //   { ...foundProduct, quantity: foundProduct.quantity - 1 },
        // ]);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        toast,
        incQty,
        decQty,
        onAdd,
        setShowCart,
        showCart,
        totalPrice,
        toggleCartItemQuanitity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StateContext;

export const useStateContext = () => useContext(Context);
