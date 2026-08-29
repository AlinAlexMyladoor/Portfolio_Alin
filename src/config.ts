export const config = {
    developer: {
        name: "Alin",
        fullName: "Alin Alex",
        title: "Backend & Full-Stack Engineer",
        description: "Backend & Full-Stack Engineer from Kerala, India. I build production-grade systems, intelligent APIs, and high-performance backends. My expertise includes Go, Python, Django, Spring Boot, PostgreSQL, Docker, and AWS. SIH'25 National Finalist."
    },
    social: {
        github: "AlinAlexMyladoor",
        email: "alinalex441@gmail.com",
        location: "Kerala, India"
    },
    about: {
        title: "About Me",
        description: "I am a Backend & Full-Stack Developer specializing in scalable web architectures, microservices, and AI integrations. With expertise across Go, Python, Java, and React, I build robust RESTful APIs, real-time data pipelines, and production-ready applications. As a Smart India Hackathon '25 National Finalist and published patent contributor, I am driven by clean code, high-reliability system design, and solving complex engineering challenges. Code is architecture, systems are poetry."
    },
    experiences: [
        {
            position: "AI Intern",
            company: "AetherHub LLP",
            period: "2026",
            description: "Conducted quality testing and dedicated research for AI-based systems to ensure performance, accuracy, and system reliability."
        },
        {
            position: "Software Development Intern",
            company: "White Matrix",
            period: "2026",
            description: "Contributed to the MOSIP integration project (VeriCred Campus), working on secure digital academic credentials and identity verification workflows."
        },
        {
            position: "Full Stack Developer Intern",
            company: "Ziuke Infotech",
            period: "2025",
            description: 'Developed "Cart Shopee", a full-stack e-commerce web application using Python and Django, featuring user authentication, product management, and shopping cart functionality.'
        },
        {
            position: "Patents & Major Achievements",
            company: "Hackathons & Government of India",
            period: "2025 - 2026",
            description: "Patent Published (Dec 2025): 'Detection Of Open-Crust Mining Activity And 3D Visualization'. National Finalist at the Smart India Hackathon (SIH) 2025 for developing MineGuard, a satellite-based illegal mining detection system. Secured 1st Prize in various Idea Pitching competitions, Project Expo, and a PowerPoint presentation competition, as well as 2nd Prize at the Synovate 2025 Ideathon."
        },
        {
            position: "Leadership & Community",
            company: "Tech Clubs & Event ExCom",
            period: "2024 - 2026",
            description: "Documentation Team Lead | IEEE WIE CCE: Managed technical documentation and reporting workflows. Event Coordinator | FOSS Club ExCom: Coordinated logistics and faculty communication for multiple campus tech events. ExCom Member | BeachHack Season 7: Managed publicity and participant outreach for a 36-hour national hackathon."
        }
    ],
    projects: [
        {
            id: 1,
            title: "VeriCred Campus",
            category: "Digital Identity & Verifiable Credentials Platform",
            technologies: "Java 17, Spring Boot, React, PostgreSQL, Redis, MOSIP eSignet, Inji Certify/Verify, Docker",
            image: "/images/vericred.png",
            description: "Privacy-preserving digital academic credential platform integrating MOSIP eSignet, OpenID4VCI, and Inji ecosystem for cryptographically verifiable issuance, storage, and instant QR verification.",
            link: "https://github.com/AlinAlexMyladoor/VeriCred-Campus.git"
        },
        {
            id: 2,
            title: "SwaraSense",
            category: "AI / FastAPI / NLP",
            technologies: "FastAPI, React, Redis, PostgreSQL, MongoDB, RoBERTa, LLaMA 3 LoRA, WebSockets, Docker",
            image: "/images/SwaraSense.png",
            description: "AI-driven platform for real-time sentiment intelligence on Romanized code-mixed social comments, featuring 3-tier NLP inference, aspect-based analysis, and proactive Telegram alerts.",
            link: "https://swarasense-ui.onrender.com/"
        },
        {
            id: 3,
            title: "URL Shortener",
            category: "Scalable Backend & Analytics Engine",
            technologies: "Node.js, Express, Redis, MongoDB, BullMQ, JWT, Docker Compose",
            image: "/images/url.png",
            description: "High-performance URL shortener built on a cache-aside architecture with Base62 encoding, asynchronous click analytics processing via BullMQ workers, and dynamic QR generation.",
            link: "https://url-shortener-54n5.onrender.com"
        },
        {
            id: 4,
            title: "Myladoor Holidays",
            category: "Full-Stack Travel & Fleet Booking Platform",
            technologies: "Next.js, NestJS, TypeScript, Tailwind CSS, Prisma, PostgreSQL, JWT, Vercel",
            image: "/images/Myladoor.png",
            description: "A full-stack travel platform featuring fleet management, dynamic booking lifecycles, customer inquiries, and JWT-authenticated role-based access.",
            link: "https://myladoor-holidays.vercel.app/"
        },
        {
            id: 5,
            title: "FoodHub",
            category: "Full-Stack Restaurant Management System",
            technologies: "Java 17, Spring Boot, Spring MVC, Thymeleaf, Spring Data JPA, Hibernate, MySQL, REST APIs",
            image: "/images/foodhub.png",
            description: "Centralized multi-role restaurant management platform coordinating customers, waiters, kitchen staff, and administrators with order lifecycle tracking and table-side requests.",
            link: "https://food-way.onrender.com"
        },
        {
            id: 6,
            title: "E-Ballot",
            category: "MERN Stack / OAuth 2.0",
            technologies: "React 19, Node.js, Express, MongoDB, Mongoose, Passport.js, OAuth 2.0, Vercel",
            image: "/images/voting.png",
            description: "Secure digital voting platform featuring multi-provider OAuth (Google/LinkedIn), one-vote-per-user transactional enforcement, voter tracking, and real-time tally aggregation.",
            link: "https://e-ballot.vercel.app/"
        },
        {
            id: 7,
            title: "CartShoppe",
            category: "Full-Stack E-Commerce / Python Django",
            technologies: "Python, Django, Django ORM, SQLite, JavaScript, HTML5, CSS3, Pillow",
            image: "/images/cart.png",
            description: "Full-stack e-commerce web platform built on Django MVT architecture, featuring session-based cart operations, order lifecycle tracking, customer reviews, and custom admin management.",
            link: "https://github.com/AlinAlexMyladoor/Cart_Shopee.git"
        }
    ],
    contact: {
        email: "alinalex441@gmail.com",
        github: "https://github.com/AlinAlexMyladoor",
        linkedin: "https://www.linkedin.com/in/alin-alex-00a017332",
        twitter: "",
        facebook: "",
        instagram: ""
    },
    skills: {
        develop: {
            title: "AI & BACKEND",
            description: "Intelligent APIs & Microservices",
            details: "Architecting scalable backends using Python, Java & Go. Focused on AI integrations (LLMs), WebSockets, and robust database modeling.",
            tools: ["Python", "FastAPI", "Go", "AI", "Docker"]
        },
        design: {
            title: "FULL-STACK",
            description: "End-to-End Web Apps",
            details: "Building production-ready web platforms by connecting complex backend logic with modern, state-driven frontends (React, Node.js).",
            tools: ["React", "Node.js", "TypeScript", "Tailwind"]
        }
    }
};
