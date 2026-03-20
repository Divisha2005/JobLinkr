module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Joblinkr/lib/apis/freelancer-api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchFreelancerJobs",
    ()=>fetchFreelancerJobs,
    "searchFreelancerJobsByCategory",
    ()=>searchFreelancerJobsByCategory
]);
const FREELANCER_API_BASE = 'https://www.freelancer.com/api/projects/0.1';
// Get API credentials from environment variables
const FREELANCER_CLIENT_ID = process.env.FREELANCER_CLIENT_ID;
const FREELANCER_API_KEY = process.env.FREELANCER_API_KEY;
// Map Freelancer job names to experience levels
function mapExperienceLevel(jobNames) {
    const seniorKeywords = [
        'senior',
        'lead',
        'architect',
        'expert',
        'principal'
    ];
    const entryKeywords = [
        'junior',
        'entry',
        'intern',
        'trainee',
        'beginner'
    ];
    const allText = jobNames.join(' ').toLowerCase();
    if (seniorKeywords.some((kw)=>allText.includes(kw))) return 'Senior';
    if (entryKeywords.some((kw)=>allText.includes(kw))) return 'Entry';
    return 'Mid';
}
// Transform Freelancer project to unified job format
function transformFreelancerProject(project) {
    const skills = project.jobs?.map((job)=>job.name) || [];
    return {
        id: `fl-${project.id}`,
        title: project.title,
        company: `Employer #${project.owner_id}`,
        companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${project.owner_id}`,
        location: project.location?.country?.name || 'Remote',
        level: mapExperienceLevel(skills),
        type: 'Freelance',
        description: project.description ? project.description.replace(/<[^>]*>/g, '').slice(0, 300) + '...' : 'No description available',
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
    };
}
async function fetchFreelancerJobs(params = {}) {
    const { query = '', limit = 20, offset = 0 } = params;
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
        });
        if (query) {
            searchParams.append('query', query);
        }
        const url = `${FREELANCER_API_BASE}/projects/active?${searchParams.toString()}`;
        console.log('Fetching from Freelancer API:', url);
        // Build headers - add auth if credentials available
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        // Add authentication if API key is configured
        if (FREELANCER_API_KEY) {
            headers['Authorization'] = `Bearer ${FREELANCER_API_KEY}`;
        }
        if (FREELANCER_CLIENT_ID) {
            headers['Freelancer-Client-Id'] = FREELANCER_CLIENT_ID;
        }
        const response = await fetch(url, {
            method: 'GET',
            headers,
            next: {
                revalidate: 60
            } // Cache for 60 seconds
        });
        if (!response.ok) {
            throw new Error(`Freelancer API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.status !== 'success' || !data.result?.projects) {
            console.warn('Freelancer API returned no projects');
            return [];
        }
        return data.result.projects.map(transformFreelancerProject);
    } catch (error) {
        console.error('Error fetching from Freelancer API:', error);
        throw error;
    }
}
async function searchFreelancerJobsByCategory(category, limit = 20) {
    return fetchFreelancerJobs({
        query: category,
        limit
    });
}
}),
"[project]/OneDrive/Desktop/Joblinkr/lib/apis/fiverr-api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchFiverrJobs",
    ()=>fetchFiverrJobs
]);
// Since Fiverr doesn't have an official public API, we use a scraping approach
// with fallback to mock data if scraping fails
const FIVERR_BASE_URL = 'https://www.fiverr.com';
// Mock Fiverr data as fallback when scraping fails
const mockFiverrGigs = [
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
        tags: [
            'React',
            'JavaScript',
            'Web Development',
            'Frontend',
            'Redux'
        ],
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
        tags: [
            'UI Design',
            'UX Design',
            'Mobile App',
            'Figma',
            'Prototyping'
        ],
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
        tags: [
            'Node.js',
            'MongoDB',
            'Express',
            'Full Stack',
            'Backend'
        ],
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
        tags: [
            'Python',
            'Automation',
            'Web Scraping',
            'Data Processing',
            'Scripting'
        ],
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
        tags: [
            'WordPress',
            'PHP',
            'WooCommerce',
            'Theme Development',
            'CMS'
        ],
        delivery_time: '7 days',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
];
// Transform Fiverr gig to unified job format
function transformFiverrGig(gig) {
    // Map Fiverr seller level to experience level
    const levelMap = {
        'New Seller': 'Entry',
        'Level 1': 'Entry',
        'Level 2': 'Mid',
        'Top Rated': 'Senior',
        'Pro': 'Senior'
    };
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
            max: gig.price.starting_at * 3,
            currency: gig.price.currency
        }
    };
}
// Try to scrape Fiverr search results (may fail due to bot protection)
async function scrapeFiverrGigs(query, limit) {
    try {
        // Note: Fiverr has strong bot protection. This is a best-effort approach.
        // In production, you might need to use a service like ScrapingBee or ScrapingAnt
        const searchUrl = `${FIVERR_BASE_URL}/search/gigs?query=${encodeURIComponent(query)}&page=1`;
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'DNT': '1',
                'Connection': 'keep-alive'
            },
            next: {
                revalidate: 300
            } // Cache for 5 minutes
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch Fiverr: ${response.status}`);
        }
        const html = await response.text();
        // Try to extract JSON data from the page
        // Fiverr embeds data in a script tag or window object
        const jsonMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[\s\S]+?});/) || html.match(/"gigs":\s*(\[[\s\S]+?\])/);
        if (jsonMatch) {
            try {
                const data = JSON.parse(jsonMatch[1]);
                const gigs = data.gigs || data.search?.gigs || [];
                return gigs.slice(0, limit);
            } catch  {
            // JSON parse failed, fall through to mock data
            }
        }
        throw new Error('Could not extract gig data from Fiverr');
    } catch (error) {
        console.warn('Fiverr scraping failed, using fallback data:', error);
        return [];
    }
}
async function fetchFiverrJobs(params = {}) {
    const { query = '', limit = 20 } = params;
    try {
        // Try to scrape real data first
        let gigs = [];
        if (query) {
            gigs = await scrapeFiverrGigs(query, limit);
        }
        // If scraping failed or no query, use mock data filtered by query
        if (gigs.length === 0) {
            gigs = mockFiverrGigs;
            if (query) {
                const lowerQuery = query.toLowerCase();
                gigs = gigs.filter((gig)=>gig.title.toLowerCase().includes(lowerQuery) || gig.tags.some((tag)=>tag.toLowerCase().includes(lowerQuery)) || gig.category.toLowerCase().includes(lowerQuery));
            }
        }
        return gigs.slice(0, limit).map(transformFiverrGig);
    } catch (error) {
        console.error('Error fetching from Fiverr:', error);
        // Return mock data as ultimate fallback
        return mockFiverrGigs.slice(0, limit).map(transformFiverrGig);
    }
}
}),
"[project]/OneDrive/Desktop/Joblinkr/app/api/jobs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Joblinkr/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$lib$2f$apis$2f$freelancer$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Joblinkr/lib/apis/freelancer-api.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$lib$2f$apis$2f$fiverr$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Joblinkr/lib/apis/fiverr-api.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const source = searchParams.get('source') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    try {
        const jobs = [];
        // Fetch from Freelancer API
        if (source === 'all' || source === 'freelancer') {
            try {
                const freelancerJobs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$lib$2f$apis$2f$freelancer$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchFreelancerJobs"])({
                    query,
                    limit
                });
                jobs.push(...freelancerJobs);
            } catch (error) {
                console.error('Freelancer API error:', error);
            }
        }
        // Fetch from Fiverr
        if (source === 'all' || source === 'fiverr') {
            try {
                const fiverrJobs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$lib$2f$apis$2f$fiverr$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchFiverrJobs"])({
                    query,
                    limit
                });
                jobs.push(...fiverrJobs);
            } catch (error) {
                console.error('Fiverr API error:', error);
            }
        }
        // Sort by posted date (newest first)
        jobs.sort((a, b)=>b.posted.getTime() - a.posted.getTime());
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: jobs,
            count: jobs.length,
            sources: {
                freelancer: source === 'all' || source === 'freelancer',
                fiverr: source === 'all' || source === 'fiverr'
            }
        });
    } catch (error) {
        console.error('Jobs API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch jobs',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__65e72cba._.js.map