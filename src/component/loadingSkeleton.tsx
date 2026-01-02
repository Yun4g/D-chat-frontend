



 const LoadingSkeleton = () => (
  <div className="space-y-3 px-3 mt-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="h-12 rounded-lg bg-gray-700 animate-pulse"
      />
    ))}
  </div>
);

export default LoadingSkeleton;