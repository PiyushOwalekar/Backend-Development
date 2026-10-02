export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map((e) => e.message).join(", ")
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "A record with this value already exists"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
