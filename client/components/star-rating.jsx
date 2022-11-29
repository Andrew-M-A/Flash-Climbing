import React, { useState } from 'react';
import { Rating } from 'react-simple-star-rating';

export default function StarRating() {

  const [rating, setRating] = useState(0);

  const handleRating = rate => {
    setRating(rate);

    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 1,
        gymId: 1,
        rating: rate / 20
      })
    };
    fetch('/api/climbing/rating', req)
      .then(res => res.json())
      .then(result => {
      });
  };

  return (
    <Rating
      transition
      onClick={handleRating}
      ratingValue={rating}
      size={18}
      fillColorArray={['#90e0ef', '#90e0ef', '#0077b6', '#ff7d00', '#ef233c']}
      tooltipArray={['V0 :)', 'V1-V2', 'V3-V4', 'V5-V6', 'Adam Ondra :O']}
      allowHalfIcon />
  );
}
