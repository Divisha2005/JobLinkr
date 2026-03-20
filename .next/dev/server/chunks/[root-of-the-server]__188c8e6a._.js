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
"[project]/OneDrive/Desktop/Joblinkr/lib/apis/adzuna-api.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAdzunaJobs",
    ()=>fetchAdzunaJobs,
    "searchAdzunaJobsByCategory",
    ()=>searchAdzunaJobsByCategory
]);
const ADZUNA_API_BASE = 'https://api.adzuna.com/v1/api/jobs';
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
// Map Adzuna contract types to our job types
function mapJobType(contractType, contractTime) {
    if (contractType === 'contract') return 'Contract';
    if (contractTime === 'part_time') return 'Freelance';
    return 'Full-time';
}
// Map experience level based on title keywords
function mapExperienceLevel(title) {
    const lowerTitle = title.toLowerCase();
    const seniorKeywords = [
        'senior',
        'lead',
        'architect',
        'expert',
        'principal',
        'manager',
        'director'
    ];
    const entryKeywords = [
        'junior',
        'entry',
        'intern',
        'trainee',
        'beginner',
        'graduate'
    ];
    if (seniorKeywords.some((kw)=>lowerTitle.includes(kw))) return 'Senior';
    if (entryKeywords.some((kw)=>lowerTitle.includes(kw))) return 'Entry';
    return 'Mid';
}
// Extract skills from description and category
function extractSkills(job) {
    const skills = [];
    const description = job.description.toLowerCase();
    // Common tech skills to look for
    const techSkills = [
        'javascript',
        'typescript',
        'react',
        'vue',
        'angular',
        'node.js',
        'python',
        'java',
        'c#',
        'php',
        'ruby',
        'go',
        'rust',
        'swift',
        'kotlin',
        'html',
        'css',
        'sass',
        'less',
        'tailwind',
        'bootstrap',
        'sql',
        'mysql',
        'postgresql',
        'mongodb',
        'redis',
        'firebase',
        'aws',
        'azure',
        'gcp',
        'docker',
        'kubernetes',
        'jenkins',
        'git',
        'github',
        'gitlab',
        'bitbucket',
        'figma',
        'sketch',
        'adobe',
        'photoshop',
        'illustrator',
        'agile',
        'scrum',
        'kanban',
        'jira',
        'confluence'
    ];
    techSkills.forEach((skill)=>{
        if (description.includes(skill)) {
            skills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
    });
    // Add category as a skill if relevant
    if (job.category?.label) {
        skills.push(job.category.label);
    }
    return skills.slice(0, 5);
}
// Transform Adzuna job to unified job format
function transformAdzunaJob(job) {
    const skills = extractSkills(job);
    return {
        id: `ad-${job.id}`,
        title: job.title,
        company: job.company?.display_name || 'Unknown Company',
        companyLogo: `https://api.dicebear.com/7.x/initials/svg?seed=${job.company?.display_name || 'Company'}`,
        location: job.location?.display_name || 'Remote',
        level: mapExperienceLevel(job.title),
        type: mapJobType(job.contract_type, job.contract_time),
        description: job.description ? job.description.replace(/<[^>]*>/g, '').slice(0, 300) + '...' : 'No description available',
        skills: skills,
        posted: new Date(job.created_at),
        source: 'adzuna',
        sourceUrl: job.redirect_url,
        salary: job.salary_min && job.salary_max ? {
            min: Math.round(job.salary_min),
            max: Math.round(job.salary_max),
            currency: job.salary_currency || 'USD'
        } : undefined
    };
}
async function fetchAdzunaJobs(params = {}) {
    const { query = '', limit = 20 } = params;
    // Check if credentials are configured
    if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
        console.warn('Adzuna API credentials not configured. Set ADZUNA_APP_ID and ADZUNA_API_KEY in .env.local');
        return [];
    }
    try {
        // Build query parameters
        const searchParams = new URLSearchParams({
            app_id: ADZUNA_APP_ID,
            app_key: ADZUNA_API_KEY,
            results_per_page: limit.toString(),
            'content-type': 'application/json'
        });
        // Add search query if provided
        if (query) {
            searchParams.append('what', query);
        }
        // Default to US market - you can change this or make it configurable
        const country = 'us';
        const url = `${ADZUNA_API_BASE}/${country}/search/1?${searchParams.toString()}`;
        console.log('Fetching from Adzuna API:', url.replace(ADZUNA_API_KEY, '***'));
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            next: {
                revalidate: 300
            } // Cache for 5 minutes
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Adzuna API error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            console.warn('Adzuna API returned no jobs');
            return [];
        }
        return data.results.map(transformAdzunaJob);
    } catch (error) {
        console.error('Error fetching from Adzuna API:', error);
        throw error;
    }
}
async function searchAdzunaJobsByCategory(category, limit = 20) {
    return fetchAdzunaJobs({
        query: category,
        limit
    });
}
}),
"[project]/OneDrive/Desktop/Joblinkr/app/api/jobs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Joblinkr/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$lib$2f$apis$2f$adzuna$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Joblinkr/lib/apis/adzuna-api.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    try {
        // Fetch only from Adzuna
        const jobs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$lib$2f$apis$2f$adzuna$2d$api$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fetchAdzunaJobs"])({
            query,
            limit
        });
        // Sort by posted date (newest first)
        jobs.sort((a, b)=>b.posted.getTime() - a.posted.getTime());
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Joblinkr$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: jobs,
            count: jobs.length,
            source: 'adzuna'
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

//# sourceMappingURL=%5Broot-of-the-server%5D__188c8e6a._.js.map