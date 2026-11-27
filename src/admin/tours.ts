export const tourCategories = [
  "Heritage Tours",
  "Dhow Experiences",
  "Cultural Experiences",
  "Coastal Activities",
] as const;

export type TourCategory = (typeof tourCategories)[number];

export type TourRecord = {
  id: string;
  name: string;
  category: TourCategory;
  shortDescription: string;
  fullDescription: string;
  location: string;
  duration: string;
  price: number;
  image: string;
  status: "Published" | "Draft" | "Unpublished";
};

export type TourInput = Omit<TourRecord, "id" | "status" | "price"> & { price: string | number };
export type TourErrors = Partial<Record<keyof TourInput, string>>;

export function validateTour(tour: TourInput, tours: TourRecord[], currentId?: string): TourErrors {
  const errors: TourErrors = {};
  const name = tour.name.trim().toLowerCase();
  if (!name) errors.name = "Enter a tour name.";
  else if (tours.some((item) => item.id !== currentId && item.name.trim().toLowerCase() === name)) {
    errors.name = "A tour with this name already exists.";
  }
  if (!tour.shortDescription.trim()) errors.shortDescription = "Enter a short description.";
  if (!tour.fullDescription.trim()) errors.fullDescription = "Enter a full description.";
  if (!tour.location.trim()) errors.location = "Enter a location.";
  if (!tour.duration.trim()) errors.duration = "Enter a duration, for example 1–2 hours.";
  const price = String(tour.price).trim();
  if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0) errors.price = "Enter a price in KES greater than zero.";
  return errors;
}

/** Existing local photographs available for tour imagery. */
export const tourImages = [
  { value: "/images/old-town-street.jpg", label: "Old Town street" },
  { value: "/images/dhow-sail.jpg", label: "Dhow under sail" },
  { value: "/images/tudor-creek-dhow.jpg", label: "Tudor Creek dhow" },
  { value: "/images/fort-jesus.jpg", label: "Fort Jesus" },
] as const;

/**
 * Demonstration tour catalogue. The three published tours mirror the
 * existing public-website and customer-portal experience records; the
 * draft is a demonstration entry that has never been published.
 */
export const initialTours: TourRecord[] = [
  {
    id: "MTD-T-001",
    name: "Old Town Heritage Tour",
    category: "Heritage Tours",
    shortDescription: "Carved doors, coral-stone lanes and stories shared by an Old Town resident.",
    fullDescription:
      "Walk through the historic streets of Old Town, discover Swahili architecture and uncover the stories that make this coastal city unique.",
    location: "Old Town, Mombasa",
    duration: "2–3 hours",
    price: 1500,
    image: "/images/old-town-street.jpg",
    status: "Published",
  },
  {
    id: "MTD-T-002",
    name: "Tudor Creek Dhow Ride",
    category: "Dhow Experiences",
    shortDescription: "Sail the tidal creek aboard a traditional wooden dhow at golden hour.",
    fullDescription:
      "Step aboard a traditional wooden dhow and experience the peaceful beauty of Tudor Creek.",
    location: "Tudor Creek, Mombasa",
    duration: "1–2 hours",
    price: 2500,
    image: "/images/dhow-sail.jpg",
    status: "Published",
  },
  {
    id: "MTD-T-003",
    name: "Fort Jesus Experience",
    category: "Heritage Tours",
    shortDescription: "Explore four centuries of coastal history with a licensed heritage guide.",
    fullDescription:
      "Explore the architecture, history and stories of one of Kenya's most remarkable coastal landmarks.",
    location: "Fort Jesus, Mombasa",
    duration: "1–2 hours",
    price: 1200,
    image: "/images/fort-jesus.jpg",
    status: "Published",
  },
  {
    id: "MTD-T-004",
    name: "Spice Market Cultural Walk",
    category: "Cultural Experiences",
    shortDescription: "Demonstration draft: scents, flavours and traders of Mackinnon Market.",
    fullDescription:
      "A demonstration draft tour through Mombasa's historic spice market. This entry has not been published and is not a live experience.",
    location: "Mackinnon Market, Mombasa",
    duration: "1–2 hours",
    price: 1000,
    image: "/images/old-town-street.jpg",
    status: "Draft",
  },
];

export function nextTourId(tours: TourRecord[]): string {
  const max = tours.reduce((highest, tour) => {
    const value = Number(tour.id.replace("MTD-T-", ""));
    return Number.isFinite(value) && value > highest ? value : highest;
  }, 0);
  return `MTD-T-${String(max + 1).padStart(3, "0")}`;
}
