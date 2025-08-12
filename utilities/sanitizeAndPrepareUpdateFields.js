function sanitizeAndPrepareUpdateFields(data) {
  const allowedFields = [
    "name",
    "price",
    "discountedPrice",
    "stock",
    "color",
    "description",
  ];
  const updateFields = {};

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updateFields[key] = data[key];
    }
  }

  return updateFields;
}

module.exports = sanitizeAndPrepareUpdateFields;