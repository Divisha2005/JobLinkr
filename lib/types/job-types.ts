// Unified job type that works across all platforms
export interface UnifiedJob {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  level: 'Entry' | 'Mid' | 'Senior'
  type: 'Full-time' | 'Contract' | 'Freelance'
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  skills: string[]
  posted: Date
  applicants?: number
  source: 'freelancer' | 'fiverr' | 'mock'
  sourceUrl: string
  budget?: {
    type: 'fixed' | 'hourly'
    min?: number
    max?: number
    currency: string
  }
}

// Freelancer API Response Types
export interface FreelancerProject {
  id: number
  title: string
  seo_url: string
  description: string
  status: string
  submitdate: number
  budget: {
    minimum: number
    maximum: number
    currency_id: number
    currency_code: string
  }
  jobs: Array<{
    id: number
    name: string
    category: {
      id: number
      name: string
    }
  }>
  bid_stats: {
    bid_count: number
  }
  location: {
    country: {
      name: string
    }
  }
  owner_id: number
}

export interface FreelancerApiResponse {
  status: string
  result: {
    projects: FreelancerProject[]
    total_count: number
  }
}

// Fiverr API Response Types
export interface FiverrGig {
  id: string
  title: string
  slug: string
  seller: {
    username: string
    avatar: string
    level: string
  }
  price: {
    starting_at: number
    currency: string
  }
  rating: number
  reviews_count: number
  description: string
  category: string
  subcategory: string
  tags: string[]
  delivery_time: string
  created_at: string
}

export interface FiverrApiResponse {
  gigs: FiverrGig[]
  total: number
}

// API Request Parameters
export interface JobSearchParams {
  query?: string
  limit?: number
  offset?: number
  category?: string
  minBudget?: number
  maxBudget?: number
}
