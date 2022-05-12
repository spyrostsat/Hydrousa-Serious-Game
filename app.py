from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html") # αφου εβαλα το index.html στο folder templates, ψαχνει αυτοματα η python σε αυτο τον φακελο για αρχεια html και γιαυτο δεν χρειαζεται να γραψω το ονομα του folder στο path
    # το Flask απαιτει τα html αρχεια να ειναι μεσα σε ενα folder με ονομα templates
if __name__ == "__main__":
    app.run(debug=True)
