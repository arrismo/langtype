export interface Prompt {
  id: number;
  english: string;
  spanish: string;
  // Add other languages here as needed, e.g., french: string;
}

export const samplePrompts: Prompt[] = [
  {
    id: 1,
    english: "The quick brown fox jumps over the lazy dog. It shows great skill and speed as it moves through the thick forest with ease.",
    spanish: "El zorro rapido y marron salta sobre el perro flojo. Se mueve muy bien y rapido por el bosque.",
  },
  {
    id: 2,
    english: "In the middle of the busy city, with its tall buildings and noisy streets, many different people meet each other every day.",
    spanish: "En el centro de la ciudad con mucho movimiento, con edificios altos y calles ocupadas, mucha gente diferente se ve cada dia.",
  },
  {
    id: 3,
    english: "To be good at programming, you need to know about tech, but also be creative, solve problems, and think in a clear and ordered way about hard problems.",
    spanish: "Para programar bien, necesitas saber de tecnologia, ser creativo, resolver problemas y pensar de forma clara sobre cosas dificiles.",
  },
  {
    id: 4,
    english: "When the sun went down, making the sky orange and pink, the old castle stood quietly, having seen many years of history and secret stories.",
    spanish: "Cuando el sol bajo, el cielo se puso naranja y rosa. El castillo viejo estaba alli, callado, viendo pasar la historia y sus secretos.",
  },
  {
    id: 5,
    english: "New technology has changed how we talk, work, and live. This has made new chances and new problems for everyone.",
    spanish: "La nueva tecnologia ha cambiado como hablamos, trabajamos y vivimos. Esto ha creado nuevas oportunidades y problemas para todos.",
  },
  {
    id: 6,
    english: "A long journey starts with one step, but you have to keep going to do great things.",
    spanish: "Un viaje largo empieza con un paso. Pero tienes que seguir para lograr grandes cosas.",
  },
  {
    id: 7,
    english: "Deep in the ocean, where there is little sun, strange animals have changed in special ways to live in a very tough place.",
    spanish: "En lo mas hondo del mar, con poca luz, hay animales raros que han cambiado para vivir en un lugar muy dificil.",
  },
  {
    id: 8,
    english: "The human brain has billions of connected cells. It is one of the hardest things to understand in the universe.",
    spanish: "El cerebro de las personas tiene miles de millones de celulas conectadas. Es una de las cosas mas dificiles de entender del universo.",
  },
  {
    id: 9,
    english: "In the past, great societies grew and then ended. Each one left something behind that still affects our world today.",
    spanish: "En el pasado, grandes pueblos crecieron y cayeron. Cada uno dejo algo que todavia cambia nuestro mundo.",
  },
  {
    id: 10,
    english: "Exploring space shows that people are very curious and always want to see what more we can do.",
    spanish: "Explorar el espacio muestra que la gente es muy curiosa y siempre quiere hacer mas cosas.",
  },
  {
    id: 11,
    english: "In the quiet time before sunrise, the world feels still. There is a special feeling in the air that helps you think and be creative.",
    spanish: "En el silencio antes de que salga el sol, el mundo esta quieto. Hay algo especial en el aire que te ayuda a pensar y crear.",
  },
  {
    id: 12,
    english: "The way supply and demand work together is the base of today's economy. It affects big markets and what people choose to buy.",
    spanish: "Como funcionan la oferta y la demanda es la base de la economia de hoy. Afecta a los mercados grandes y a lo que la gente compra.",
  },
  {
    id: 13,
    english: "As computers get smarter, we have to ask big questions about jobs, privacy, and what it means to be smart.",
    spanish: "Mientras las computadoras se hacen mas listas, hay preguntas importantes sobre el trabajo, la privacidad y que significa ser listo.",
  },
  {
    id: 14,
    english: "Books from around the world show us different cultures, times in history, and ways of thinking. This helps us understand life better.",
    spanish: "Los libros de todo el mundo nos ensenan sobre otras culturas, tiempos pasados y formas de pensar. Esto nos ayuda a entender mejor la vida.",
  },
  {
    id: 15,
    english: "Climate change is a very big problem today. All countries need to work together and find new answers to make sure we have a good future.",
    spanish: "El cambio del clima es un problema muy grande ahora. Todos los paises deben trabajar juntos y buscar nuevas ideas para tener un buen futuro.",
  }
];

// You can define a type for your languages if you haven't already
export type Language = "english" | "spanish"; // Add other supported languages
