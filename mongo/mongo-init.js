db.createUser(
	{
			user: "admin",
			pwd: "team4Element",
			roles: [
					{
							role: "readWrite",
							db: "phoenixScout"
					}
			]
	}
);