import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';
import { WishlistContext } from '../../pages/Customer/WishlistContext';

const ProductCard = ({ product }) => {
  const { _id, name, price, images, description } = product;
  const isAdmin = JSON.parse(localStorage.getItem('admin'));
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Card variant="elevated">
      <div className="relative">
        <img
          src={images && images.length > 0 ? images[0] : ''}
          alt={name}
          className="w-full h-48 object-cover"
        />
        {!isAdmin && (
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            aria-label="Add to wishlist"
          >
            {isInWishlist(_id) ? (
              <FaHeart className="text-indigo-600" size={20} />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-indigo-600" size={20} />
            )}
          </button>
        )}
      </div>
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