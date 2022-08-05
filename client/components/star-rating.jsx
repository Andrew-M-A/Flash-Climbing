import React, { useState } from 'react';
import { Rating } from 'react-simple-star-rating';

export default function StarRating() {
  const [rating, setRating] = useState(0);

  const handleRating = rate => {
    setRating(rate);
    // other logic
  };

  return (
      <Rating
      transition
      onClick={handleRating}
      ratingValue={rating}
      size={18}
      fillColorArray={['#f17a45', '#f19745', '#f1a545', '#f1b345', '#f1d045']}
      tooltipArray={['V0 :)', 'V1-V2', 'V3-V4', 'V5-V6', 'Adam Ondra :O']}
      allowHalfIcon/>
  );
}
