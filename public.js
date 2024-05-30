// Function to add movie to public list from movie name appearing page
function addToPublicListFromNamePage(movieID, movieTitle) {
    let list = userLists.find(list => list.isPublic === true);
    if (!list) {
        list = { name: "Public List", isPublic: true, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    alert(`Added "${movieTitle}" to Public List`);
    displayUserLists();
}

// Function to add movie to public list
function addToPublicList(movieID, movieTitle) {
    let list = userLists.find(list => list.isPublic === true);
    if (!list) {
        list = { name: "Public List", isPublic: true, movies: [] };
        userLists.push(list);
    }

    list.movies.push({ title: movieTitle, id: movieID });
    alert(`Added "${movieTitle}" to Public List`);
    displayUserLists();
}
