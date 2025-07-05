# ✅ Final Correct app.py — expects lowercase keys from frontend
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json

    FACTORS = {
        'car': 0.192,
        'bike': 0.07,
        'bus': 0.105,
        'train': 0.041,
        'flights': 0.15,
        'electricity': 0.82,
        'lpg': 2.983,
        'cigarettes': 0.014,
        'plastic': 0.0828
    }

    emissions = {}
    total = 0.0

    for key, factor in FACTORS.items():
        raw = float(data.get(key, 0))  # 👈 lowercase key from frontend
        if key == "cigarettes":
            raw *= 30
        emissions[key.capitalize()] = round(raw * factor, 2)
        total += raw * factor

    emissions['Total'] = round(total, 2)
    return jsonify({"total": round(total, 2), "emissions": emissions})

if __name__ == '__main__':
    app.run(debug=True)
