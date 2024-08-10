from flask import Flask, render_template, request, redirect, url_for
from markupsafe import escape

app = Flask(__name__)

# Ruta para mostrar la página principal
@app.route('/', methods=['GET', 'POST'])

def index():
    if request.method == 'POST':
        # Obtener datos del formulario
        nombre = request.form['nombre']
        email = request.form['email']
        mensaje = request.form['mensaje']
        #nombre = escape(request.form['nombre'])
        #email = escape(request.form['email'])
        #mensaje = escape(request.form['mensaje'])
        
        # Validar que los campos no estén vacíos
        if not nombre or not email or not mensaje:
            return "Error: Todos los campos son requeridos."
        
        # Validar formato de email
        if "@" not in email or "." not in email:
            return "Error: Email no válido."

        # Validar que el mensaje no contenga código malicioso
        if "<script>" in mensaje or "</script>" in mensaje:
            return "Error: Código malicioso detectado en el mensaje."
        
        # Guardar los datos en un archivo de texto
        with open('mensajes.txt', 'a') as f:
            f.write(f'Nombre: {nombre}\nEmail: {email}\nMensaje: {mensaje}\n\n')

        return redirect(url_for('index'))
    
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
