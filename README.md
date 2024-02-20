# Pizza Shop Manager
Hosted on [http://abrahamcervantes.com](http://abrahamcervantes.com/) (Make sure your browser does not redirect to https, it should be http)


I selected React as my front end due to its easy setup with create-react-app and my previous experience with it. I also wanted to explore MaterialUI's component library a bit more.

For my backend I chose a Python Flask app because it was something I wanted to learn. I have had experience with node.js to handle database operations, but this time, I wanted to challenge myself in python.

I also wanted to teach myself about hosting on AWS, so I chose to host the Flask app on an [EC2 instance](https://aws.amazon.com/ec2/). As for my database I used a fast and easy PostgreSQL as a Service to hold my created tables.


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
4. After dependencies are installed and the app built, use start.bat or startWithVenv.bat to start both the frontend and backend at the same time.
5. In the app, toggle the Local button and type the corresponding port number from the python backend console(should default to 5000).

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
