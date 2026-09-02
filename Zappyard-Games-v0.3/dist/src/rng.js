export class RNG {
    state;
    constructor(seed = Date.now() >>> 0) {
        this.state = seed >>> 0;
        if (this.state === 0)
            this.state = 0x6d2b79f5;
    }
    next() {
        // Mulberry32
        let t = this.state += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    int(maxExclusive) {
        return Math.floor(this.next() * maxExclusive);
    }
    pick(items) {
        return items[this.int(items.length)];
    }
}
