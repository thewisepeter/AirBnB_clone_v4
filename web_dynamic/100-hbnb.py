#!/usr/bin/python3
"""Starts a Flask web application on 0.0.0.0, port 5000.
Routes:
    /hbnb: HBnB home page.
"""
import uuid
from models import storage
from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route("/100-hbnb", strict_slashes=False)
def hbnb():
    """ Retrieves states, places and amenities from the db."""

    states = storage.all("State").values()
    states = sorted(states, key=lambda k: k.name)
    states_list = []

    for state in states:
        states_list.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all("Amenity").values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all("Place").values()
    places = sorted(places, key=lambda k: k.name)

    cache_id = str(uuid.uuid4())

    # Pass the cached_id and other properties to the template
    return render_template("100-hbnb.html",
                           states=states_list, amenities=amenities,
                           places=places, cache_id=cache_id)


@app.teardown_appcontext
def teardown(exc):
    """Remove the current SQLAlchemy session after request."""
    storage.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
