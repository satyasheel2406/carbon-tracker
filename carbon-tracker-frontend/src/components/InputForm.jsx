import React, { useState } from 'react';
import './Form.css';


const InputForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
  car: "",
  bike: "",
  bus: "",
  train: "",
  flights: "",
  electricity: "",
  lpg: "",
  cigarettes: "",
  plastic: "",
  food: "",
  shopping: ""
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const [loading, setLoading] = useState(false); // Add this at the top of your component
  const [firstTime, setFirstTime] = useState(true);
const [loadingText, setLoadingText] = useState("⏳ Preparing Report...");


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (firstTime) {
    setLoadingText("☁️ Waking up server (first time)... please wait");
  } else {
    setLoadingText("⏳ Preparing Report...");
  }

  const parsedForm = {
    fuel_type: form.fuel_type,
    diet: form.diet,
  };

  for (const key in form) {
    if (["fuel_type", "diet"].includes(key)) continue;
    parsedForm[key] = Number(form[key]) || 0;
  }

  try {
    await onSubmit(parsedForm);
    setFirstTime(false); // ✅ Only the first time shows the "waking up" message
  } catch (err) {
    alert("Error generating report");
  }

  setLoading(false);
};


  const handleReset = () => {
    setForm({
      car: "",
      bike: "",
      bus: "",
      train: "",
      flights: "",
      electricity: "",
      lpg: "",
      cigarettes: "",
      plastic: "",
      food: "",
  shopping: ""
    });
  };

  return (
  <form onSubmit={handleSubmit} className="form-container">
    <div className="form-section">
      <h2>🚗 Transportation</h2>
      <label>
        🚘 Car Travel (km/month)
        <input
          type="number"
          name="car"
          min="0"  
          value={form.car}
          onChange={handleChange}
          title="Total kilometers traveled by car in a month"
        />
      </label>
      <label>
        🛵 Bike Travel (km/month)
        <input
          type="number"
          name="bike"
            min="0"  
          value={form.bike}
          onChange={handleChange}
          title="Monthly distance traveled by two-wheeler"
        />
      </label>
      <label>
        🚌 Bus Travel (km/month)
        <input
          type="number"
          name="bus"
            min="0"  
          value={form.bus}
          onChange={handleChange}
          title="Bus kilometers used per month"
        />
      </label>
      <label>
        🚆 Train Travel (km/month)
        <input
          type="number"
          name="train"
            min="0"  
          value={form.train}
          onChange={handleChange}
          title="Train kilometers traveled in a month"
        />
      </label>
      <label>
        ✈️ Flight Travel (km/month)
        <input
          type="number"
          name="flights"
            min="0"  
          value={form.flights}
          onChange={handleChange}
          title="Domestic and international air travel distance per month"
        />
      </label>
    </div>

    <div className="form-section">
      <h2>⚡ Energy</h2>
      <label>
        🔌 Electricity Usage (kWh/month)
        <input
          type="number"
          name="electricity"
            min="0"  
          value={form.electricity}
          onChange={handleChange}
          title="Electricity usage in kilowatt-hours per month"
        />
      </label>
      <label>
        🔥 Cooking Gas Used (kg/month)
        <input
          type="number"
          name="lpg"
            min="0"  
          value={form.lpg}
          onChange={handleChange}
          title="Amount of LPG used in kilograms per month"
        />
      </label>
    </div>

    <div className="form-section">
      <h2>🧴 Lifestyle</h2>
      <label>
        🚬 Cigarettes Smoked (per day)
        <input
          type="number"
          name="cigarettes"
            min="0"  
          value={form.cigarettes}
          onChange={handleChange}
          title="Average number of cigarettes smoked per day"
        />
      </label>
      <label>
        🧃 Plastic Bottles Used (per month)
        <input
          type="number"
          name="plastic"
            min="0"  
          value={form.plastic}
          onChange={handleChange}
          title="Number of 500ml plastic bottles used per month"
        />
      </label>
    </div>
  <div className="form-section">
  <h2>🛒 Consumption</h2>
  <label>
    🍽 Monthly Food Spending (₹)
    <input
      type="number"
      name="food"
      min="0"
      value={form.food}
      onChange={handleChange}
      title="Monthly expenditure on food and dining"
    />
  </label>
  <label>
    🛍 Monthly Shopping Spending (₹)
    <input
      type="number"
      name="shopping"
      min="0"
      value={form.shopping}
      onChange={handleChange}
      title="Monthly spending on clothes, electronics, etc."
    />
  </label>
</div>

    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
     <button type="submit" disabled={loading}>
  {loading ? loadingText : "📊 Calculate My Carbon Footprint"}
</button>


      <button type="button" onClick={handleReset} style={{ backgroundColor: '#ccc', color: '#000' }}>
        ♻️ Reset
      </button>
    </div>
  </form>
);


};

export default InputForm;
