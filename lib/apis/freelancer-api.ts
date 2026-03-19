import {
  JobSearchParams,
  UnifiedJob,
  FreelancerApiResponse,
  FreelancerProject
} from '@/lib/types/job-types'

const FREELANCER_API_BASE = 'https://www.freelancer.com/api/projects/0.1'

// Get API credentials from environment variables
const FREELANCER_CLIENT_ID = process.env.FREELANCER_CLIENT_ID
const FREELANCER_API_KEY = process.env.FREELANCER_API_KEY

// Map Freelancer job names to experience levels
function mapExperienceLevel(jobNames: string[]): 'Entry' | 'Mid' | 'Senior' {
  const seniorKeywords = ['senior', 'lead', 'architect', 'expert', 'principal']
  const entryKeywords = ['junior', 'entry', 'intern', 'trainee', 'beginner']
  
  const allText = jobNames.join(' ').toLowerCase()
  
  if (seniorKeywords.some(kw => allText.includes(kw))) return 'Senior'
  if (entryKeywords.some(kw => allText.includes(kw))) return 'Entry'
  return 'Mid'
}

// Transform Freelancer project to unified job format
function transformFreelancerProject(project: FreelancerProject): UnifiedJob {
  const skills = project.jobs?.map(job => job.name) || []
  
  return {
    id: `fl-${project.id}`,
    title: project.title,
    company: `Employer #${project.owner_id}`,
    companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${project.owner_id}`,
    location: project.location?.country?.name || 'Remote',
    level: mapExperienceLevel(skills),
    type: 'Freelance',
    description: project.description
      ? project.description.replace(/<[^>]*>/g, '').slice(0, 300) + '...'
      : 'No description available',
    skills: skills.slice(0, 5),
    posted: new Date(project.submitdate * 1000),
    applicants: project.bid_stats?.bid_count || 0,
    source: 'freelancer',
    sourceUrl: `https://www.freelancer.com/projects/${project.seo_url}`,
    budget: project.budget ? {
      type: 'fixed',
      min: project.budget.minimum,
      max: project.budget.maximum,
      currency: project.budget.currency_code || 'USD'
    } : undefined
  }
}

export async function fetchFreelancerJobs(
  params: JobSearchParams = {}
): Promise<UnifiedJob[]> {
  const { query = '', limit = 20, offset = 0 } = params

  try {
    // Build query parameters
    const searchParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      'sort_field': 'submitdate',
      'sort_direction': 'desc',
      'job_details': 'true',
      'full_description': 'true',
      'bid_stats': 'true',
      'user_details': 'true'
    })

    if (query) {
      searchParams.append('query', query)
    }

    const url = `${FREELANCER_API_BASE}/projects/active?${searchParams.toString()}`
    
    console.log('Fetching from Freelancer API:', url)

    // Build headers - add auth if credentials available
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }

    // Add authentication if API key is configured
    if (FREELANCER_API_KEY) {
      headers['Authorization'] = `Bearer ${FREELANCER_API_KEY}`
    }
    if (FREELANCER_CLIENT_ID) {
      headers['Freelancer-Client-Id'] = FREELANCER_CLIENT_ID
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`Freelancer API error: ${response.status} ${response.statusText}`)
    }

    const data: FreelancerApiResponse = await response.json()

    if (data.status !== 'success' || !data.result?.projects) {
      console.warn('Freelancer API returned no projects')
      return []
    }

    return data.result.projects.map(transformFreelancerProject)
  } catch (error) {
    console.error('Error fetching from Freelancer API:', error)
    throw error
  }
}

// Search for jobs by specific skills/categories
export async function searchFreelancerJobsByCategory(
  category: string,
  limit: number = 20
): Promise<UnifiedJob[]> {
  return fetchFreelancerJobs({ query: category, limit })
}
