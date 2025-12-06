run-dev:
	docker run -d --rm \
		--name yield-chaser-dev \
		-e TERM=xterm-256color \
		-w /app \
		-v "$$(pwd)":/app \
		--user 1000:1000 \
		-p 8545:8545 \
		-p 3000:3000 \
		node tail -f /dev/null

bash-dev:
	docker exec -ti yield-chaser-dev bash

stop-dev:
	docker stop yield-chaser-dev

run-frontend:
	docker exec -w /app/frontend -ti yield-chaser-dev npm run dev

run-hardhat-node:
	docker exec -w /app/backend -ti yield-chaser-dev npx hardhat node

deploy-localhost:
	docker exec -w /app/backend -ti yield-chaser-dev npx hardhat run scripts/localhost/deploy.ts

test:
	docker exec -w /app/backend yield-chaser-dev npx hardhat test --coverage

deploy-sepolia:
	docker exec -w /app/backend -ti yield-chaser-dev npx hardhat run scripts/sepoliadeploy.ts

verify-sepolia:
	docker exec -w /app/backend -ti yield-chaser-dev \
		npx hardhat verify --network sepolia 0xCBfa14005ef442f9B3c3cEA517f0af1783C36a38 0x361680F6052786187dFEe22355eD18113A8de3DC 40000000000000 5000