'use strict';
function HttpService() {
    this._request = function(method, url) {
        const promise = new Promise((success, error) => {
            const xhr = new XMLHttpRequest();

            xhr.open(method, url, true);
            xhr.send();
            xhr.onerror = function(error){
                console.log(error);
            }
            xhr.onreadystatechange = function() {
                if (this.readyState !== 4) {
                    return;
                } else {
                    success(this.responseText);
                }
            }
        });

        return promise;
    }

    this.get  = function (url) {
		return this._request('GET', url)
	}
	
    this.post = function(url) {
		return this._request('POST', url)
	}	
}