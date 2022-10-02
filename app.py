from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route('/')
@app.route('/home')
def home_page():
    return render_template("home.html", title="Home")


@app.route('/about')
def about_page():
    return render_template("about.html", title="About")


@app.route('/game')
def game_page():
    return render_template("game.html", title="The Game")


@app.route('/contact-us')
def contact_page():
    return render_template("contact.html", title="Contact Us")


if __name__ == "__main__":
    app.run(debug=True)
