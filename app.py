from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

# Database setup
def init_db():
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS datos (
                    id INTEGER PRIMARY KEY,
                    hora_consumicion TEXT,
                    edad INTEGER,
                    peso REAL,
                    altura REAL,
                    sexo TEXT,
                    frecuencia_bebida TEXT,
                    copa_ron INTEGER,
                    copa_ginebra INTEGER,
                    cerveza REAL,
                    tercio_licor INTEGER,
                    hora_ultima_comida TEXT)''')
    conn.commit()
    conn.close()

# Initialize the database (this only runs once)
init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    hora_consumicion = request.form['hora_consumicion']
    edad = request.form['edad']
    peso = request.form['peso']
    altura = request.form['altura']
    sexo = request.form['sexo']
    frecuencia_bebida = request.form['frecuencia_bebida']
    copa_ron = request.form.get('copa_ron', 0)
    copa_ginebra = request.form.get('copa_ginebra', 0)
    cerveza = request.form.get('cerveza', 0)
    tercio_licor = request.form.get('tercio_licor', 0)
    hora_ultima_comida = request.form['hora_ultima_comida']
    
    # Insert data into the database
    conn = sqlite3.connect('data.db')
    c = conn.cursor()
    c.execute('''INSERT INTO datos (hora_consumicion, edad, peso, altura, sexo, frecuencia_bebida, copa_ron, copa_ginebra, cerveza, tercio_licor, hora_ultima_comida)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
              (hora_consumicion, edad, peso, altura, sexo, frecuencia_bebida, copa_ron, copa_ginebra, cerveza, tercio_licor, hora_ultima_comida))
    conn.commit()
    conn.close()

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
