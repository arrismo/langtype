export interface Prompt {
  id: number;
  english: string;
  spanish: string;
}

export type Language = "english" | "spanish";

export const easyPrompts: Prompt[] = [
  {
    id: 1,
    english: "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen",
    spanish: "uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince"
  },
  {
    id: 2,
    english: "Monday Tuesday Wednesday Thursday Friday Saturday Sunday week month year today tomorrow morning night",
    spanish: "lunes martes miercoles jueves viernes sabado domingo semana mes año hoy mañana mañana noche"
  },
  {
    id: 3,
    english: "red blue green yellow orange purple black white brown gray dark light color paint rainbow",
    spanish: "rojo azul verde amarillo naranja morado negro blanco marrón gris oscuro claro color pintura arcoíris"
  },
  {
    id: 4,
    english: "dog cat bird fish rabbit horse cow chicken pig mouse animal pet farm zoo wild",
    spanish: "perro gato pajaro pez conejo caballo vaca pollo cerdo ratón animal mascota granja zoológico salvaje"
  },
  {
    id: 5,
    english: "apple banana orange grape lemon strawberry peach pear mango fruit sweet juice fresh eat",
    spanish: "manzana platano naranja uva limón fresa melocotón pera mango fruta dulce jugo fresco comer"
  },
  {
    id: 6,
    english: "head eye nose mouth ear hand foot leg arm body face hair finger toe heart",
    spanish: "cabeza ojo nariz boca oreja mano pie pierna brazo cuerpo cara pelo dedo dedo corazón"
  },
  {
    id: 7,
    english: "hello goodbye thank you please yes no home school friend food water mother father book happy",
    spanish: "hola adiós gracias por favor sí no casa escuela amigo comida agua madre padre libro feliz"
  },
  {
    id: 8,
    english: "hot cold warm cool sun rain snow wind cloud sky weather summer winter spring fall",
    spanish: "caliente frío tibio fresco sol lluvia nieve viento nube cielo clima verano invierno primavera otoño"
  },
  {
    id: 9,
    english: "big small tall short fat thin heavy light new old young beautiful ugly good bad",
    spanish: "grande pequeño alto bajo gordo delgado pesado ligero nuevo viejo joven hermoso feo bueno malo"
  },
  {
    id: 10,
    english: "run walk jump swim fly eat drink sleep work play study read write speak listen",
    spanish: "correr caminar saltar nadar volar comer beber dormir trabajar jugar estudiar leer escribir hablar escuchar"
  },
  {
    id: 11,
    english: "bread cheese meat fish egg milk coffee tea sugar salt rice soup dinner lunch breakfast",
    spanish: "pan queso carne pescado huevo leche cafe te azúcar sal arroz sopa cena almuerzo desayuno"
  },
  {
    id: 12,
    english: "shirt pants shoes socks hat dress coat jacket sweater skirt clothes wear fashion style color",
    spanish: "camisa pantalón zapatos calcetines sombrero vestido abrigo chaqueta sueter falda ropa vestir moda estilo color"
  },
  {
    id: 13,
    english: "car bus train plane bike boat street road bridge station ticket travel trip map guide",
    spanish: "carro autobús tren avión bicicleta barco calle carretera puente estación boleto viajar viaje mapa guía"
  },
  {
    id: 14,
    english: "doctor nurse hospital sick pain medicine health healthy exercise rest sleep tired strong weak",
    spanish: "medico enfermera hospital enfermo dolor medicina salud saludable ejercicio descanso dormir cansado fuerte debil"
  },
  {
    id: 15,
    english: "pencil paper desk chair table door window wall floor room house building office school work",
    spanish: "lapiz papel escritorio silla mesa puerta ventana pared piso habitación casa edificio oficina escuela trabajo"
  }
];

export const hardPrompts: Prompt[] = [
  {
    id: 1,
    english: "The quick brown fox jumps over the lazy dog",
    spanish: "El zorro marrón rapido salta sobre el perro perezoso"
  },
  {
    id: 2,
    english: "I need to practice my Spanish more often",
    spanish: "Necesito practicar mi español con mas frecuencia"
  },
  {
    id: 3,
    english: "The coffee shop on the corner has great pastries",
    spanish: "La cafetería de la esquina tiene pasteles excelentes"
  },
  {
    id: 4,
    english: "My brother's cat likes to sleep in the sun",
    spanish: "Al gato de mi hermano le gusta dormir al sol"
  },
  {
    id: 5,
    english: "The library closes at nine o'clock tonight",
    spanish: "La biblioteca cierra a las nueve esta noche"
  },
  {
    id: 6,
    english: "I forgot my umbrella and now it's raining",
    spanish: "Olvide mi paraguas y ahora esta lloviendo"
  },
  {
    id: 7,
    english: "She always drinks coffee with milk in the morning",
    spanish: "Ella siempre toma cafe con leche por la mañana"
  },
  {
    id: 8,
    english: "The museum has a new art exhibition this week",
    spanish: "El museo tiene una nueva exposición de arte esta semana"
  },
  {
    id: 9,
    english: "My favorite restaurant is closed on Mondays",
    spanish: "Mi restaurante favorito esta cerrado los lunes"
  },
  {
    id: 10,
    english: "The train station is ten minutes from here",
    spanish: "La estación de tren esta a diez minutos de aquí"
  },
  {
    id: 11,
    english: "I need to buy new shoes for the party",
    spanish: "Necesito comprar zapatos nuevos para la fiesta"
  },
  {
    id: 12,
    english: "The movie starts at seven thirty tonight",
    spanish: "La película empieza a las siete y media esta noche"
  },
  {
    id: 13,
    english: "Can you help me find my lost keys?",
    spanish: "¿Puedes ayudarme a encontrar mis llaves perdidas?"
  },
  {
    id: 14,
    english: "The weather is perfect for a picnic today",
    spanish: "El clima es perfecto para un picnic hoy"
  },
  {
    id: 15,
    english: "I like to read books in the park",
    spanish: "Me gusta leer libros en el parque"
  }
]; 
