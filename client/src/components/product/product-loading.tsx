import React from "react";

const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-background rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-muted" />
      <div className="p-6">
        <div className="h-4 bg-muted rounded w-3/4 mb-4" />
        <div className="h-3 bg-muted rounded w-full mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
