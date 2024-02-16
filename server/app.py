from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import joinedload
from datetime import datetime
from sqlalchemy.orm import relationship

data = 'klhgtivhjo://tqzqaxxy:AdUxaBHvduDMiOIQTWAP_F1RPja0GmLc@yFyyov.wy.vovkszmghjo.xln/tqzqaxxy'
la="abcdefghijklmnopqrstuvwxyz"
ua="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
lra=la[::-1]
ura=ua[::-1]
converted_data = ""
for i in range(0, len(data)):
    if data[i] in la:
        converted_data+=lra[la.index(data[i])]
    elif data[i] in ua:
        converted_data+=ura[ua.index(data[i])]
    else:
        converted_data+=data[i]

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = converted_data
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Pizza(db.Model):
    __tablename__ = 'pizzas'
    pizza_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    chef = db.Column(db.String(50), nullable=False)
    date_created = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    toppings = relationship('Topping', secondary='pizza_toppings', back_populates='pizzas')

class Topping(db.Model):
    __tablename__ = 'toppings'
    topping_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    pizzas = relationship('Pizza', secondary='pizza_toppings', back_populates='toppings')

class PizzaToppings(db.Model):
    __tablename__ = 'pizza_toppings'
    pizza_id = db.Column(db.Integer, db.ForeignKey('pizzas.pizza_id'), primary_key=True)
    topping_id = db.Column(db.Integer, db.ForeignKey('toppings.topping_id'), primary_key=True)

@app.route('/pizzas', methods=['GET'])
def get_pizzas():
    pizzas = Pizza.query.options(joinedload(Pizza.toppings)).all()
    pizzas_data = []
    for pizza in pizzas:
        toppings = [topping.name for topping in pizza.toppings]
        pizzas_data.append({
            'name': pizza.name,
            'chef': pizza.chef,
            'date_created': pizza.date_created.strftime('%Y-%m-%d'),
            'toppings': ', '.join(toppings)  # Join toppings into a comma-separated string
        })
    return jsonify(pizzas_data)

@app.route('/toppings', methods=['GET'])
def get_toppings():
    toppings = Topping.query.all()
    return jsonify([{'id': topping.topping_id, 'name': topping.name} for topping in toppings])

@app.route('/pizzas', methods=['POST'])
def create_pizza():
    data = request.json
    name = data['name']
    chef = data['chef']  # Assuming the chef's name is sent in the request
    topping_ids = data['toppings']

    # Check if pizza name already exists
    if Pizza.query.filter_by(name=name).first():
        return jsonify({'error': 'Pizza with this name already exists'}), 409

    # Create new pizza
    new_pizza = Pizza(name=name, chef=chef)
    db.session.add(new_pizza)
    db.session.flush()  # Flush to get the pizza_id before committing

    # Add toppings to the pizza
    for topping_id in topping_ids:
        # Ensure the topping exists
        if not Topping.query.get(topping_id):
            db.session.rollback()  # Rollback if any topping doesn't exist
            return jsonify({'error': 'Topping does not exist'}), 400
        new_pizza_topping = PizzaToppings(pizza_id=new_pizza.pizza_id, topping_id=topping_id)
        db.session.add(new_pizza_topping)

    db.session.commit()
    return jsonify({'message': 'Pizza created successfully', 'pizza_id': new_pizza.pizza_id}), 201


@app.route('/update', methods=['POST'])  # Change the route to /update and method to POST
def update_pizza():
    data = request.json
    pizza_name = data.get('name')  # Extract pizza name from the request body
    pizzas = Pizza.query.filter_by(name=pizza_name).all()
    
    if not pizzas:
        return jsonify({'error': 'No pizzas found with the specified name'}), 404

    # Update each pizza's name and/or toppings
    for pizza in pizzas:
        # Update pizza name
        if 'name' in data:
            pizza.name = data['name']
        
        # Clear existing toppings
        pizza.toppings.clear()
        
        # Add new toppings
        for topping_id in data.get('toppings', []):
            topping = Topping.query.get(topping_id)
            if topping:
                pizza.toppings.append(topping)
    
    db.session.commit()
    return jsonify({'message': f'Pizzas with name "{pizza_name}" updated successfully'}), 200


@app.route('/delete', methods=['POST'])
def delete_pizza():
    data = request.json
    pizza_name = data.get('pizzaName')

    # Check if any pizza exists with the given name
    pizzas = Pizza.query.filter_by(name=pizza_name).all()
    if not pizzas:
        return jsonify({'error': f'No pizza found with name "{pizza_name}"'}), 404

    # Delete all pizzas with the given name
    for pizza in pizzas:
        db.session.delete(pizza)

    db.session.commit()
    return jsonify({'message': f'Pizzas with name "{pizza_name}" deleted successfully'}), 200

@app.route('/add-topping', methods=['POST'])
def add_topping():
    data = request.json
    topping_name = data.get('name')

    # Check if the topping already exists
    existing_topping = Topping.query.filter_by(name=topping_name).first()
    if existing_topping:
        return jsonify({'error': f'Topping "{topping_name}" already exists'}), 409

    # Create a new topping
    new_topping = Topping(name=topping_name)
    db.session.add(new_topping)
    db.session.commit()

    return jsonify({'message': f'Topping "{topping_name}" added successfully'}), 201

@app.route('/delete-topping', methods=['POST'])
def delete_topping():
    data = request.json
    topping_name = data.get('toppingName')

    # Check if the topping exists
    existing_topping = Topping.query.filter_by(name=topping_name).first()
    if not existing_topping:
        return jsonify({'error': f'Topping "{topping_name}" not found'}), 404

    # Delete the topping
    db.session.delete(existing_topping)
    db.session.commit()

    return jsonify({'message': f'Topping "{topping_name}" deleted successfully'}), 200

if __name__ == '__main__':
    app.run(port=5000,debug=True)

