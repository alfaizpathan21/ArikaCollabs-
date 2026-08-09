/**
 * Developer-Controlled Instagram Videos & Live Configuration
 * 
 * IMPORTANT SECURITY & INTEGRITY CONSTRAINTS:
 * - These URLs are strictly controlled by the developer via environment variables or hardcoded arrays.
 * - End-users and website visitors CANNOT edit, input, or override these URLs via UI or query parameters.
 * - Only verified Instagram domains (instagram.com, instagr.am) are permitted.
 */

export interface InstagramVideoItem {
    id: number | string;
    url: string;
    rawUrl?: string;
    title?: string;
    badge?: string;
    aspectRatio?: '9:16' | '1:1' | '16:9';
}

// Centralized developer-controlled list of 9 Instagram videos
export const instagramVideos: InstagramVideoItem[] = [
    {
        id: 1,
        url: 'https://www.instagram.com/reel/DaxcMQyMDng/',
        rawUrl: 'https://www.instagram.com/reel/DaxcMQyMDng/',
        title: 'Arika Featured Reel 1',
        badge: 'REEL',
        aspectRatio: '9:16'
    },
    {
        id: 2,
        url: 'https://www.instagram.com/p/C3x9L7mO8x_/',
        rawUrl: 'https://www.instagram.com/p/C3x9L7mO8x_/',
        title: 'Arika Campaign Post 2',
        badge: 'CAMPAIGN',
        aspectRatio: '9:16'
    },
    {
        id: 3,
        url: 'https://www.instagram.com/p/C2v8K6mN7w_/',
        rawUrl: 'https://www.instagram.com/p/C2v8K6mN7w_/',
        title: 'Arika Brand Highlight 3',
        badge: 'SPOTLIGHT',
        aspectRatio: '1:1'
    },
    {
        id: 4,
        url: 'https://www.instagram.com/p/C1u7J5mL6v_/',
        rawUrl: 'https://www.instagram.com/p/C1u7J5mL6v_/',
        title: 'Arika Collaboration 4',
        badge: 'COLLAB',
        aspectRatio: '9:16'
    },
    {
        id: 5,
        url: 'https://www.instagram.com/p/C0t6I4mK5u_/',
        rawUrl: 'https://www.instagram.com/p/C0t6I4mK5u_/',
        title: 'Arika Influencer Showcase 5',
        badge: 'SHOWCASE',
        aspectRatio: '1:1'
    },
    {
        id: 6,
        url: 'https://www.instagram.com/reel/C8x9L7mO8x_/',
        rawUrl: 'https://www.instagram.com/reel/C8x9L7mO8x_/',
        title: 'Arika Digital Content 6',
        badge: 'REEL',
        aspectRatio: '9:16'
    },
    {
        id: 7,
        url: 'https://www.instagram.com/p/C7v8K6mN7w_/',
        rawUrl: 'https://www.instagram.com/p/C7v8K6mN7w_/',
        title: 'Arika Lifestyle Feature 7',
        badge: 'LIFESTYLE',
        aspectRatio: '1:1'
    },
    {
        id: 8,
        url: 'https://www.instagram.com/p/C6u7J5mL6v_/',
        rawUrl: 'https://www.instagram.com/p/C6u7J5mL6v_/',
        title: 'Arika Behind The Scenes 8',
        badge: 'BTS',
        aspectRatio: '9:16'
    },
    {
        id: 9,
        url: 'https://www.instagram.com/p/C5t6I4mK5u_/',
        rawUrl: 'https://www.instagram.com/p/C5t6I4mK5u_/',
        title: 'Arika Exclusive Event 9',
        badge: 'EVENT',
        aspectRatio: '1:1'
    }
];

export const DEFAULT_INSTAGRAM_VIDEOS = instagramVideos;

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
    return instagramVideos.map((item) => ({
        ...item,
        rawUrl: item.rawUrl || item.url,
        url: item.url || item.rawUrl || '',
        title: item.title || `Arika Featured Video ${item.id}`,
        badge: item.badge || 'INSTAGRAM',
        aspectRatio: item.aspectRatio || '9:16'
    }));
}

/**
 * Get Developer-Configured Autoplay Muted Video URL
 */
export function getAutoplayMutedVideoUrl(): string {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    return (metaEnv?.VITE_AUTOPLAY_MUTED_VIDEO_URL || '').trim();
}

