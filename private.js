// Function to add movie to private list from movie name appearing page
function addToPrivateListFromNamePage(movieID, movieTitle) {
    let list = userLists.find(list => list.isPublic === false);
    if (!list) {
        list = { name: "Private List", isPublic: false, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    alert(`Added "${movieTitle}" to Private List`);
    displayUserLists();
}

// Function to add movie to private list
function addToPrivateList(movieID, movieTitle) {
    let list = userLists.find(list => list.isPublic === false);
    if (!list) {
        list = { name: "Private List", isPublic: false, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    alert(`Added "${movieTitle}" to Private List`);
    displayUserLists();
}
