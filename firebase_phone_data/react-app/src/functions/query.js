
function getQValue(q_term = "q") {

    let search = window.location.search;

    search = search.split("?")[1];

    if (search === undefined) {
        return undefined;
    }

    let search_arr = search.split("&");

    let q = search_arr.reduce((acc, cur) => {

        if (acc !== undefined) {
            return acc;
        }

        const tmp = cur.split("=");
        cur = {
            key: tmp[0],
            value: tmp[1]
        }

        if (cur.key === q_term) {
            acc = cur.value
        }
        return acc;
    }, undefined);

    return q;
}

function replaceQValue(q_term = "q", replace_value = "") {

    let search = window.location.search;

    const top_search_arr = search.split("?");

    console.log({ top_search_arr })

    let url_start = top_search_arr[0];
    let search_result = top_search_arr[1];

    let search_arr = search_result.split("&");

    let query_obj = search_arr.reduce((acc, cur, i, arr) => {

        const tmp = cur.split("=");
        // const to_return = {
        //     key:tmp[0],
        //     value:tmp[1]
        // }
        acc[tmp[0]] = tmp[1];
        return acc

    }, {});

    query_obj[q_term] = replace_value;

    console.log({ query_obj });

    query_obj[q_term] = replace_value;

    const new_search = Object.keys(query_obj).reduce((acc, cur, i, arr) => {

        // let {key,value} = cur;
        const key = cur;
        const value = query_obj[key];

        const ending_char = i + 1 === arr.length ? "" : "&";

        return acc + `${key}=${value}${ending_char}`;


    }, "?");

    const new_url = window.location.href.split(window.location.search)[0] + new_search;
    console.log({ new_url });

    return new_url;
}

function getDataValue(key) {
    const value = getQValue(key) || localStorage.getItem(key);
    localStorage.setItem(`_app_data_${key}`, value);
    return value;
}

export {
    getQValue,
    replaceQValue,
    getDataValue,
}