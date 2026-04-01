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
    dateAdded: string;
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
        dateAdded: '2025-07-20',
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
        dateAdded: '2025-07-27',
        chapters: [
            { id: '201', title: 'Chapter 1: Naaso', duration: '16:29' },
            { id: '202', title: 'Chapter 2: Chimeki', duration: '06:52' },
            { id: '203', title: 'Chapter 3: Prayaschit', duration: '10:46' },
            { id: '204', title: 'Chapter 4: Papko Parinam', duration: '30:40' },
            { id: '205', title: 'Chapter 5: Bida', duration: '16:05' },
            { id: '206', title: 'Chapter 6: Paralko Aago', duration: '13:02' },
            { id: '207', title: 'Chapter 7: Abhagi', duration: '17:48' },
            { id: '208', title: 'Chapter 8: Sahid', duration: '18:39' },
            { id: '209', title: 'Chapter 9: Kartabya', duration: '15:23' },
            { id: '210', title: 'Chapter 10: Pratyagaman', duration: '21:16' },
        ]
    },
    {
        id: '3',
        title: 'Basanti',
        author: 'Diamond Shumsher Rana',
        coverColor: 'bg-tertiary-500',
        image: require('@/assets/images/Basanti.png'),
        description: 'Basanti is a historical novel by Diamond Shumsher Rana that depicts the life and times of the early Rana period in Nepal. It weaves a story of love, power, and political intrigue during a significant era of Nepalese history.',
        dateAdded: '2025-08-13',
        chapters: [
            { id: '301', title: 'Chapter 1', duration: '15:06' },
            { id: '302', title: 'Chapter 2', duration: '14:09' },
            { id: '303', title: 'Chapter 3', duration: '13:18' },
            { id: '304', title: 'Chapter 4', duration: '11:50' },
            { id: '305', title: 'Chapter 5', duration: '06:49' },
            { id: '306', title: 'Chapter 6', duration: '12:18' },
            { id: '307', title: 'Chapter 7', duration: '15:17' },
            { id: '308', title: 'Chapter 8', duration: '06:24' },
            { id: '309', title: 'Chapter 9', duration: '10:33' },
            { id: '310', title: 'Chapter 10', duration: '12:51' },
            { id: '311', title: 'Chapter 11', duration: '06:41' },
            { id: '312', title: 'Chapter 12', duration: '01:22' },
            { id: '313', title: 'Chapter 13', duration: '07:48' },
            { id: '314', title: 'Chapter 14', duration: '14:17' },
            { id: '315', title: 'Chapter 15', duration: '08:59' },
            { id: '316', title: 'Chapter 16', duration: '11:20' },
            { id: '317', title: 'Chapter 17', duration: '08:23' },
            { id: '318', title: 'Chapter 18', duration: '15:10' },
            { id: '319', title: 'Chapter 19', duration: '14:58' },
            { id: '320', title: 'Chapter 20', duration: '05:32' },
            { id: '321', title: 'Chapter 21', duration: '18:30' },
            { id: '322', title: 'Chapter 22', duration: '07:42' },
            { id: '323', title: 'Chapter 23', duration: '21:13' },
            { id: '324', title: 'Chapter 24', duration: '16:06' },
            { id: '325', title: 'Chapter 25', duration: '09:34' },
            { id: '326', title: 'Chapter 26', duration: '08:59' },

        ]
    },
    {
        id: '4',
        title: 'Khalanga Ma Hamala',
        author: 'Radha Paudel',
        coverColor: 'bg-error-500',
        image: require('@/assets/images/khalangamahamala.jpeg'),
        description: 'A story of an artist set during the Nepalese Civil War.',
        dateAdded: '2023-08-10',
        chapters: [
            { id: '401', title: 'Chapter 1', duration: '39:10' },
            { id: '402', title: 'Chapter 2', duration: '21:10' },
            { id: '403', title: 'Chapter 3', duration: '30:00' },
            { id: '404', title: 'Chapter 4', duration: '27:37' },
            { id: '405', title: 'Chapter 5', duration: '31:35' },
            { id: '406', title: 'Chapter 6', duration: '18:07' },
            { id: '407', title: 'Chapter 7', duration: '09:57' },
            { id: '408', title: 'Chapter 8', duration: '08:46' },
            { id: '409', title: 'Chapter 9', duration: '14:31' },
            { id: '410', title: 'Chapter 10', duration: '16:17' },
        ]
    },
    {
        id: '5',
        title: 'Tin Ghumti',
        author: 'Narayan Wagle',
        coverColor: 'bg-error-500',
        image: require('@/assets/images/palpasacafe.jpg'),
        description: 'A story of an artist set during the Nepalese Civil War.',
        dateAdded: '2023-08-10',
        chapters: [
            { id: '501', title: 'Chapter 1', duration: '14:00' },
            { id: '502', title: 'Chapter 2', duration: '16:30' },
        ]
    },
    {
        id: '6',
        title: 'Hari Bahadur',
        author: 'Haribansha Acharya',
        coverColor: 'bg-error-500',
        image: require('@/assets/images/haribahadur.jpg'),
        description: 'A satirical take on contemporary Nepali society and politics, exploring the character’s deceptive and clever nature.',
        dateAdded: '2023-08-10',
        chapters: [
            { id: '601', title: 'Rajako Ghar', duration: '19:25' },
            { id: '602', title: 'Pashupati Ki Jay', duration: '10:41' },
            { id: '603', title: 'Choora Ko Chooro', duration: '15:41' },
            { id: '604', title: 'Barsha Shora, Parichaya Chahi Chora', duration: '34:19' },
            { id: '605', title: 'Dekheko Hoina, Lekheko Painxa', duration: '16:58' },
            { id: '606', title: 'Shree 5 haribahadur', duration: '30:35' },
            { id: '607', title: 'Kun Sun', duration: '13:39' },
            { id: '608', title: 'Kitkit, Kitkit!', duration: '28:02' },
            { id: '609', title: 'Shere Bhaalu', duration: '03:39' },
            { id: '610', title: 'Harikrishne', duration: '15:56' },
            { id: '611', title: 'Chimeki', duration: '11:11' },
            { id: '612', title: 'Pahuna', duration: '20:53' },
            { id: '613', title: 'MaaraaSSS', duration: '21:12' },
            { id: '614', title: 'Ek ko Tin', duration: '20:37' },
            { id: '615', title: 'Yo Jeet Kasko?', duration: '19:39' },
            { id: '616', title: 'Aabui!', duration: '11:43' },
            { id: '617', title: 'Raato Gaau', duration: '18:59' },
            { id: '618', title: 'Narayan', duration: '12:30' },
            { id: '619', title: 'Kun Paisa?', duration: '11:44' },
            { id: '620', title: 'Achamma ko Janma', duration: '25:44' },
            { id: '621', title: 'Laalpurja', duration: '11:04' },
            { id: '622', title: 'Aakha Chhopi Narou Bhani Bhanna Parya Chha', duration: '23:01' },
        ]
    },
];
