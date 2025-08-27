const EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes in ms

export function setItem(key: string, value: string) {
    const now = Date.now();
    const item = {
        value,
        expiry: now + EXPIRY_TIME,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export function getItem(key: string): string | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    try {
        const item = JSON.parse(itemStr) as { value: string; expiry: number };
        if (Date.now() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    } catch {
        return null;
    }
}