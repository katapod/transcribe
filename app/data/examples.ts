export interface Example {
  name: string;
  src: string;
  text: string;
}

export const EXAMPLES: Array<Example> = [
  {
    name: 'Open AI Example - Fast talking',
    src: '/micro-machines.wav',
    text: `This is the Micro Machine Man presenting the most midget miniature motorcade of Micro Machines. Each one has dramatic details, terrific trim, precision paint jobs, plus incredible Micro Machine Pocket Play Sets. There's a police station, fire station, restaurant, service station, and more. Perfect pocket portables to take any place. And there are many miniature play sets to play with, and each one comes with its own special edition Micro Machine vehicle and fun, fantastic features that miraculously move. Raise the boatlift at the airport marina. Man the gun turret at the army base. Clean your car at the car wash. Raise the toll bridge. And these play sets fit together to form a Micro Machine world. Micro Machine Pocket Play Sets, so tremendously tiny, so perfectly precise, so dazzlingly detailed, you'll want to pocket them all. Micro Machines are Micro Machine Pocket Play Sets sold separately from Galoob. The smaller they are, the better they are.`,
  },
  {
    name: 'Open AI Example - K-Pop',
    src: '/younha.wav',
    text: `While darkness was my everything
  I ran so hard that I ran out of breath
  Never say time's up
  Like the end of the boundary
  Because my end is not the end`,
  },
  {
    name: 'Open AI Example - French',
    src: '/multilingual.wav',
    text: `Whisper is an automatic speech recognition system based on 680,000 hours of multilingual and multitasking data collected on the Internet. We establish that the use of such a number of data is such a diversity and the reason why our system is able to understand many accents, regardless of the background noise, to understand technical vocabulary and to successfully translate from various languages into English. We distribute as a free software the source code for our models and for the inference, so that it can serve as a starting point to build useful applications and to help progress research in speech processing.`,
  },
  {
    name: 'Open AI Example - Accent',
    src: '/scottish-accent.wav',
    text: `One of the most famous landmarks on the Borders, it''s three hills and the myth is that Merlin, the magician, split one hill into three and left the two hills at the back of us which you can see. The weather's never good though, we stay on the Borders with the mists on the Yildens, we never get the good weather and as you can see today there''s no sunshine, it''s a typical Scottish Borders day.



  Note: Whisper transcribed “Eildons” as “Yildens”`,
  },
];
