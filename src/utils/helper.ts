export function sumValues(percentages: { [key: string]: number }) {
    return Object.values(percentages).reduce((acc, value) => {
        return acc + value
    }, 0)
}