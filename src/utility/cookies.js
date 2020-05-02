/**
* Används för att lättare handskas med cookies. Gör det lättare
* att komma åt, radera och sätta cookies.
*
* baseras på kod från: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
*
* @author Filip Garamvölgyi
* @created 2020-04-23
*/

/**
* Används för att sätta värde på en cookie. Så väl en ny
* cookie som en gammal.
*
* @param    key bestämmer namnet på cookie:n
* @param    val bestämmer värdet på cookie:n
*/
function setCookie(key, val){
    document.cookie = `${key} = ${val}`
}

/**
* Returnerar en cookie baserat på namn.
*
* @param    key namnet op cookie:n som ska hämtas.
* @return       returnerar antingen en sträng innehållande
*               cookie:n eller null.
*/
function getCookie(key){
    let nameEQ = key + "=";
	let ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ')
            c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length,c.length);
	}
	return null;
}

/**
* Används för att ta bort cookies.
*
* @param    key namnet på cookien som ska tas bort
*/
function deleteCookie(key){
    document.cookie = key+'=; Max-Age=-99999999;';
}

export {setCookie, getCookie, deleteCookie};
