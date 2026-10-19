export function inp(extra) {
    return {
        background: '#fff',
        border: '1.5px solid #e9d0aa',
        color: '#321a07',
        fontFamily: 'inherit',
        ...extra,
    };
}
export const IC = 'w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors';
export function focusBrown(e) {
    e.target.style.borderColor = '#a96e2c';
}
export function blurBrown(e) {
    e.target.style.borderColor = '#e9d0aa';
}
