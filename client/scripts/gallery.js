({
	index: null,

	async init() {
		this.index = await (await fetch("/server/data-index.json")).json();
		console.log("index", this.index);
		const titleElement = document.querySelector(".content > .title");
		if (location.pathname == "/") {
			document.querySelector(".top-nav .back").style.display = "none"; 
			// TODO: show sidebar button instead
			const siteTitleElement = document.querySelector(".top-nav .site-title");
			titleElement.textContent = siteTitleElement.textContent;
			siteTitleElement.textContent = "";
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
}).init()