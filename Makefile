run-node:
	docker run -d --name yield-chaser-dev --rm -w /app -v "$$(pwd)":/app --user 1000:1000  -p 8545:8545 -p 3000:3000 node tail -f /dev/null

bash-node:
	docker exec -ti -e TERM=xterm-256color yield-chaser-dev bash

stop-node:
	docker stop yield-chaser-dev

run-frontend:
	docker exec -w /app/frontend -e TERM=xterm-256color -ti yield-chaser-dev npm run dev

run-hardhat-node:
	docker exec -w /app/backend -e TERM=xterm-256color -ti yield-chaser-dev npx hardhat node