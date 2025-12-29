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
    image?: any; // New field for book cover image
    description: string;
    chapters: Chapter[];
}

export const BOOKS: Book[] = [
    {
        id: '1',
        title: 'Samayako Rekhachitra',
        author: 'Harihar Khanal',
        coverColor: 'bg-primary-500',
        image: require('@/assets/images/samayako_rekhachitra.png'),
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
            { id: '114', title: 'Chapter 12: Gyansarobar', duration: '18:10' },
            { id: '115', title: 'Chapter 13: Kuhiro Ko Kaag', duration: '18:10' },
            { id: '116', title: 'Chapter 14: Parewa ra Baaj ', duration: '18:10' },
            { id: '117', title: 'Chapter 15: Unmukti Ujyalotira', duration: '18:10' },
            { id: '118', title: 'Chapter 16: Astitwako Khoji', duration: '18:10' },
            { id: '119', title: 'Chapter 17: Machho ra Dhadiya', duration: '18:10' },
            { id: '120', title: 'Chapter 18: Samayako Rekhachitra', duration: '18:10' },
        ]
    },
    {
        id: '2',
        title: 'Naaso',
        author: 'Guruprasad Mainali',
        coverColor: 'bg-secondary-500',
        image: require('@/assets/images/Naaso.png'),
        description: 'Naaso is a classic collection of short stories by Guruprasad Mainali, capturing the essence of rural Nepalese life, social values, and human emotions with simplicity and depth.',
        chapters: [
            { id: '201', title: 'Chapter 1', duration: '20:00' },
            { id: '202', title: 'Chapter 2', duration: '22:15' },
            { id: '203', title: 'Chapter 3', duration: '19:30' },
        ]
    },
    {
        id: '3',
        title: 'Basanti',
        author: 'Diamond Shumsher Rana',
        coverColor: 'bg-tertiary-500',
        image: require('@/assets/images/Basanti.png'),
        description: 'Basanti is a historical novel by Diamond Shumsher Rana that depicts the life and times of the early Rana period in Nepal. It weaves a story of love, power, and political intrigue during a significant era of Nepalese history.',
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
