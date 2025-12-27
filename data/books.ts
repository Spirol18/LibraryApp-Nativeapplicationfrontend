export interface Chapter {
    id: string;
    title: string;
    duration: string;
    audioUrl?: string; // Placeholder for now
}

export interface Book {
    id: string;
    title: string;
    author: string;
    coverColor: string; // Tailwnd class for placeholder cover
    description: string;
    chapters: Chapter[];
}

export const BOOKS: Book[] = [
    {
        id: '1',
        title: 'Samayako Rekhachitra',
        author: 'Harihar Khanal',
        coverColor: 'bg-primary-500',
        description: 'Samayako Rekhachitra by Harihar Khanal is a reflective collection that sketches vivid portraits of time, society, and human experience. Through thoughtful observations and subtle commentary, the book captures changing social realities, personal memories, and cultural moments, encouraging readers to reflect on the past and present.',
        chapters: [
            { id: '101', title: 'Chapter 1: Aakhijhyal', duration: '10:05' },
            { id: '102', title: 'Chapter 2: Aama', duration: '15:20' },
            { id: '103', title: 'Chapter 3: Dhago Chudiyeko Changa', duration: '12:45' },
            { id: '104', title: 'Chapter 4: Kamalko Kopila ra Hrinshak Aakha', duration: '18:10' },
            { id: '105', title: 'Chapter 5: Naya Goreto', duration: '18:10' },
            { id: '106', title: 'Chapter 6: Daraar', duration: '18:10' },
            { id: '108', title: 'Chapter 7: Naya Jiwanko Khojima', duration: '18:10' },
            { id: '109', title: 'Chapter 8: Bhok ra Adhyaro Galli', duration: '18:10' },
            { id: '110', title: 'Chapter 9: Khula Aakashmuni', duration: '18:10' },
            { id: '111', title: 'Chapter 10: Jhulke Ghaam', duration: '18:10' },
            { id: '112', title: 'Chapter 11: Naya Sansarma', duration: '18:10' },
            { id: '113', title: 'Chapter 12: Gyansarobar', duration: '18:10' },
            { id: '113', title: 'Chapter 13: Kuhiro Ko Kaag', duration: '18:10' },
            { id: '113', title: 'Chapter 14: Parewa ra Baaj ', duration: '18:10' },
            { id: '113', title: 'Chapter 15: Unmukti Ujyalotira', duration: '18:10' },
            { id: '113', title: 'Chapter 16: Astitwako Khoji', duration: '18:10' },
            { id: '113', title: 'Chapter 17: Machho ra Dhadiya', duration: '18:10' },
            { id: '113', title: 'Chapter 18: Samayako Rekhachitra', duration: '18:10' },
        ]
    },
    {
        id: '2',
        title: 'Seto Dharti',
        author: 'Amar Neupane',
        coverColor: 'bg-secondary-500',
        description: 'A heart-touching story of a child widow, portraying the social stigma and the life of women in rural Nepal.',
        chapters: [
            { id: '201', title: 'Chapter 1', duration: '20:00' },
            { id: '202', title: 'Chapter 2', duration: '22:15' },
            { id: '203', title: 'Chapter 3', duration: '19:30' },
        ]
    },
    {
        id: '3',
        title: 'Karnali Blues',
        author: 'Buddhisagar',
        coverColor: 'bg-tertiary-500',
        description: 'A novel about a father-son relationship, set in the backdrop of the Karnali region.',
        chapters: [
            { id: '301', title: 'Part 1', duration: '25:00' },
            { id: '302', title: 'Part 2', duration: '28:45' },
        ]
    },
    {
        id: '4',
        title: 'Palpasa Cafe',
        author: 'Narayan Wagle',
        coverColor: 'bg-error-500',
        description: 'A story of an artist set during the Nepalese Civil War.',
        chapters: [
            { id: '401', title: 'Chapter 1', duration: '14:00' },
            { id: '402', title: 'Chapter 2', duration: '16:30' },
        ]
    },
];
