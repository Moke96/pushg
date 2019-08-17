function test() {
    fetch("localhost:3000/API/lol", {method:"GET"})
        .then(data => data.json())
        .then(res => {
            console.log(res);
            result = res;
        });

    return result;
}