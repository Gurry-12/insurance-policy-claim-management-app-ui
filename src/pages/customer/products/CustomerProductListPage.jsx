import { useEffect, useState } from "react";
import { getActiveProducts } from "../../../services/productService";

const CustomerProductListPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getActiveProducts();

      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">

      <h2>Browse Insurance Products</h2>

      <div className="row mt-4">

        {products.map((product) => (
          <div
            key={product.productId}
            className="col-md-4 mb-4"
          >
            <div className="card h-100 shadow-sm">

              <div className="card-body">

                <h5 className="card-title">
                  {product.productName}
                </h5>

                <p>
                  <strong>Type:</strong>{" "}
                  {product.productType}
                </p>

                <p>
                  <strong>Description:</strong>
                  <br />
                  {product.description}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {product.active ? "Active" : "Inactive"}
                </p>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default CustomerProductListPage;