(function getOptions() {
    let options = [];
    const items = document.getElementsByClassName('bullet-point-text');

    for (let item of items) {
        options.push(item.innerText);
    }

    options.sort();

    options = options.reduce((obj, item) => {
        return ({...obj, [item.toUpperCase()]:true})
    }, {})

    setTimeout(() => {
        navigator.clipboard.writeText(JSON.stringify(options)).then(() => {
            console.log('Options copied to clipboard!');
        })
    }, 2000);

    console.log('Please click on page in 3 sec');
})()
