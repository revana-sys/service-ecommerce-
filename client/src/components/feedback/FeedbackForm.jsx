import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

const FeedbackForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    rating: initialData.rating || 5
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <Card.Header>
        <h2 className="text-xl font-semibold text-gray-800">Submit Feedback</h2>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Feedback
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Star' : 'Stars'}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            Submit Feedback
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm; 