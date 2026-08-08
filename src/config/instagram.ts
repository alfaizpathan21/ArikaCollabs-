/**
 * Developer-Controlled Instagram Videos & Live Configuration
 * 
 * IMPORTANT SECURITY & INTEGRITY CONSTRAINTS:
 * - These URLs are strictly controlled by the developer via environment variables or hardcoded arrays.
 * - End-users and website visitors CANNOT edit, input, or override these URLs via UI or query parameters.
 * - Only verified Instagram domains (instagram.com, instagr.am) are permitted.
 */

export interface InstagramVideoItem {
    id: string;
    title: string;
    badge: string;
    rawUrl: string;
    aspectRatio: '9:16' | '1:1' | '16:9';
}

// Developer-controlled video list
export const DEFAULT_INSTAGRAM_VIDEOS: InstagramVideoItem[] = [
    {
        id: 'ig-live-1',
        title: 'Arika Digital Influence & Brand Live Session',
        badge: 'LIVE BROADCAST',
        rawUrl: 'https://www.instagram.com/arika_collabs/live/',
        aspectRatio: '9:16'
    },
    {
        id: 'ig-reel-1',
        title: 'Exclusive Luxury Campaign Highlight 2026',
        badge: 'REEL',
        rawUrl: 'https://www.instagram.com/p/C3x9L7mO8x_/',
        aspectRatio: '9:16'
    },
    {
        id: 'ig-post-1',
        title: 'Behind the Scenes: Creative Collaboration',
        badge: 'CAMPAIGN',
        rawUrl: 'https://www.instagram.com/p/C2v8K6mN7w_/',
        aspectRatio: '1:1'
    },
    {
        id: 'ig-reel-2',
        title: 'Influencer Talent Spotlight & High Fashion',
        badge: 'SPOTLIGHT',
        rawUrl: 'https://www.instagram.com/p/C1u7J5mL6v_/',
        aspectRatio: '9:16'
    },
    {
        id: 'ig-post-2',
        title: 'Community Q&A & Upcoming Events',
        badge: 'COMMUNITY',
        rawUrl: 'https://www.instagram.com/p/C0t6I4mK5u_/',
        aspectRatio: '1:1'
    }
];

export interface InstagramLiveConfig {
    rawUrl: string;
    isValidInstagramUrl: boolean;
    embedUrl: string | null;
    isEmbeddableType: boolean;
    contentType: 'live' | 'post' | 'reel' | 'tv' | 'profile' | 'unknown';
    contentId: string | null;
}

/**
 * Validates and extracts Instagram embed properties from the developer configuration.
 */
export function parseInstagramUrl(urlToTest: string): InstagramLiveConfig {
    const trimmed = (urlToTest || '').trim();

    try {
        const parsed = new URL(trimmed);
        const hostname = parsed.hostname.toLowerCase();

        // Strict Domain Validation
        const isInstagramDomain =
            hostname === 'instagram.com' ||
            hostname === 'www.instagram.com' ||
            hostname === 'm.instagram.com' ||
            hostname === 'instagr.am';

        if (!isInstagramDomain) {
            return {
                rawUrl: trimmed,
                isValidInstagramUrl: false,
                embedUrl: null,
                isEmbeddableType: false,
                contentType: 'unknown',
                contentId: null
            };
        }

        const pathname = parsed.pathname;

        // Match Instagram Post (/p/CODE/), Reel (/reel/CODE/), or TV (/tv/CODE/)
        const postMatch = pathname.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
        if (postMatch) {
            const type = postMatch[1] as 'p' | 'reel' | 'tv';
            const code = postMatch[2];
            const mappedType = type === 'reel' ? 'reel' : type === 'tv' ? 'tv' : 'post';
            return {
                rawUrl: trimmed,
                isValidInstagramUrl: true,
                embedUrl: `https://www.instagram.com/${type}/${code}/embed/captioned/`,
                isEmbeddableType: true,
                contentType: mappedType,
                contentId: code
            };
        }

        // Match Live URL or Profile (/username/live/ or /live/)
        if (pathname.includes('/live')) {
            return {
                rawUrl: trimmed,
                isValidInstagramUrl: true,
                embedUrl: null, // Instagram Live streams direct iframe embedding fallback
                isEmbeddableType: false,
                contentType: 'live',
                contentId: null
            };
        }

        return {
            rawUrl: trimmed,
            isValidInstagramUrl: true,
            embedUrl: null,
            isEmbeddableType: false,
            contentType: 'profile',
            contentId: null
        };

    } catch {
        return {
            rawUrl: trimmed,
            isValidInstagramUrl: false,
            embedUrl: null,
            isEmbeddableType: false,
            contentType: 'unknown',
            contentId: null
        };
    }
}

/**
 * Helper function for backward compatibility
 */
export function getInstagramLiveConfig(customUrl?: string): InstagramLiveConfig {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    const envUrl = metaEnv ? metaEnv.VITE_INSTAGRAM_LIVE_URL : undefined;
    const url = customUrl || envUrl || DEFAULT_INSTAGRAM_VIDEOS[0].rawUrl;
    return parseInstagramUrl(url);
}

/**
 * Get Developer-Configured List of Instagram Videos
 */
export function getInstagramVideoList(): InstagramVideoItem[] {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    const envVideosRaw = metaEnv ? metaEnv.VITE_INSTAGRAM_VIDEOS : undefined;

    if (envVideosRaw) {
        try {
            // Check if JSON array
            if (envVideosRaw.trim().startsWith('[')) {
                const parsed = JSON.parse(envVideosRaw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((url: string, index: number) => ({
                        id: `env-ig-${index}`,
                        title: `Arika Featured Post ${index + 1}`,
                        badge: 'INSTAGRAM',
                        rawUrl: url,
                        aspectRatio: '9:16'
                    }));
                }
            } else {
                // Comma separated URLs
                const urls = envVideosRaw.split(',').map(s => s.trim()).filter(Boolean);
                if (urls.length > 0) {
                    return urls.map((url, index) => ({
                        id: `env-ig-${index}`,
                        title: `Arika Featured Post ${index + 1}`,
                        badge: 'INSTAGRAM',
                        rawUrl: url,
                        aspectRatio: '9:16'
                    }));
                }
            }
        } catch {
            // Fallback to DEFAULT_INSTAGRAM_VIDEOS
        }
    }

    return DEFAULT_INSTAGRAM_VIDEOS;
}

