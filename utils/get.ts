export function getFirstItem(str: string | false | undefined) {
    if (!str) return;
    // Split the string by the comma delimiter
    const items = str.split(",");

    // Return the first element of the resulting array
    if (items.length > 0) {
        return items[0].trim(); // Use trim() to remove any leading/trailing whitespace
    } else {
        return; // Return null if the string is empty or has no commas
    }
}

export function getRandom<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
getRandom.int = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

getRandom.array = function <T>(array: T[], count?: number): T[] {
    if (array.length === 0) return [];

    // 1. If no count is provided, just shuffle the whole thing
    if (typeof count !== "number") {
        return [...array].sort(() => 0.5 - Math.random());
    }

    // 2. If count is higher than length, we need to pick with replacement
    if (count > array.length) {
        return Array.from({ length: count }, () => {
            const randomIndex = Math.floor(Math.random() * array.length);
            return array[randomIndex];
        });
    }

    // 3. Standard shuffle and slice (your original logic)
    return [...array].sort(() => 0.5 - Math.random()).slice(0, count);
};

getRandom.subsection = function <T>(array: T[], minLength: number = 1, maxLength: number = Infinity): T[] {
    const n = array.length;

    // If the array is smaller than our required minimum, return the whole thing
    if (n <= minLength) return array;

    // 1. Determine the starting point
    // We must start at a point where at least minLength items remain
    const maxStart = n - minLength;
    const start = Math.floor(Math.random() * (maxStart + 1));

    // 2. Determine the range of possible end points
    // The absolute furthest we can go is the end of the array
    const absoluteEnd = n;
    // The furthest we are allowed to go based on maxLength
    const restrictedEnd = start + maxLength;

    // The actual maximum end index is the smaller of the two
    const limit = Math.min(absoluteEnd, restrictedEnd);

    // The minimum end index is simply start + minLength
    const minEnd = start + minLength;

    // 3. Pick a random end between minEnd and limit
    const end = Math.floor(Math.random() * (limit - minEnd + 1)) + minEnd;

    return array.slice(start, end);
};

export function getArabicNumber(input: number) {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return input.toString().replace(/\d/g, (digit) => arabicNumerals[parseInt(digit)]);
}

export function getArrayByRange(min: number, max: number) {
    const fontSizeArray = [];

    for (let i = min; i <= max; i++) {
        fontSizeArray.push(i);
    }

    return fontSizeArray;
}
/**
 * used to convert chapterInfo.time
 * @given 1.27.02
 * @returns 1h 27 mins
 */
export function formatChapterTime(time: string): string {
    // Split the input string by "."
    const parts = time.split(".");

    // Initialize hours, minutes and seconds.
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (parts.length === 3) {
        // Format is "H.MM.SS", e.g. "1.34.54"
        hours = parseInt(parts[0], 10);
        minutes = parseInt(parts[1], 10);
        seconds = parseInt(parts[2], 10);
    } else if (parts.length === 2) {
        // Format is "M.SS", e.g. "1.11" or "0.12"
        minutes = parseInt(parts[0], 10);
        seconds = parseInt(parts[1], 10);
    } else if (parts.length === 1) {
        // Only seconds provided.
        seconds = parseInt(parts[0], 10);
    }

    // Calculate the total seconds.
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // If the time is less than one minute, show seconds.
    if (totalSeconds < 60) {
        return `${totalSeconds} sec${totalSeconds === 1 ? "" : "s"}`;
    }

    // For times of one minute or more, round to the nearest minute.
    // (i.e. if the seconds part is 30 or more, round up)
    if (totalSeconds < 3600) {
        // Calculate minutes as a rounded value.
        const roundedMinutes = Math.round(totalSeconds / 60);
        // If the rounding gives 60 minutes, display as 1 hour.
        if (roundedMinutes === 60) {
            return "1h";
        }
        return `${roundedMinutes} min${roundedMinutes === 1 ? "" : "s"}`;
    } else {
        // For times with an hour, calculate hours and the remainder minutes.
        let computedHours = Math.floor(totalSeconds / 3600);
        const remainingSeconds = totalSeconds % 3600;
        let roundedMinutes = Math.round(remainingSeconds / 60);

        // It’s possible the rounding bumps the minutes to 60.
        if (roundedMinutes === 60) {
            computedHours += 1;
            roundedMinutes = 0;
        }

        // If there are no minutes after rounding, show only hours.
        if (roundedMinutes === 0) {
            return `${computedHours}h`;
        }
        return `${computedHours}h ${roundedMinutes} min${roundedMinutes === 1 ? "" : "s"}`;
    }
}

export function getPercent(part: number, total: number, decimals: "with decimals" | false = false): number {
    if (total === 0) return 0;

    const percent = (part / total) * 100;

    return decimals ? parseFloat(percent.toFixed(2)) : Math.round(percent);
}

getPercent.string = (part: number, total: number, decimals: "with decimals" | false = false) => `${getPercent(part, total, decimals)}%` as const;

/**
 * A utility to handle index navigation safely.
 * Prevents out-of-bounds errors and ensures valid indices.
 */
export const getSafeIdx = (current: number, total: number) => ({
    increment: (): number => {
        // If index is invalid or at the end, stay at the end
        if (current === -1) return 0;
        return Math.min(current + 1, total - 1);
    },
    decrement: (): number => {
        // If index is invalid or at the start, stay at 0
        if (current <= 0) return 0;
        return current - 1;
    },
});
