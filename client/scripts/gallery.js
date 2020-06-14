({
	index: null,

	async init() {
		this.index = await (await fetch("/server/data-index.json")).json();
		console.log("index", this.index);
		if (location.pathname == "/") {
			document.querySelector(".top-nav .back").style.display = "none";
		}
		const titleElement = document.querySelector(".content > .title");
		if (titleElement.textContent == "") {
			const path = location.pathname.split("/").filter(s => s != "");
			const title = path[path.length-1].replace(/(^\w|\s\w)/g, m => m.toUpperCase());
			document.title = title;
			titleElement.textContent = title;
		}
	}
}).init()