export interface Prompt {
  id: number;
  english: string;
  spanish: string;
  // Add other languages here as needed, e.g., french: string;
}

export const samplePrompts: Prompt[] = [
  {
    id: 1,
    english: "The quick brown fox jumps over the lazy dog.",
    spanish: "El veloz murciélago hindú comía feliz cardillo y kiwi.",
  },
  {
    id: 2,
    english: "Practice makes perfect.",
    spanish: "La práctica hace al maestro.",
  },
  {
    id: 3,
    english: "Hello world, a typing test.",
    spanish: "Hola mundo, una prueba de tecleo.",
  },
  {
    id: 4,
    english: "Coding is fun and challenging.",
    spanish: "Programar es divertido y desafiante.",
  },
  {
    id: 5,
    english: "Keep calm and type on.",
    spanish: "Mantén la calma y teclea.",
  },
  {
    id: 6,
    english: "A journey begins with a step.",
    spanish: "Un viaje empieza con un paso.",
  },
  {
    id: 7,
    english: "Love what you do.",
    spanish: "Ama lo que haces.",
  },
  {
    id: 8,
    english: "Simplicity is the ultimate sophistication.",
    spanish: "La simplicidad es la máxima sofisticación.",
  },
  {
    id: 9,
    english: "To be or not to be, that is the question.",
    spanish: "Ser o no ser, esa es la cuestión.",
  },
  {
    id: 10,
    english: "Believe in your dreams.",
    spanish: "Cree en tus sueños.",
  },
  // Add more prompts with their translations here
];

// You can define a type for your languages if you haven't already
export type Language = "english" | "spanish"; // Add other supported languages
