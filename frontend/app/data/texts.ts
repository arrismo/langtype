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
    spanish: "El veloz murciélago hindú comía feliz cardillo y kiwi.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 2,
    english: "Practice makes perfect, especially in typing.",
    spanish: "La práctica hace al maestro, especialmente al teclear.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 3,
    english: "Hello world, this is a typing test for speed and accuracy.",
    spanish: "Hola mundo, esta es una prueba de mecanografía para velocidad y precisión.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 4,
    english: "Coding is fun and challenging at the same time.",
    spanish: "Programar es divertido y desafiante al mismo tiempo.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 5,
    english: "Keep calm and type on, improve your skills daily.",
    spanish: "Mantén la calma y sigue tecleando, mejora tus habilidades a diario.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 6,
    english: "A journey of a thousand miles begins with a single step.",
    spanish: "Un viaje de mil millas comienza con un solo paso.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 7,
    english: "The only way to do great work is to love what you do.",
    spanish: "La única forma de hacer un gran trabajo es amar lo que haces.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 8,
    english: "Simplicity is the ultimate sophistication.",
    spanish: "La simplicidad es la máxima sofisticación.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 9,
    english: "Innovation distinguishes between a leader and a follower.",
    spanish: "La innovación distingue entre un líder y un seguidor.", // NOTE: Ensure this is an accurate translation
  },
  {
    id: 10,
    english: "The future belongs to those who believe in the beauty of their dreams.",
    spanish: "El futuro pertenece a aquellos que creen en la belleza de sus sueños.", // NOTE: Ensure this is an accurate translation
  },
  // Add more prompts with their translations here
];

// You can define a type for your languages if you haven't already
export type Language = "english" | "spanish"; // Add other supported languages

