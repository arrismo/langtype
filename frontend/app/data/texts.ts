export interface Prompt {
  id: number;
  english: string;
  spanish: string;
  // Add other languages here as needed, e.g., french: string;
}

export const samplePrompts: Prompt[] = [
  {
    id: 1,
    english: "The quick brown fox jumps over the lazy dog, demonstrating remarkable agility and speed as it navigates through the dense forest with effortless grace.",
    spanish: "El veloz zorro marrón salta sobre el perro perezoso, demostrando una agilidad y velocidad notables mientras se desplaza por el denso bosque con una gracia sin esfuerzo.",
  },
  {
    id: 2,
    english: "In the heart of the bustling city, where skyscrapers touch the clouds and the streets hum with constant activity, people from all walks of life cross paths every single day.",
    spanish: "En el corazón de la bulliciosa ciudad, donde los rascacielos tocan las nubes y las calles zumban con actividad constante, personas de todos los ámbitos de la vida se cruzan todos los días.",
  },
  {
    id: 3,
    english: "The art of programming requires not only technical knowledge but also creativity, problem-solving skills, and the ability to think logically and systematically about complex problems.",
    spanish: "El arte de la programación requiere no solo conocimiento técnico, sino también creatividad, habilidades para resolver problemas y la capacidad de pensar lógica y sistemáticamente sobre problemas complejos.",
  },
  {
    id: 4,
    english: "As the sun dipped below the horizon, painting the sky in brilliant shades of orange and pink, the ancient castle stood as a silent witness to centuries of history and untold stories.",
    spanish: "Mientras el sol se ocultaba en el horizonte, pintando el cielo en brillantes tonos de naranja y rosa, el antiguo castillo se erigía como testigo silencioso de siglos de historia e historias no contadas.",
  },
  {
    id: 5,
    english: "Modern technology has transformed the way we communicate, work, and live our daily lives, creating both unprecedented opportunities and new challenges for society as a whole.",
    spanish: "La tecnología moderna ha transformado la forma en que nos comunicamos, trabajamos y vivimos nuestra vida diaria, creando oportunidades sin precedentes y nuevos desafíos para la sociedad en su conjunto.",
  },
  {
    id: 6,
    english: "The journey of a thousand miles begins with a single step, but it's the perseverance to continue that ultimately leads to the achievement of great accomplishments.",
    spanish: "El viaje de mil millas comienza con un solo paso, pero es la perseverancia para continuar lo que en última instancia conduce al logro de grandes hazañas.",
  },
  {
    id: 7,
    english: "In the depths of the ocean, where sunlight barely reaches, mysterious creatures have evolved unique adaptations to survive in one of Earth's most extreme environments.",
    spanish: "En las profundidades del océano, donde apenas llega la luz del sol, criaturas misteriosas han desarrollado adaptaciones únicas para sobrevivir en uno de los entornos más extremos de la Tierra.",
  },
  {
    id: 8,
    english: "The human brain, with its billions of interconnected neurons, remains one of the most complex and least understood structures in the known universe.",
    spanish: "El cerebro humano, con sus miles de millones de neuronas interconectadas, sigue siendo una de las estructuras más complejas y menos comprendidas del universo conocido.",
  },
  {
    id: 9,
    english: "Throughout history, great civilizations have risen and fallen, each leaving behind a legacy that continues to shape our modern world in countless ways.",
    spanish: "A lo largo de la historia, grandes civilizaciones han surgido y caído, cada una dejando un legado que continúa dando forma a nuestro mundo moderno de innumerables maneras.",
  },
  {
    id: 10,
    english: "The exploration of space represents humanity's insatiable curiosity and our enduring desire to push the boundaries of what is possible.",
    spanish: "La exploración del espacio representa la insaciable curiosidad de la humanidad y nuestro deseo perdurable de ampliar los límites de lo que es posible.",
  },
  {
    id: 11,
    english: "In the quiet moments before dawn, when the world seems to hold its breath, there's a special kind of magic in the air that inspires creativity and reflection.",
    spanish: "En los momentos tranquilos antes del amanecer, cuando el mundo parece contener la respiración, hay un tipo especial de magia en el aire que inspira creatividad y reflexión.",
  },
  {
    id: 12,
    english: "The intricate dance of supply and demand forms the foundation of modern economics, influencing everything from global markets to individual purchasing decisions.",
    spanish: "La intrincada danza de la oferta y la demanda forma la base de la economía moderna, influyendo en todo, desde los mercados globales hasta las decisiones de compra individuales.",
  },
  {
    id: 13,
    english: "As artificial intelligence continues to advance, it raises important ethical questions about the future of work, privacy, and the very nature of human intelligence.",
    spanish: "A medida que la inteligencia artificial continúa avanzando, plantea importantes preguntas éticas sobre el futuro del trabajo, la privacidad y la propia naturaleza de la inteligencia humana.",
  },
  {
    id: 14,
    english: "The rich tapestry of world literature offers us windows into different cultures, historical periods, and ways of thinking that expand our understanding of the human experience.",
    spanish: "El rico tapiz de la literatura mundial nos ofrece ventanas a diferentes culturas, períodos históricos y formas de pensar que amplían nuestra comprensión de la experiencia humana.",
  },
  {
    id: 15,
    english: "Climate change represents one of the most significant challenges of our time, requiring global cooperation and innovative solutions to ensure a sustainable future for generations to come.",
    spanish: "El cambio climático representa uno de los desafíos más importantes de nuestro tiempo, que requiere cooperación global y soluciones innovadoras para garantizar un futuro sostenible para las generaciones venideras.",
  }
];

// You can define a type for your languages if you haven't already
export type Language = "english" | "spanish"; // Add other supported languages
