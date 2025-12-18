import { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
const Page = () => {
    
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);
const alertdata = ()=>
{
    alert("Hello")
}
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4008/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const addProduct = async () => {
    try {
      const response = await axios.post("http://localhost:4008/products/create", newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:4008/products/delete/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center font-bold text-white mb-4">Product CRUD App</h1>
      <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-4">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <input
          type="number"
          name="quantity"
          value={newProduct.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <button onClick={addProduct} className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 mt-2">Add Product</button>
      </div>
      <div className="overflow-x-auto">
            <table className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-black text-white">
                <tr>
                <th className="py-3 px-6 text-left">ID</th>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Description</th>
                    <th className="py-3 px-6 text-left">Price</th>
                    <th className="py-3 px-6 text-left">Quantity</th>
                    <th className="py-3 px-6 text-left">Action</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-200">
                    <td className="py-4 px-6">{product._id}</td>
                    <td className="py-4 px-6">{product.name}</td>
                    <td className="py-4 px-6">{product.description}</td>
                    <td className="py-4 px-6">{product.price}</td>
                    <td className="py-4 px-6">{product.quantity}</td>
                    <td className="py-4 px-6 w-80"> 
                    <button onClick={alertdata} className="bg-black text-white px-3 py-2 rounded-md hover:bg-gray-900 mr-2">View</button>
                    <button className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-700 mr-2">
                      <Link to={`/update/${product._id}`}>
                        Update
                      </Link>
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-700">Delete</button>
                </td>

                </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );

};

export default Page;