({
	index: null,

	async init() {
		this.index = await (await fetch("/server/data-index.json")).json();
		console.log("index", this.index);
	}
}).init()