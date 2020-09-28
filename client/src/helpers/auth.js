export default function auth(){
    let store = localStorage.getItem('user') == null ? false : true;
    return store;
}