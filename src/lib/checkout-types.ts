export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  newsletter: boolean;
}

export interface ShippingAddress {
  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  apartment: string;
}

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  cost: number;
  estimatedDays: string;
}

export interface BillingInfo {
  sameAsShipping: boolean;
  address: ShippingAddress;
}

export type PaymentMethodType = "card" | "stripe" | "paypal" | "apple-pay" | "google-pay" | "bank-transfer";

export interface PaymentInfo {
  method: PaymentMethodType;
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface CheckoutFormData {
  customerInfo: CustomerInfo;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod | null;
  billingInfo: BillingInfo;
  paymentInfo: PaymentInfo;
}

export type CheckoutStep = "customer-info" | "shipping-address" | "shipping-method" | "billing-info" | "payment" | "review" | "confirmation";

export const CHECKOUT_STEP_LABELS: Record<CheckoutStep, string> = {
  "customer-info": "Customer",
  "shipping-address": "Shipping",
  "shipping-method": "Method",
  "billing-info": "Billing",
  payment: "Payment",
  review: "Review",
  confirmation: "Confirmed",
};

export const CHECKOUT_STEPS: CheckoutStep[] = [
  "customer-info",
  "shipping-address",
  "shipping-method",
  "billing-info",
  "payment",
  "review",
  "confirmation",
];

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Reliable delivery at no extra cost",
    cost: 0,
    estimatedDays: "5-7 business days",
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Faster delivery for urgent orders",
    cost: 14.99,
    estimatedDays: "2-3 business days",
  },
  {
    id: "priority",
    label: "Priority Shipping",
    description: "Next-business-day delivery",
    cost: 29.99,
    estimatedDays: "1-2 business days",
  },
  {
    id: "pickup",
    label: "Local Pickup",
    description: "Free pickup at our warehouse (ready in 2hrs)",
    cost: 0,
    estimatedDays: "Same day",
  },
];

export const PAYMENT_METHODS: { id: PaymentMethodType; label: string; description: string }[] = [
  { id: "card", label: "Credit / Debit Card", description: "Visa, Mastercard, Amex, Discover" },
  { id: "stripe", label: "Stripe", description: "Pay with Stripe" },
  { id: "paypal", label: "PayPal", description: "Fast & secure payments" },
  { id: "apple-pay", label: "Apple Pay", description: "Pay with Touch ID or Face ID" },
  { id: "google-pay", label: "Google Pay", description: "Fast checkout with Google" },
  { id: "bank-transfer", label: "Bank Transfer", description: "Direct bank transfer (3-5 days)" },
];

export const COUNTRIES = ["United States", "Canada"];

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming",
];

export const CANADA_PROVINCES = [ // unused
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
  "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
];

export const STATE_CITIES: Record<string, string[]> = {
  Alabama: ["Birmingham", "Huntsville", "Montgomery", "Mobile", "Tuscaloosa"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Wasilla"],
  Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Tempe", "Glendale"],
  Arkansas: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
  California: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
  Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Boulder"],
  Connecticut: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Norwalk", "Danbury"],
  Delaware: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "St. Petersburg", "Tallahassee", "Hialeah", "Cape Coral", "Pembroke Pines"],
  Georgia: ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs"],
  Hawaii: ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
  Idaho: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Twin Falls"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford", "Springfield", "Peoria", "Elgin"],
  Indiana: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Bloomington"],
  Iowa: ["Des Moines", "Cedar Rapids", "Davenport", "Iowa City", "Waterloo", "Ames"],
  Kansas: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka", "Lawrence"],
  Kentucky: ["Louisville", "Lexington", "Bowling Green", "Covington", "Owensboro", "Frankfort"],
  Louisiana: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Bossier City"],
  Maine: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
  Maryland: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Hagerstown"],
  Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell", "Brocton", "Quincy"],
  Michigan: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint", "Kalamazoo", "Sterling Heights"],
  Minnesota: ["Minneapolis", "Saint Paul", "Rochester", "Bloomington", "Duluth", "Brooklyn Park"],
  Mississippi: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian"],
  Missouri: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence", "Lee's Summit"],
  Montana: ["Billings", "Missoula", "Great Falls", "Bozeman", "Helena", "Butte"],
  Nebraska: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont"],
  Nevada: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City"],
  "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Rochester", "Salem"],
  "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Clifton", "Camden", "Trenton"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Santa Fe", "Rio Rancho", "Roswell", "Farmington"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma"],
  Oklahoma: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton"],
  Oregon: ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro", "Bend", "Beaverton"],
  Pennsylvania: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Harrisburg"],
  "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
  "South Carolina": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Greenville", "Myrtle Beach"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Mitchell"],
  Tennessee: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Macon"],
  Texas: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Lubbock"],
  Utah: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "St. George"],
  Vermont: ["Burlington", "South Burlington", "Rutland", "Montpelier", "Barre"],
  Virginia: ["Virginia Beach", "Norfolk", "Richmond", "Chesapeake", "Arlington", "Newport News", "Alexandria"],
  Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Olympia"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling", "Martinsburg"],
  Wisconsin: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha"],
  Wyoming: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan"],
};
