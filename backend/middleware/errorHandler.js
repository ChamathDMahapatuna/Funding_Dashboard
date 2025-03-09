// Not Found Handler
export const notFound = (req, res, next) => {
  res.status(404).json({ message: "API Route Not Found" });
};

// Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
};
