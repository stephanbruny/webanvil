export default function(host = 'localhost:8300') {
    const getUrl = (path, options) => fetch(`http://${host}/${path}`, options);
    const getJson = path => getUrl(path).then(res => res.json());
    const getText = path => getUrl(path).then(res => res.text());
    const listTemplates = () => getJson('api/html');
    const listPartials = () => getJson('api/partial');
    return {
        listTemplates,
        listPartials,
        getTemplate: name => getText(`api/html/${name}`)
    }
}