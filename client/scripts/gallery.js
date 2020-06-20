const gallery = {
	index: null,

	async init() {
		console.log("init");
		const titleElement = document.querySelector(".content > .title");
		if (location.pathname == "/") {
			document.querySelector(".top-nav").style.display = "none"; 
		}
		if (titleElement.textContent == "") {
			const path = location.pathname.split("/").filter(s => s != "");
			const title = path[path.length-1]
					.replace(/[_-]/g, " ")
					.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
			document.title = title;
			titleElement.textContent = title;
		}


	}
};

// gallery.init();
document.addEventListener("turbolinks:load", gallery.init.bind(gallery));
window.gallery = gallery;