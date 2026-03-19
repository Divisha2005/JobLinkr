import {
  JobSearchParams,
  UnifiedJob,
  FiverrGig
} from '@/lib/types/job-types'

// Since Fiverr doesn't have an official public API, we use a scraping approach
// with fallback to mock data if scraping fails

const FIVERR_BASE_URL = 'https://www.fiverr.com'

// Mock Fiverr data as fallback when scraping fails
const mockFiverrGigs: FiverrGig[] = [
  {
    id: 'fiverr-1',
    title: 'I will develop a modern react web application',
    slug: 'develop-modern-react-web-application',
    seller: {
      username: 'reactdev_pro',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reactdev',
      level: 'Top Rated'
    },
    price: {
      starting_at: 150,
      currency: 'USD'
    },
    rating: 4.9,
    reviews_count: 127,
    description: 'I will create a professional React web application with modern UI/UX design, responsive layout, and optimal performance. Includes Redux state management, API integration, and deployment.',
    category: 'Programming & Tech',
    subcategory: 'Web Development',
    tags: ['React', 'JavaScript', 'Web Development', 'Frontend', 'Redux'],
    delivery_time: '7 days',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fiverr-2',
    title: 'I will design a professional mobile app UI UX',
    slug: 'design-professional-mobile-app-ui-ux',
    seller: {
      username: 'designmaster',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=designmaster',
      level: 'Level 2'
    },
    price: {
      starting_at: 200,
      currency: 'USD'
    },
    rating: 4.8,
    reviews_count: 89,
    description: 'Professional mobile app UI/UX design for iOS and Android. Includes wireframes, high-fidelity mockups, prototype, and design system. User-centered design approach.',
    category: 'Graphics & Design',
    subcategory: 'Mobile App Design',
    tags: ['UI Design', 'UX Design', 'Mobile App', 'Figma', 'Prototyping'],
    delivery_time: '5 days',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fiverr-3',
    title: 'I will build a full stack nodejs and mongodb application',
    slug: 'build-full-stack-nodejs-mongodb-application',
    seller: {
      username: 'backendguru',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backendguru',
      level: 'Top Rated'
    },
    price: {
      starting_at: 300,
      currency: 'USD'
    },
    rating: 5.0,
    reviews_count: 203,
    description: 'Full-stack development with Node.js, Express, MongoDB, and React. RESTful API development, authentication, database design, and deployment to cloud platforms.',
    category: 'Programming & Tech',
    subcategory: 'Web Development',
    tags: ['Node.js', 'MongoDB', 'Express', 'Full Stack', 'Backend'],
    delivery_time: '10 days',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fiverr-4',
    title: 'I will create a python automation script for data processing',
    slug: 'create-python-automation-script-data-processing',
    seller: {
      username: 'pythonwizard',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pythonwizard',
      level: 'Level 1'
    },
    price: {
      starting_at: 75,
      currency: 'USD'
    },
    rating: 4.7,
    reviews_count: 45,
    description: 'Custom Python scripts for web scraping, data processing, automation, and API integration. Clean, documented code with error handling and logging.',
    category: 'Programming & Tech',
    subcategory: 'Data Processing',
    tags: ['Python', 'Automation', 'Web Scraping', 'Data Processing', 'Scripting'],
    delivery_time: '3 days',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'fiverr-5',
    title: 'I will develop a wordpress website with custom themes',
    slug: 'develop-wordpress-website-custom-themes',
    seller: {
      username: 'wordpressace',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wordpressace',
      level: 'Level 2'
    },
    price: {
      starting_at: 120,
      currency: 'USD'
    },
    rating: 4.8,
    reviews_count: 156,
    description: 'Custom WordPress development with bespoke themes and plugins. WooCommerce integration, SEO optimization, and performance tuning. Responsive and mobile-friendly.',
    category: 'Programming & Tech',
    subcategory: 'WordPress',
    tags: ['WordPress', 'PHP', 'WooCommerce', 'Theme Development', 'CMS'],
    delivery_time: '7 days',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Transform Fiverr gig to unified job format
function transformFiverrGig(gig: FiverrGig): UnifiedJob {
  // Map Fiverr seller level to experience level
  const levelMap: Record<string, 'Entry' | 'Mid' | 'Senior'> = {
    'New Seller': 'Entry',
    'Level 1': 'Entry',
    'Level 2': 'Mid',
    'Top Rated': 'Senior',
    'Pro': 'Senior'
  }

  return {
    id: `fv-${gig.id}`,
    title: gig.title.replace(/^I will\s+/i, ''),
    company: gig.seller.username,
    companyLogo: gig.seller.avatar,
    location: 'Remote',
    level: levelMap[gig.seller.level] || 'Mid',
    type: 'Freelance',
    description: gig.description.slice(0, 300) + (gig.description.length > 300 ? '...' : ''),
    skills: gig.tags.slice(0, 5),
    posted: new Date(gig.created_at),
    applicants: gig.reviews_count,
    source: 'fiverr',
    sourceUrl: `${FIVERR_BASE_URL}/${gig.seller.username}/${gig.slug}`,
    budget: {
      type: 'fixed',
      min: gig.price.starting_at,
      max: gig.price.starting_at * 3, // Estimate max based on packages
      currency: gig.price.currency
    }
  }
}

// Try to scrape Fiverr search results (may fail due to bot protection)
async function scrapeFiverrGigs(query: string, limit: number): Promise<FiverrGig[]> {
  try {
    // Note: Fiverr has strong bot protection. This is a best-effort approach.
    // In production, you might need to use a service like ScrapingBee or ScrapingAnt
    const searchUrl = `${FIVERR_BASE_URL}/search/gigs?query=${encodeURIComponent(query)}&page=1`
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Fiverr: ${response.status}`)
    }

    const html = await response.text()
    
    // Try to extract JSON data from the page
    // Fiverr embeds data in a script tag or window object
    const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]+?});/) ||
                     html.match(/"gigs":\s*(\[[\s\S]+?\])/)
    
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[1])
        const gigs = data.gigs || data.search?.gigs || []
        return gigs.slice(0, limit)
      } catch {
        // JSON parse failed, fall through to mock data
      }
    }
    
    throw new Error('Could not extract gig data from Fiverr')
  } catch (error) {
    console.warn('Fiverr scraping failed, using fallback data:', error)
    return []
  }
}

export async function fetchFiverrJobs(
  params: JobSearchParams = {}
): Promise<UnifiedJob[]> {
  const { query = '', limit = 20 } = params

  try {
    // Try to scrape real data first
    let gigs: FiverrGig[] = []
    
    if (query) {
      gigs = await scrapeFiverrGigs(query, limit)
    }
    
    // If scraping failed or no query, use mock data filtered by query
    if (gigs.length === 0) {
      gigs = mockFiverrGigs
      
      if (query) {
        const lowerQuery = query.toLowerCase()
        gigs = gigs.filter(gig =>
          gig.title.toLowerCase().includes(lowerQuery) ||
          gig.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
          gig.category.toLowerCase().includes(lowerQuery)
        )
      }
    }

    return gigs.slice(0, limit).map(transformFiverrGig)
  } catch (error) {
    console.error('Error fetching from Fiverr:', error)
    // Return mock data as ultimate fallback
    return mockFiverrGigs.slice(0, limit).map(transformFiverrGig)
  }
}
