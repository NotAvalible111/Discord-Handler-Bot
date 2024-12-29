#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para mostrar mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar si hay cambios
if [[ -z $(git status -s) ]]; then
    print_warning "No hay cambios para actualizar"
    exit 0
fi

# Mostrar cambios pendientes
print_message "Cambios pendientes:"
git status -s

# Solicitar mensaje de commit
read -p "Actualizaciones globales y mejoras " commit_message

# Si no se proporciona mensaje, usar uno por defecto
if [[ -z "$commit_message" ]]; then
    commit_message="Actualización: $(date +%Y-%m-%d_%H-%M-%S)"
    print_warning "Usando mensaje por defecto: $commit_message"
fi

# Añadir cambios
print_message "Añadiendo cambios..."
git add .

# Crear commit
print_message "Creando commit..."
git commit -m "$commit_message"

# Subir cambios
print_message "Subiendo cambios a GitHub..."
git push origin main

print_message "¡Actualización completada!"