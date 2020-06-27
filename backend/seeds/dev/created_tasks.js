
exports.seed = function(knex, Promise) {
	
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let gRand = (min, max) => Math.floor(Math.random() * (max - min) + min)
	let getPhase = (min, max) => {
		let phraseSize = gRand(min, max);
		let phrase = [];
		for (let p = 0; p < phraseSize; p++) {
			let sizeLetter = gRand(3, 15);
			let word = "";
			for (let c = 0; c < sizeLetter; c++) {
				let cindex = gRand(0, (characters.length - 1))
				word += characters[cindex];
			}
			phrase.push(word);
		}
		return phrase.join(" ")
	}
	
	// Deletes ALL existing entries
  	return knex('tasks').del()
    	.then(function () {
      		var issues = [];
      		for (let i = 0; i < 80; i++) {
				issues.push({
					"userId": 1,
					"title": getPhase(2, 6),
					"description": getPhase(20, 140),
					"priority": gRand(1,3),
					"situation": gRand(1,6),
					"status": 1,
					"startDate": new Date(2019, gRand(3,8), gRand(1,25)),
					"endDate": null,
				})
      		}
			// Inserts seed entries
			return knex('tasks').insert(issues);
    	});
};
