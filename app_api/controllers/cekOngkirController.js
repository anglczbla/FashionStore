const axios = require("axios");

const cekOngkir = async (req, res) => {
  const { origin, destination, weight, courier, price } = req.body;
  try {
    const response = await axios.post(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      {
        'origin': origin,
        'destination': destination,
        'weight': weight,
        'courier': courier,
        'price': price
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          key: "",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
    cekOngkir
}
