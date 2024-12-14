export function calcResult(oldPrice: number, newPrice: number) {
    return ((newPrice - oldPrice) / oldPrice) * 100
}