mongo-shell:
	docker exec -it phoenix-scout_mongo1_1 mongo
mongo-init:
	docker exec phoenix-scout_mongo1_1 mongo < ./init.js