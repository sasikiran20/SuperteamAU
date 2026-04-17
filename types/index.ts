export type MemberRole = "Developer" | "Designer" | "Content" | "BizDev" | "Founder" | "Operator";
export type Badge = "Builder" | "Hackathon Winner" | "Core Contributor" | "Grant Recipient";

export interface Member {
  name: string;
  role: string;
  company: string;
  handle: string;
  skills: MemberRole[];
  badges: Badge[];
  avatar: string;
  twitter: string;
  bio: string;
}

export interface Event {
  id?: string;
  title: string;
  date: string;
  location: string;
  description: string;
  lumaUrl: string;
  type: "upcoming" | "past";
  image: string;
}

export interface Partner {
  name: string;
  logo: string;
  url: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export type CommunityCardType = "tweet" | "testimonial" | "social";

export interface BaseCard {
  type: CommunityCardType;
  name: string;
  src: string;
}

export interface TweetCard extends BaseCard {
  type: "tweet";
  handle: string;
  content: string;
  likes: number;
  retweets: number;
  timestamp: string;
}

export interface TestimonialCard extends BaseCard {
  type: "testimonial";
  quote: string;
  designation: string;
}

export interface SocialProofCard extends BaseCard {
  type: "social";
  title: string;
  description: string;
  metric?: string;
}

export type CommunityCard = TweetCard | TestimonialCard | SocialProofCard;
