export function captilaizeString(st: string): string {
    return st.split("_").map(a => a.charAt(0).toUpperCase() + a.substring(1).toLowerCase()).join(" ");
}