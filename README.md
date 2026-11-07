ThemeIcon: Componente encargado de mostrar el ícono
del tema actual de la aplicación (sol o luna), permitiendo al usuario identificar 
visualmente si está activo el modo claro o el modo oscuro.
<img width="620" height="387" alt="image" src="https://github.com/user-attachments/assets/3909185d-b359-4642-a0a1-a5b4641233d6" />
DepartmentCard: Componente encargado de mostrar cada departamento como una tarjeta 
interactiva dentro del listado principal, permitiendo seleccionarlo para visualizar 
información detallada y ciudades asociadas.
<img width="671" height="367" alt="image" src="https://github.com/user-attachments/assets/bc2baaf1-14cc-4af3-a021-3d32ba6f44fa" />
useEffect (Gestión del Modal): Este bloque administra el comportamiento del modal, 
permitiendo cerrarlo al presionar la tecla Escape, bloqueando el desplazamiento de la página mientras está abierto y limpiando automáticamente los 
eventos y estilos cuando el
modal se cierra o el componente se desmonta.
<img width="652" height="293" alt="image" src="https://github.com/user-attachments/assets/7eb494e5-3b3c-4c3a-a2b8-0c8b71d7538d" />
La aplicación mantiene una sola vista en React. Los departamentos se consultan a API Colombia al cargar la página; la búsqueda y 
los filtros se aplican en tiempo real. 
El detalle se abre en un modal y sus municipios se cargan al seleccionarlo
<img width="587" height="725" alt="image" src="https://github.com/user-attachments/assets/d2c77e73-81cb-422e-b61e-911fbcd9b438" />
 El detalle se abre en un modal y sus municipios se cargan al seleccionarlo. También se incluyeron estados de carga y error, y un control de tema 
 oscuro que conserva la preferencia.
<img width="572" height="615" alt="image" src="https://github.com/user-attachments/assets/d1e9ec87-ba76-4bd0-913d-3379450d8233" />


Lo denominé Explora Colombia

Se desarrolla con React + Vite permite explorar información de los departamentos de Colombia consumiendo datos desde la API pública API Colombia.

Descripción

Explora Colombia muestra una sola vista donde los usuarios pueden:

Consultar el listado de departamentos de Colombia.
Filtrar departamentos.
Visualizar información.
Explorar las ciudades de cada departamento.
Acceder a datos relevantes dentro de una Card expandible.


Tecnologías utilizadas
React
Vite
JavaScript (ES6+)
CSS3
API Colombia
API utilizada

Los datos son consumidos desde la API pública:

API Colombia

Plain Text
https://api-colombia.com/api/v1

Endpoints principales:

Plain Text
GET /Department
GET /Department/{id}
GET /Department/{id}/cities
Funcionalidades




Estructura del proyecto
Shell
src/
│
├── components/
│ ├── DepartmentCard.jsx
│ ├── DepartmentModal.jsx
│ ├── SearchBar.jsx
│
├── services/
│ └── api.js
│
├── App.jsx
├── main.jsx
│
└── styles/
└── app.css
Instalación y ejecución
1. Clonar el repositorio
Shell
git clone https://github.com/luisrendcn/ParcialFront
2. Ingresar al proyecto
Shell
cd explora-colombia
3. Instalar dependencias
Shell
npm install
4. Ejecutar el servidor de desarrollo
Shell
npm run dev
5. Abrir en el navegador
Plain Text
http://localhost:5173
Objetivo académico

Este proyecto fue desarrollado como parte de una evaluación de Programación Web Frontend, cuyo propósito es demostrar competencias en:

Desarrollo de interfaces con React.
Consumo de APIs REST.
Gestión de estados.
Renderizado dinámico de componentes.
Manipulación de eventos.
Diseño responsivo.
Organización modular del código.
Evidencias

Se incluyen capturas de pantalla de:

Vista principal.
Filtro de búsqueda funcionando.
Modal o Card expandida.
Visualización de ciudades.




Estudiante de Desarrollo de Software
 Universidad Católica Luis Amigó


Este proyecto fue desarrollado con fines académicos y educativos.

se sube a vercel por comodidad de ejecucion y visualizacion.
<img width="540" height="540" alt="image" src="https://github.com/user-attachments/assets/33accf80-6719-4b73-9c2e-2691f361af26" />


