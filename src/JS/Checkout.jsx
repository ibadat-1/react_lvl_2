import { useDispatch, useSelector } from "react-redux";
import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
// import { getProducts } from "./dataService";
import { useEffect } from "react";
import {
  fetchProducts,
  incrementQuantity,
  decrementQuantity,
  calculateDiscount,
} from "../redux/slices/productSlice";

const Product = ({ product, onIncrement, onDecrement }) => {
  const isPlusDisabled = product.orderedQuantity >= product.available;
  const isMinusDisabled = product.orderedQuantity === 0;

  return (
    <tr>
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.available}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>{product.orderedQuantity}</td>
      <td>${product.total.toFixed(2)}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={onIncrement}
          disabled={isPlusDisabled}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          onClick={onDecrement}
          disabled={isMinusDisabled}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
    discount,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(calculateDiscount());
  }, [products, dispatch]);

  const total = products.reduce((sum, product) => sum + product.total, 0);

  if (status === "loading") return <LoadingIcon />;
  if (status === "failed") return <h1 style={{ color: red }}>{error}</h1>;

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {/* <LoadingIcon /> */}
        {/* <h4 style={{ color: "red" }}>Some thing went wrong</h4> */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                onIncrement={() => dispatch(incrementQuantity(product.id))}
                onDecrement={() => dispatch(decrementQuantity(product.id))}
              >
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.available}</td>
                <td>${product.price}</td>
                <td>{product.orderedQuantity}</td>
                <td>${product.total}</td>
                <td>
                  <button>+</button>
                  <button>-</button>
                </td>
              </Product>
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Total: ${total.toFixed(2)}</p>
        {discount > 0 && <p>Discount: ${discount.toFixed(2)}</p>}
      </main>
    </div>
  );
};

export default Checkout;
