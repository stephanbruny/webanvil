export default function (host = "localhost:8300") {
    const getUrlPath = path => `http://${host}/${path}`;
    const getUrl = (path, options) => fetch(`http://${host}/${path}`, options);
    const getJson = (path) => getUrl(path).then((res) => res.json());
    const getText = (path) => getUrl(path).then((res) => res.text());
    const listTemplates = () => getJson("api/html");
    const listPartials = () => getJson("api/partial");

    const postJson = (path, data, contentType = 'text/plain') =>
        fetch(getUrlPath(path), {
            method: "POST",
            headers: {
                "Content-Type":contentType,
            },
            body: data,
        });

    const saveTemplate = (name, content) => postJson(`api/html/${name}`, content);
    const savePartial = (name, content) => postJson(`api/partial/${name}`, content);

    return {
        listTemplates,
        listPartials,
        getTemplate: (name) => getText(`api/html/${name}`),
        getPartial: (name) => getText(`api/partial/${name}`),
        saveTemplate,
        savePartial
    };
}
