# ✅ app.py — Flask Backend with Real CO₂ Factors
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json

    # CO₂ emission factors (kg CO₂ per unit)
    FACTORS = {
        'car': 0.192,           # kg/km
        'bike': 0.07,           # kg/km
        'bus': 0.105,           # kg/km
        'train': 0.041,         # kg/km
        'flights': 0.15,        # kg/km (domestic average)
        'electricity': 0.82,    # kg/kWh
        'lpg': 2.983,           # kg/kg
        'cigarettes': 0.014,    # kg/cigarette
        'plastic': 0.0828       # kg/bottle (500ml)
    }

    # Normalize and calculate emissions
    emissions = {}
    total = 0.0

    for key, factor in FACTORS.items():
        raw = float(data.get(key, 0))
        if key == "cigarettes":
            raw *= 30  # daily -> monthly
        emissions[key.capitalize()] = round(raw * factor, 2)
        total += raw * factor

    emissions['Total'] = round(total, 2)
    return jsonify({"total": round(total, 2), "emissions": emissions})

if __name__ == '__main__':
    app.run(debug=True)

