import { Memory, PolaroidPhoto } from './types';

export const CORRECT_PIN = "1024";

export const TIMELINE_DATA: Memory[] = [
  {
    id: '1',
    date: 'Feb 14, 2021',
    title: 'Coffee at The Nook',
    description: 'I was so nervous I spilled my latte! ☕️ You pretended not to notice, but I saw that smile.',
    image: 'https://picsum.photos/id/425/600/800', // Coffee cup
    rotation: 2,
    type: 'left',
  },
  {
    id: '2',
    date: 'July 2021',
    title: 'Our First Trip',
    description: '"The ocean air, the late night talks, and getting completely lost trying to find the hotel."',
    location: 'Maui',
    image: 'https://picsum.photos/id/106/600/800', // Beach
    rotation: -2,
    type: 'right',
  },
  {
    id: '3',
    date: 'Dec 2022',
    title: 'First Holiday Together',
    description: 'We tried to build a gingerbread house. It collapsed immediately. Still tasted good though.',
    image: 'https://picsum.photos/id/360/600/800', // Flowers/Holiday vibe
    rotation: 1,
    type: 'left',
  }
];

export const POLAROID_DATA: PolaroidPhoto[] = [
  { id: 'p1', src: 'https://picsum.photos/id/57/500/500', caption: 'Our first sunset', date: 'June 14, 2021', rotation: -6, top: 20, left: 15, zIndex: 1 },
  { id: 'p2', src: 'https://picsum.photos/id/30/500/500', caption: 'Coffee obsession', date: 'Sept 02, 2021', rotation: 4, top: 40, left: 45, zIndex: 2 },
  { id: 'p3', src: 'https://picsum.photos/id/122/500/500', caption: 'Midnight in Paris', date: 'Oct 2021', rotation: -8, top: 15, left: 70, zIndex: 3 },
  { id: 'p4', src: 'https://picsum.photos/id/91/500/500', caption: 'Silly faces :P', date: 'Dec 31, 2022', rotation: 12, top: 55, left: 20, zIndex: 4 },
  { id: 'p5', src: 'https://picsum.photos/id/234/500/500', caption: 'Moving Day!', date: 'March 15, 2023', rotation: -5, top: 60, left: 65, zIndex: 1 },
];

export const LETTER_CONTENT = `Dearest Valentine,

Do you remember the day we met? The world seemed to stop for just a second. Since then, every laugh we've shared, every quiet moment, and even our silly arguments have built a home in my heart that only you have the key to.

You make the ordinary feel like an adventure. I promise to keep making memories, laughing at your jokes (even the bad ones), and loving you more with each passing day.

Forever yours,`;
