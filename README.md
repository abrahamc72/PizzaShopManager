# Pizza Shop Manager
Hosted on http://abrahamcervantes.com
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Front-End
React.js hosted [here](http://abrahamcervantes.com). 

Using 

create-react-app

Material UI Components

# Back-End
Python Flask with SQLAlchemy to handle database operations.

Running on Amazon EC2 instance.

Database hosted on SQLElephant.

# Locally Testing
Clone the repo.
1. Install python requirements. (installpythonreqs.bat)
   
       If you prefer to keep the installation inside a venv use the creatvenv.bat, assuming you have virtualvenv installed. Then activate the venv and run the installpythonreqs.bat
   
       If there are issues, you might have to edit the python commands in the bat to whatever you use (python => python3).
   
3. Install and Build react.js app with installbuildclient.bat, requires npm.
4. After dependencies areinstalled and the app built, use start.bat or startWithVenv.bat to start both the frontend and backend at the same time.
5. In the app, toggle the Local button and type the corresponding port number on the python backend console(should default to 5000).

# Recreating Table
Below is the structure of the pizza database.

CREATE TABLE pizzas (
    pizza_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    chef VARCHAR(50) NOT NULL,
    date_created TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE toppings (
    topping_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE pizza_toppings (
    pizza_id INT NOT NULL,
    topping_id INT NOT NULL,
    FOREIGN KEY (pizza_id) REFERENCES pizzas(pizza_id),
    FOREIGN KEY (topping_id) REFERENCES toppings(topping_id),
    PRIMARY KEY (pizza_id, topping_id)
);
