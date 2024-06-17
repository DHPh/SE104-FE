export default function SetLoadingCursor(loading: boolean = true) {
    if (loading) {
        document.body.classList.add("loading-cursor"); // Set cursor to loading
    } else {
        document.body.classList.remove("loading-cursor");
    }
}
