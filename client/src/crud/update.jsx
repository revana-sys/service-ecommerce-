import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Update = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:4008/products/get/${id}`);
      const productData = response.data;
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setQuantity(productData.quantity);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProduct = async () => {
    const data = {
      name,
      description,
      price,
      quantity
    };

    try {
      await axios.put(`http://localhost:4008/products/update/${id}`, data);
      navigate("/crud");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl text-center font-bold text-white mb-4">Update Product</h1>
      <div className="w-full max-w-md p-4 rounded shadow-lg bg-white mb-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <input
          type="number"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <input
          type="number"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-blue-800"
        />
        <button onClick={updateProduct} className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 mt-2">Update Product</button>
      </div>
    </div>
  );
};

export default Update;
