const _url = process.env.REACT_APP_URL;

const getData = async (fromDate, toDate, dataHandler, errorHandler) => {
    try {
        let response = await fetch(`${_url}/v1/bpi?from=${fromDate}&to=${toDate}`);
        if (response.status == 500) {
            errorHandler("Error While connecting to server");
            return;
        }
        let json = await response.json();
        if (response.ok == true && response.status == 200) dataHandler(json);
        else errorHandler(Object.values(json))
    } catch (error) {
        errorHandler(["Error Couldnt connect to server"]);
    }
}

export default { getData }