export const escapeFunc = (value: any) => {
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent || "";
}