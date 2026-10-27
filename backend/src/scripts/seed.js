const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const Admin = require('../modules/auth/auth.model');
const HomeHero = require('../modules/home/home.hero.model');
const HomeAbout = require('../modules/home/home.about.model');
const HomeStats = require('../modules/home/home.stats.model');
const HomeVideo = require('../modules/home/home.video.model');
const AboutHero = require('../modules/about/about.hero.model');
const AboutIntroduction = require('../modules/about/about.introduction.model');
const AboutStatistic = require('../modules/about/about.statistics.model');
const Timeline = require('../modules/about/about.timeline.model');
const Leader = require('../modules/about/about.leader.model');
const Value = require('../modules/about/about.value.model');
const Society = require('../modules/societies/society.model');
const CampusInformation = require('../modules/campus/campus.model');
const Announcement = require('../modules/announcements/announcement.model');
const Event = require('../modules/announcements/event.model');
const Magazine = require('../modules/magazines/magazine.model');
const Project = require('../modules/projects/project.model');
const ContactInformation = require('../modules/contact/contact.information.model');
const AcademicProgram = require('../modules/contact/academic.program.model');

dotenv.config({ path: './.env' });

/*
|--------------------------------------------------------------------------
| SOCIETIES
|--------------------------------------------------------------------------
| Each society has an explicit unique slug.
|--------------------------------------------------------------------------
*/

const societies = [
  {
    name: 'Alumni Association Club',
    slug: 'alumni-association-club',
    tagline: 'Connecting UCP alumni and building lifelong relationships.',
    tag: 'Alumni',
    icon: '🎓',
    logo: '',
    description:
      'The Alumni Association Club connects graduates of UCP and provides opportunities for networking, mentorship, collaboration, and community engagement.',
    mission:
      'To build a strong and active alumni community that supports professional growth and contributes to the university community.',
    vision:
      'A connected and engaged alumni network contributing to the growth of UCP and society.',
    motto: 'Connected for a lifetime',
    objectives: [
      'Build a strong alumni network',
      'Create professional networking opportunities',
      'Support current students through mentorship',
      'Encourage alumni participation in university activities',
    ],
    activities: [
      'Alumni networking events',
      'Mentorship programs',
      'Career sessions',
      'Community engagement activities',
    ],
    contact: {
      email: 'alumni@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Dramatic Club',
    slug: 'dramatic-club',
    tagline: 'Creativity, performance and expression.',
    tag: 'Arts',
    icon: '🎭',
    logo: '',
    description:
      'The Dramatic Club provides students with a platform to explore theatre, acting, storytelling and performing arts.',
    mission:
      'To encourage creativity and confidence through theatre and performing arts.',
    vision:
      'A vibrant student community where creativity and artistic expression flourish.',
    motto: 'Perform. Express. Inspire.',
    objectives: [
      'Develop acting and performance skills',
      'Promote theatre and performing arts',
      'Provide students with creative opportunities',
      'Build confidence through performance',
    ],
    activities: [
      'Theatre performances',
      'Drama workshops',
      'Stage productions',
      'Acting competitions',
    ],
    contact: {
      email: 'dramatic@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Blood Donation Society',
    slug: 'blood-donation-society',
    tagline: 'Every drop can save a life.',
    tag: 'Community Service',
    icon: '🩸',
    logo: '',
    description:
      'The Blood Donation Society promotes voluntary blood donation and awareness among students and the wider community.',
    mission:
      'To encourage safe and voluntary blood donation and help people in need.',
    vision:
      'A community where no patient suffers because of a shortage of blood.',
    motto: 'Donate blood. Save lives.',
    objectives: [
      'Promote voluntary blood donation',
      'Create awareness about blood donation',
      'Organize blood donation drives',
      'Support patients and hospitals in need',
    ],
    activities: [
      'Blood donation drives',
      'Awareness campaigns',
      'Donor registration',
      'Community welfare activities',
    ],
    contact: {
      email: 'blooddonation@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Sports and Hiking Club',
    slug: 'sports-and-hiking-club',
    tagline: 'Stay active. Explore more.',
    tag: 'Sports',
    icon: '🏃',
    logo: '',
    description:
      'The Sports and Hiking Club encourages students to participate in sports, outdoor activities, hiking and healthy recreational activities.',
    mission:
      'To promote physical fitness, teamwork and an active lifestyle among students.',
    vision:
      'A healthy and energetic student community engaged in sports and outdoor activities.',
    motto: 'Play. Explore. Thrive.',
    objectives: [
      'Promote physical fitness',
      'Encourage participation in sports',
      'Organize hiking and outdoor activities',
      'Develop teamwork and leadership',
    ],
    activities: [
      'Sports tournaments',
      'Hiking trips',
      'Fitness activities',
      'Outdoor recreational events',
    ],
    contact: {
      email: 'sports@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Gaming Club',
    slug: 'gaming-club',
    tagline: 'Play, compete and connect.',
    tag: 'Gaming',
    icon: '🎮',
    logo: '',
    description:
      'The Gaming Club provides students with a community for competitive and recreational gaming.',
    mission:
      'To create a positive gaming community that encourages competition, teamwork and creativity.',
    vision:
      'A student gaming community recognized for healthy competition and innovation.',
    motto: 'Game. Compete. Connect.',
    objectives: [
      'Promote competitive gaming',
      'Develop teamwork and strategic thinking',
      'Organize gaming competitions',
      'Build a community of gaming enthusiasts',
    ],
    activities: [
      'Gaming tournaments',
      'Esports competitions',
      'Gaming sessions',
      'Team competitions',
    ],
    contact: {
      email: 'gaming@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'CSR Club',
    slug: 'csr-club',
    tagline: 'Creating positive impact through action.',
    tag: 'CSR',
    icon: '🤝',
    logo: '',
    description:
      'The CSR Club engages students in community service, social responsibility and welfare initiatives.',
    mission:
      'To encourage students to contribute positively to society through meaningful community service.',
    vision:
      'A socially responsible student community creating sustainable positive change.',
    motto: 'Serve. Inspire. Impact.',
    objectives: [
      'Promote social responsibility',
      'Support underprivileged communities',
      'Organize welfare initiatives',
      'Encourage student volunteering',
    ],
    activities: [
      'Community service',
      'Charity drives',
      'Awareness campaigns',
      'Volunteer activities',
    ],
    contact: {
      email: 'csr@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Robotics and Automation Society',
    slug: 'robotics-and-automation-society',
    tagline: 'Build the future with technology.',
    tag: 'Technology',
    icon: '🤖',
    logo: '',
    description:
      'The Robotics and Automation Society brings together students interested in robotics, automation, engineering and emerging technologies.',
    mission:
      'To develop technical skills and encourage innovation through robotics and automation.',
    vision:
      'A community of innovators developing solutions for the future.',
    motto: 'Imagine. Build. Automate.',
    objectives: [
      'Promote robotics and automation',
      'Develop practical engineering skills',
      'Encourage innovation and research',
      'Participate in technical competitions',
    ],
    activities: [
      'Robotics projects',
      'Technical workshops',
      'Competitions',
      'Automation experiments',
    ],
    contact: {
      email: 'robotics@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Literary Society',
    slug: 'literary-society',
    tagline: 'Words that inspire ideas.',
    tag: 'Literature',
    icon: '📚',
    logo: '',
    description:
      'The Literary Society encourages reading, writing, poetry, creative expression and intellectual discussion.',
    mission:
      'To promote literary culture and creative expression among students.',
    vision:
      'A community of readers and writers inspired by ideas and creativity.',
    motto: 'Read. Write. Inspire.',
    objectives: [
      'Promote reading and writing',
      'Encourage creative expression',
      'Develop communication skills',
      'Provide platforms for literary talent',
    ],
    activities: [
      'Poetry sessions',
      'Creative writing',
      'Debates',
      'Literary competitions',
    ],
    contact: {
      email: 'literary@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Scientific Society',
    slug: 'scientific-society',
    tagline: 'Explore. Discover. Innovate.',
    tag: 'Science',
    icon: '🔬',
    logo: '',
    description:
      'The Scientific Society promotes scientific thinking, research and innovation among students.',
    mission:
      'To develop scientific curiosity and encourage research-based learning.',
    vision:
      'A student community driven by scientific discovery and innovation.',
    motto: 'Question. Discover. Innovate.',
    objectives: [
      'Promote scientific thinking',
      'Encourage research',
      'Organize scientific events',
      'Develop problem-solving skills',
    ],
    activities: [
      'Science exhibitions',
      'Research sessions',
      'Scientific workshops',
      'Innovation competitions',
    ],
    contact: {
      email: 'scientific@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'UCP Research World',
    slug: 'ucp-research-world',
    tagline: 'Research beyond boundaries.',
    tag: 'Research',
    icon: '🌐',
    logo: '',
    description:
      'UCP Research World provides a platform for students and researchers to collaborate, explore ideas and promote research.',
    mission:
      'To foster research culture and collaboration within the university community.',
    vision:
      'A research-driven community contributing meaningful knowledge and innovation.',
    motto: 'Research. Collaborate. Transform.',
    objectives: [
      'Promote research culture',
      'Encourage interdisciplinary collaboration',
      'Support student researchers',
      'Share research knowledge',
    ],
    activities: [
      'Research seminars',
      'Research projects',
      'Academic discussions',
      'Research collaboration',
    ],
    contact: {
      email: 'research@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'Academic Community',
    slug: 'academic-community',
    tagline: 'Learn together. Grow together.',
    tag: 'Academic',
    icon: '🎓',
    logo: '',
    description:
      'The Academic Community connects students around learning, knowledge sharing and academic development.',
    mission:
      'To create a collaborative environment that supports academic excellence.',
    vision:
      'A collaborative academic community where students learn and grow together.',
    motto: 'Learn. Collaborate. Excel.',
    objectives: [
      'Promote academic collaboration',
      'Support peer learning',
      'Encourage knowledge sharing',
      'Develop academic skills',
    ],
    activities: [
      'Study sessions',
      'Academic workshops',
      'Peer mentoring',
      'Knowledge-sharing events',
    ],
    contact: {
      email: 'academic@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },

  {
    name: 'DevForge Society',
    slug: 'devforge-society',
    tagline: 'Build. Code. Innovate.',
    tag: 'Technology',
    icon: '💻',
    logo: '',
    description:
      'DevForge Society brings together students interested in software development, programming and emerging technologies.',
    mission:
      'To develop practical software engineering skills and foster a culture of innovation.',
    vision:
      'A community of developers building meaningful technology solutions.',
    motto: 'Build. Code. Innovate.',
    objectives: [
      'Promote software development',
      'Develop programming skills',
      'Encourage technology innovation',
      'Build real-world projects',
    ],
    activities: [
      'Coding workshops',
      'Hackathons',
      'Software projects',
      'Programming competitions',
    ],
    contact: {
      email: 'devforge@ucp.edu.pk',
      phone: '',
      office: '',
    },
    team: [],
    teamMembers: [],
  },
];

/*
|--------------------------------------------------------------------------
| SEED
|--------------------------------------------------------------------------
*/

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');

    await Promise.all([
      Admin.deleteMany(),
      HomeHero.deleteMany(),
      HomeAbout.deleteMany(),
      HomeStats.deleteMany(),
      HomeVideo.deleteMany(),
      AboutHero.deleteMany(),
      AboutIntroduction.deleteMany(),
      AboutStatistic.deleteMany(),
      Timeline.deleteMany(),
      Leader.deleteMany(),
      Value.deleteMany(),
      Society.deleteMany(),
      CampusInformation.deleteMany(),
      Announcement.deleteMany(),
      Event.deleteMany(),
      Magazine.deleteMany(),
      Project.deleteMany(),
      ContactInformation.deleteMany(),
      AcademicProgram.deleteMany(),
    ]);

    console.log('Data cleared.');

    /*
     * Admin
     */
    await Admin.create({
      fullName: 'Super Admin',
      email: 'admin@ucp.com',
      password: 'admin123',
      role: 'super-admin',
    });

    console.log('Admin seeded.');

    /*
     * Home Hero
     */
    await HomeHero.create({
      badge: 'Admissions Fall 2026',
      title: 'Welcome to UCP',
      description: 'Your future starts here.',
      studentsJoined: 1000,
      rating: 4.8,
      heroImage:
        'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    });

    console.log('Home data seeded.');

    /*
     * Societies
     *
     * IMPORTANT:
     * Use the native MongoDB collection so the explicit slug values
     * are inserted exactly as provided.
     */
    await Society.collection.insertMany(societies);

    console.log(`${societies.length} societies seeded.`);

    console.log('');
    console.log('======================================');
    console.log('DATABASE SEED COMPLETED SUCCESSFULLY');
    console.log('======================================');
    console.log(`Societies inserted: ${societies.length}`);
    console.log('Admin email: admin@ucp.com');
    console.log('Admin password: admin123');
    console.log('======================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('======================================');
    console.error('DATABASE SEED FAILED');
    console.error('======================================');
    console.error(error);
    console.error('');

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Failed to close MongoDB connection:', closeError);
    }

    process.exit(1);
  }
};

seedData();