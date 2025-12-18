import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  const { _id, name, price, images, description } = product;
  const isAdmin = JSON.parse(localStorage.getItem('admin'));

  return (
    <Card variant="elevated">
      <img
        src={images && images.length > 0 ? images[0] : ''}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <Card.Body>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${price}</span>
          <Button
            variant="primary"
            size="small"
            as={Link}
            to={isAdmin ? `/product/${_id}` : `/Vproductt/${_id}`}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard; 