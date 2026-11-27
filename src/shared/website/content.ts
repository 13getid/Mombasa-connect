import { tourImages, type TourRecord } from "../../admin/tours";

export type WebsiteContent = {
  headline: string;
  headlineEmphasis: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  heroImage: string;
  aboutTitle: string;
  aboutDescription: string;
  featuredTourIds: string[];
};

export const initialWebsiteContent: WebsiteContent = {
  headline: "Experience Mombasa",
  headlineEmphasis: "Like a Local.",
  description: "Discover the stories, culture and hidden gems of Mombasa through authentic experiences led by local guides.",
  primaryAction: "Explore experiences",
  secondaryAction: "Book without internet",
  heroImage: "/images/tudor-creek-dhow.jpg",
  aboutTitle: "Fair Direct Coastal Tourism",
  aboutDescription: "Born out of the Innovate Mombasa Hackathon, our mission is to empower generational local captains, heritage guides, and storytellers by removing extractive middle-layers. Whether browsing on 5G or dialing from a basic feature phone in Likoni, authentic coastal culture belongs to everyone.",
  featuredTourIds: ["MTD-T-001", "MTD-T-002", "MTD-T-003"],
};

export type WebsiteErrors = Partial<Record<keyof WebsiteContent, string>>;

export function validateWebsiteContent(content: WebsiteContent, tours: TourRecord[]): WebsiteErrors {
  const errors: WebsiteErrors = {};
  const required: Array<[keyof Omit<WebsiteContent, "featuredTourIds" | "heroImage">, string]> = [
    ["headline", "Enter the headline."], ["headlineEmphasis", "Enter the emphasized headline."],
    ["description", "Enter the supporting description."], ["primaryAction", "Enter the primary action text."],
    ["secondaryAction", "Enter the secondary action text."], ["aboutTitle", "Enter the about heading."],
    ["aboutDescription", "Enter the about description."],
  ];
  for (const [key, message] of required) if (!content[key].trim()) errors[key] = message;
  if (!tourImages.some((image) => image.value === content.heroImage)) errors.heroImage = "Choose an existing image.";
  if (content.featuredTourIds.length > 3 || new Set(content.featuredTourIds).size !== content.featuredTourIds.length ||
    content.featuredTourIds.some((id) => !tours.some((tour) => tour.id === id && tour.status === "Published"))) {
    errors.featuredTourIds = "Choose up to three distinct published tours.";
  }
  return errors;
}

export function featuredTours(content: WebsiteContent, tours: TourRecord[]): TourRecord[] {
  return content.featuredTourIds.flatMap((id) => {
    const tour = tours.find((item) => item.id === id && item.status === "Published");
    return tour ? [tour] : [];
  });
}
