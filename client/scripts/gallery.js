({
	index: null,

	async init() {
		this.index = await (await fetch("/server/index.json")).json();
		console.log("index", this.index);
	}
}).init()