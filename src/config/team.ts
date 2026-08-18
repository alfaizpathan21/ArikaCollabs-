export interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    description: string;
    socials?: {
        instagram?: string;
        linkedin?: string;
        email?: string;
    };
}

export const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: "Sanjana",
        role: "Marketing Director ",
        image: "/images/team/sanjana.jpg",
        description: "Leading strategic direction, campaign innovation, and high-impact brand partnerships across modern luxury creator networks.",
        socials: {
            instagram: "https://www.instagram.com/arika_collabs/",
            linkedin: "https://www.linkedin.com/in/arika-collabs",
            email: "sanjana@arikacollabs.com"
        }
    },
    {
        id: 2,
        name: "Vansh",
        role: "Creative Strategy Lead",
        image: "/images/team/vansh.jpg",
        description: "Crafting bespoke digital narratives, brand identity alignment, and high-converting campaign visual aesthetics.",
        socials: {
            instagram: "https://www.instagram.com/arika_collabs/",
            linkedin: "https://www.linkedin.com/in/arika-collabs",
            email: "vansh@arikacollabs.com"
        }
    },
    {
        id: 3,
        name: "Sumit",
        role: "Head of Creator Relations",
        image: "/images/team/sumit.jpg",
        description: "Nurturing exclusive relationships with top-tier creators and managing seamless influencer collaborations.",
        socials: {
            instagram: "https://www.instagram.com/arika_collabs/",
            linkedin: "https://www.linkedin.com/in/arika-collabs",
            email: "sumit@arikacollabs.com"
        }
    },
    {
        id: 4,
        name: "Alfaiz",
        role: "Operations & Tech Lead",
        image: "/images/team/alfaiz.jpg",
        description: "Optimizing campaign execution workflows, real-time analytics tracking, and scalable tech infrastructure.",
        socials: {
            instagram: "https://www.instagram.com/alfaiz_.pathan_/?hl=en",
            linkedin: "https://www.linkedin.com/in/alfaiz-pathan-b39736147/?skipRedirect=true",
            email: "alfaiz.pathan@arikacollabs.com"
        }
    }
];
