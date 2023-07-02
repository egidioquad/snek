import Leaderboard from "../components/leaderboard";
import SnakeGame from "@/components/snake";
import Dashboard from "@/components/web3button";
import React from "react";

const App: React.FC = () => {
	return (
		<div>

			<SnakeGame />
			<Dashboard />
		</div>
	);
}
//  <Leaderboard />
export default App;
